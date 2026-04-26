import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

interface AuthModalProps {
  onClose: () => void
  defaultMode?: 'signin' | 'signup'
}

export default function AuthModal({ onClose, defaultMode = 'signin' }: AuthModalProps) {
  const { signIn, signUp } = useAuth()
  const [mode, setMode] = useState<'signin' | 'signup'>(defaultMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    let result: { error?: string }
    if (mode === 'signin') {
      result = await signIn(email, password)
    } else {
      result = await signUp(email, password, name)
    }
    setLoading(false)
    if (result.error) {
      setError(result.error)
    } else {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="relative w-full max-w-md mx-4 rounded-2xl border border-border p-8"
        style={{ background: '#14142a' }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-5 text-subtle text-xl hover:text-text transition-colors"
          aria-label="Close"
        >
          ×
        </button>

        <div className="text-center mb-8">
          <div className="text-2xl text-gold font-serif tracking-widest mb-1">
            Deep<span style={{ color: '#e8e0d5' }}>Match</span>
          </div>
          <p className="text-subtle text-sm mt-2">
            {mode === 'signin' ? 'Welcome back.' : 'Begin your deep journey.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs text-subtle mb-1">Your name</label>
              <input
                type="text"
                placeholder="First name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-text font-serif text-sm focus:outline-none focus:border-gold transition-colors"
              />
            </div>
          )}
          <div>
            <label className="block text-xs text-subtle mb-1">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-text font-serif text-sm focus:outline-none focus:border-gold transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-subtle mb-1">Password</label>
            <input
              type="password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-text font-serif text-sm focus:outline-none focus:border-gold transition-colors"
            />
          </div>
          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary mt-2"
            style={{ opacity: loading ? 0.6 : 1 }}
          >
            {loading ? 'Please wait…' : mode === 'signin' ? 'Sign in →' : 'Create account →'}
          </button>
        </form>

        <div className="text-center mt-6">
          <button
            onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError('') }}
            className="text-subtle text-sm hover:text-gold transition-colors"
          >
            {mode === 'signin' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  )
}
