import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface RequireAuthProps {
  children: React.ReactNode
}

export default function RequireAuth({ children }: RequireAuthProps) {
  const { user, loading, openAuthModal } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && !user) {
      navigate('/', { replace: true })
      openAuthModal('signup')
    }
  }, [user, loading, navigate, openAuthModal])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-subtle">
        <div className="text-3xl animate-pulse">✦</div>
      </div>
    )
  }

  if (!user) return null

  return <>{children}</>
}
