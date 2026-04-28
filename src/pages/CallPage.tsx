import { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSocket } from '../context/SocketContext'

const CALL_DURATION = 5 * 60
const EXTEND_PROMPT_AT = 4.5 * 60

const ICE_SERVERS = [{ urls: 'stun:stun.l.google.com:19302' }]

interface LocationState {
  roomId: string
  role: 'caller' | 'callee'
  preference: 'voice' | 'video'
}

type ExtendState = 'none' | 'prompted' | 'waiting' | 'accepted'

export default function CallPage() {
  const socket = useSocket()
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as LocationState | null

  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const remoteAudioRef = useRef<HTMLAudioElement>(null)
  const pcRef = useRef<RTCPeerConnection | null>(null)
  const localStreamRef = useRef<MediaStream | null>(null)

  const [elapsed, setElapsed] = useState(0)
  const [extendState, setExtendState] = useState<ExtendState>('none')
  const [peerExtendRequested, setPeerExtendRequested] = useState(false)
  const [connected, setConnected] = useState(false)
  const [callEnded, setCallEnded] = useState(false)
  const [muted, setMuted] = useState(false)
  const [videoOff, setVideoOff] = useState(false)

  const roomId = state?.roomId
  const role = state?.role
  const preference = state?.preference ?? 'voice'
  const isVideo = preference === 'video'

  const endCall = useCallback(
    (emitEnd = true) => {
      if (callEnded) return
      setCallEnded(true)
      if (emitEnd && roomId) socket.emit('call-ended', { roomId })
      localStreamRef.current?.getTracks().forEach((t) => t.stop())
      pcRef.current?.close()
      navigate('/post-call', { state: { roomId } })
    },
    [callEnded, roomId, socket, navigate]
  )

  // Timer — also handles extend prompt trigger inline
  useEffect(() => {
    if (!connected) return
    const interval = setInterval(() => {
      setElapsed((e) => {
        const next = e + 1
        if (next >= EXTEND_PROMPT_AT) {
          setExtendState((cur) => (cur === 'none' ? 'prompted' : cur))
        }
        if (next >= CALL_DURATION) {
          clearInterval(interval)
          endCall()
        }
        return next
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [connected, endCall])

  // WebRTC setup
  useEffect(() => {
    if (!roomId || !role) {
      navigate('/connect')
      return
    }

    let pc: RTCPeerConnection

    async function setupWebRTC() {
      const constraints: MediaStreamConstraints = isVideo
        ? { audio: true, video: { width: 640, height: 480 } }
        : { audio: true, video: false }

      let stream: MediaStream
      try {
        stream = await navigator.mediaDevices.getUserMedia(constraints)
      } catch {
        stream = new MediaStream()
      }
      localStreamRef.current = stream

      if (isVideo && localVideoRef.current) {
        localVideoRef.current.srcObject = stream
      }

      pc = new RTCPeerConnection({ iceServers: ICE_SERVERS })
      pcRef.current = pc

      stream.getTracks().forEach((track) => pc.addTrack(track, stream))

      pc.ontrack = (event) => {
        const [remoteStream] = event.streams
        if (isVideo && remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream
        } else if (!isVideo && remoteAudioRef.current) {
          remoteAudioRef.current.srcObject = remoteStream
        }
        setConnected(true)
      }

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit('ice-candidate', { roomId, candidate: event.candidate })
        }
      }

      pc.onconnectionstatechange = () => {
        if (pc.connectionState === 'connected') setConnected(true)
      }

      if (role === 'caller') {
        const offer = await pc.createOffer()
        await pc.setLocalDescription(offer)
        socket.emit('offer', { roomId, offer })
      }
    }

    setupWebRTC()

    function onOffer({ offer }: { offer: RTCSessionDescriptionInit }) {
      if (!pc) return
      pc.setRemoteDescription(new RTCSessionDescription(offer)).then(async () => {
        const answer = await pc.createAnswer()
        await pc.setLocalDescription(answer)
        socket.emit('answer', { roomId, answer })
        setConnected(true)
      })
    }

    function onAnswer({ answer }: { answer: RTCSessionDescriptionInit }) {
      pc?.setRemoteDescription(new RTCSessionDescription(answer))
      setConnected(true)
    }

    function onIceCandidate({ candidate }: { candidate: RTCIceCandidateInit }) {
      pc?.addIceCandidate(new RTCIceCandidate(candidate))
    }

    function onPeerEnded() { endCall(false) }
    function onPeerDisconnected() { endCall(false) }

    function onExtendRequested() {
      setPeerExtendRequested(true)
      setExtendState('prompted')
    }

    function onCallExtended() {
      setExtendState('accepted')
      setPeerExtendRequested(false)
      setElapsed(0)
    }

    function onExtendDeclined() { endCall(false) }

    socket.on('offer', onOffer)
    socket.on('answer', onAnswer)
    socket.on('ice-candidate', onIceCandidate)
    socket.on('peer-ended-call', onPeerEnded)
    socket.on('peer-disconnected', onPeerDisconnected)
    socket.on('extend-requested', onExtendRequested)
    socket.on('call-extended', onCallExtended)
    socket.on('extend-declined', onExtendDeclined)

    return () => {
      socket.off('offer', onOffer)
      socket.off('answer', onAnswer)
      socket.off('ice-candidate', onIceCandidate)
      socket.off('peer-ended-call', onPeerEnded)
      socket.off('peer-disconnected', onPeerDisconnected)
      socket.off('extend-requested', onExtendRequested)
      socket.off('call-extended', onCallExtended)
      socket.off('extend-declined', onExtendDeclined)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, role])

  function handleExtend() {
    socket.emit('extend-request', { roomId })
    setExtendState('waiting')
  }

  function handleDeclineExtend() {
    socket.emit('extend-decline', { roomId })
    endCall(false)
  }

  function toggleMute() {
    localStreamRef.current?.getAudioTracks().forEach((t) => { t.enabled = !t.enabled })
    setMuted((m) => !m)
  }

  function toggleVideo() {
    localStreamRef.current?.getVideoTracks().forEach((t) => { t.enabled = !t.enabled })
    setVideoOff((v) => !v)
  }

  const progress = Math.min(elapsed / CALL_DURATION, 1)
  const remaining = CALL_DURATION - elapsed
  const remainingMin = Math.floor(remaining / 60)
  const remainingSec = remaining % 60

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {isVideo ? (
        <video ref={remoteVideoRef} autoPlay playsInline className="flex-1 w-full object-cover bg-gray-900" />
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center bg-gray-900 gap-4">
          <audio ref={remoteAudioRef} autoPlay />
          <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center text-4xl">
            {connected ? '🎤' : '⏳'}
          </div>
          <p className="text-gray-400 text-sm">{connected ? 'Voice call connected' : 'Connecting…'}</p>
        </div>
      )}

      {isVideo && (
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
          className="absolute bottom-32 right-4 w-28 h-40 object-cover rounded-xl bg-gray-800 border border-gray-700"
        />
      )}

      <div className="px-4 pt-3 pb-1">
        <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full bg-indigo-500 transition-all duration-1000" style={{ width: `${progress * 100}%` }} />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-600">
            {connected ? `${remainingMin}:${remainingSec.toString().padStart(2, '0')} left` : 'Connecting…'}
          </span>
          {extendState === 'accepted' && <span className="text-xs text-indigo-400">Extended +5 min</span>}
        </div>
      </div>

      {(extendState === 'prompted' || extendState === 'waiting') && (
        <div className="mx-4 mb-2 bg-gray-900 border border-gray-700 rounded-2xl p-4 flex flex-col gap-3">
          <p className="text-white text-sm font-medium text-center">
            {peerExtendRequested ? 'They want to keep talking. Extend?' : 'Extend for another 5 minutes?'}
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleExtend}
              disabled={extendState === 'waiting'}
              className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white rounded-xl text-sm font-medium transition-colors"
            >
              {extendState === 'waiting' ? 'Waiting for them…' : 'Extend'}
            </button>
            <button
              onClick={handleDeclineExtend}
              className="flex-1 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-sm transition-colors"
            >
              End call
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-center gap-4 px-4 pb-6 pt-2">
        <button
          onClick={toggleMute}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
            muted ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          {muted ? '🔇' : '🎤'}
        </button>
        {isVideo && (
          <button
            onClick={toggleVideo}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
              videoOff ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {videoOff ? '📵' : '📹'}
          </button>
        )}
        <button
          onClick={() => endCall()}
          className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-500 flex items-center justify-center text-white text-xl transition-colors shadow-lg"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
