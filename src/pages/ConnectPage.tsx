import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSocket } from '../context/SocketContext'

type Preference = 'voice' | 'video' | 'either'

interface MatchFoundPayload {
  roomId: string
  role: 'caller' | 'callee'
  preference: 'voice' | 'video'
}

interface QueueJoinedPayload {
  position: number
  estimatedWait: number
}

export default function ConnectPage() {
  const socket = useSocket()
  const navigate = useNavigate()
  const [preference, setPreference] = useState<Preference>('voice')
  const [status, setStatus] = useState<'idle' | 'waiting' | 'matched'>('idle')
  const [waitSeconds, setWaitSeconds] = useState(0)
  const [estimatedWait, setEstimatedWait] = useState<number | null>(null)

  useEffect(() => {
    function onMatchFound(payload: MatchFoundPayload) {
      setStatus('matched')
      navigate('/call', { state: { roomId: payload.roomId, role: payload.role, preference: payload.preference } })
    }

    function onQueueJoined(payload: QueueJoinedPayload) {
      setEstimatedWait(payload.estimatedWait)
    }

    socket.on('match-found', onMatchFound)
    socket.on('queue-joined', onQueueJoined)

    return () => {
      socket.off('match-found', onMatchFound)
      socket.off('queue-joined', onQueueJoined)
    }
  }, [socket, navigate])

  useEffect(() => {
    if (status !== 'waiting') return
    const interval = setInterval(() => setWaitSeconds((s) => s + 1), 1000)
    return () => clearInterval(interval)
  }, [status])

  function handleConnect() {
    setStatus('waiting')
    setWaitSeconds(0)
    socket.emit('join-queue', { preference, genderPref: 'any' })
  }

  function handleCancel() {
    socket.emit('leave-queue')
    setStatus('idle')
    setWaitSeconds(0)
    setEstimatedWait(null)
  }

  function formatWait(seconds: number) {
    if (seconds < 60) return `${seconds}s`
    return `${Math.floor(seconds / 60)}m ${seconds % 60}s`
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm flex flex-col items-center gap-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white tracking-tight">DeepMatch</h1>
          <p className="mt-2 text-gray-400 text-sm">One call. One stranger. Right now.</p>
        </div>

        {status === 'idle' && (
          <>
            <div className="w-full bg-gray-900 rounded-2xl p-4 flex flex-col gap-3">
              <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Call type</p>
              <div className="flex gap-2">
                {(['voice', 'video', 'either'] as Preference[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPreference(p)}
                    className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
                      preference === p
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    {p === 'either' ? 'Either' : p === 'voice' ? '🎤 Voice' : '📹 Video'}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleConnect}
              className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-xl font-semibold rounded-2xl transition-colors shadow-lg shadow-indigo-900/40"
            >
              Connect
            </button>
          </>
        )}

        {status === 'waiting' && (
          <div className="w-full flex flex-col items-center gap-6">
            <div className="relative flex items-center justify-center w-28 h-28">
              <div className="absolute inset-0 rounded-full border-2 border-indigo-600/30 animate-ping" />
              <div className="absolute inset-2 rounded-full border-2 border-indigo-500/50 animate-pulse" />
              <span className="text-white text-lg font-mono">{formatWait(waitSeconds)}</span>
            </div>

            <div className="text-center">
              <p className="text-white font-medium">Looking for someone…</p>
              {estimatedWait !== null && estimatedWait > 0 && (
                <p className="text-gray-500 text-sm mt-1">
                  ~{estimatedWait < 60 ? `${estimatedWait}s` : `${Math.ceil(estimatedWait / 60)}m`} estimated wait
                </p>
              )}
              {waitSeconds >= 60 && (
                <p className="text-gray-500 text-sm mt-1">Keeping you in the queue…</p>
              )}
            </div>

            <button
              onClick={handleCancel}
              className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-sm transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
