import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSocket } from '../context/SocketContext'

interface LocationState {
  roomId: string
}

interface ChatMsg {
  from: string
  text: string
  ts: number
}

type Phase = 'vote' | 'waiting' | 'chat' | 'done'

export default function PostCallPage() {
  const socket = useSocket()
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as LocationState | null
  const roomId = state?.roomId

  const [phase, setPhase] = useState<Phase>('vote')
  const [messages, setMessages] = useState<ChatMsg[]>([])
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onMutualConnect({ roomId: confirmedRoom }: { roomId: string }) {
      if (confirmedRoom === roomId) setPhase('chat')
    }

    function onNoConnect() {
      setPhase('done')
    }

    function onChatMessage(msg: ChatMsg) {
      setMessages((m) => [...m, msg])
    }

    socket.on('mutual-connect', onMutualConnect)
    socket.on('no-connect', onNoConnect)
    socket.on('chat-message', onChatMessage)

    return () => {
      socket.off('mutual-connect', onMutualConnect)
      socket.off('no-connect', onNoConnect)
      socket.off('chat-message', onChatMessage)
    }
  }, [socket, roomId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function handleVote(connect: boolean) {
    if (!roomId) return
    socket.emit('post-call-vote', { roomId, connect })
    if (!connect) {
      setPhase('done')
    } else {
      setPhase('waiting')
    }
  }

  function sendMessage() {
    if (!input.trim() || !roomId) return
    socket.emit('chat-message', { roomId, text: input.trim() })
    setInput('')
  }

  function connectAgain() {
    navigate('/connect')
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm flex flex-col gap-6">
        {phase === 'vote' && (
          <>
            <div className="text-center">
              <p className="text-white text-2xl font-semibold">Did you want to connect?</p>
              <p className="text-gray-500 text-sm mt-2">Only you know your answer.</p>
            </div>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => handleVote(true)}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white text-lg font-semibold rounded-2xl transition-colors"
              >
                Yes, connect
              </button>
              <button
                onClick={() => handleVote(false)}
                className="w-full py-4 bg-gray-900 hover:bg-gray-800 text-gray-400 rounded-2xl transition-colors"
              >
                No thanks
              </button>
            </div>
          </>
        )}

        {phase === 'waiting' && (
          <div className="text-center flex flex-col gap-4">
            <div className="w-16 h-16 mx-auto rounded-full border-2 border-indigo-600/50 animate-pulse flex items-center justify-center text-2xl">
              ✉️
            </div>
            <p className="text-white text-lg font-medium">Waiting for them…</p>
            <p className="text-gray-500 text-sm">If they also say yes, a chat will open.</p>
            <button onClick={connectAgain} className="mt-4 text-gray-600 text-sm underline">
              Connect with someone new
            </button>
          </div>
        )}

        {phase === 'chat' && (
          <div className="flex flex-col h-[80vh]">
            <div className="text-center mb-4">
              <p className="text-indigo-400 text-sm font-medium">Mutual connection</p>
              <p className="text-white text-lg font-semibold">You both said yes ✓</p>
            </div>

            <div className="flex-1 overflow-y-auto bg-gray-900 rounded-2xl p-4 flex flex-col gap-2 min-h-0">
              {messages.length === 0 && (
                <p className="text-gray-600 text-sm text-center mt-8">Say hello…</p>
              )}
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${
                    msg.from === socket.id
                      ? 'self-end bg-indigo-600 text-white'
                      : 'self-start bg-gray-800 text-gray-200'
                  }`}
                >
                  {msg.text}
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            <div className="flex gap-2 mt-3">
              <input
                className="flex-1 bg-gray-900 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500"
                placeholder="Type a message…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              />
              <button
                onClick={sendMessage}
                className="px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm transition-colors"
              >
                Send
              </button>
            </div>

            <button onClick={connectAgain} className="mt-4 text-gray-600 text-sm text-center underline">
              Connect with someone new
            </button>
          </div>
        )}

        {phase === 'done' && (
          <div className="text-center flex flex-col gap-6">
            <p className="text-gray-400 text-lg">That&apos;s a wrap.</p>
            <button
              onClick={connectAgain}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white text-lg font-semibold rounded-2xl transition-colors"
            >
              Connect again
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
