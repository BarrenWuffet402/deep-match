import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { io, Socket } from 'socket.io-client'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SOCKET_URL = (import.meta as any).env?.VITE_SOCKET_URL || 'http://localhost:4000'

const SocketContext = createContext<Socket | null>(null)

export function SocketProvider({ children }: { children: ReactNode }) {
  const [socket] = useState<Socket>(() =>
    io(SOCKET_URL, { autoConnect: true, transports: ['websocket', 'polling'] })
  )

  useEffect(() => {
    return () => {
      socket.disconnect()
    }
  }, [socket])

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
}

export function useSocket(): Socket {
  const socket = useContext(SocketContext)
  if (!socket) throw new Error('useSocket must be used within SocketProvider')
  return socket
}
