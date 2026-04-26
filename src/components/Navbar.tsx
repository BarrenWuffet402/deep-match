import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, signOut, openAuthModal } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleSignOut = () => {
    signOut()
    setMenuOpen(false)
    navigate('/')
  }

  const navLinks = [
    { to: '/matches', label: 'Discover' },
    { to: '/how-it-works', label: 'How it works' },
    { to: '/stories', label: 'Stories' },
  ]

  return (
    <nav className="relative border-b border-border">
      <div className="flex justify-between items-center px-6 md:px-8 py-5">
        <Link to="/" className="text-xl md:text-2xl tracking-widest text-gold font-serif z-10">
          Deep<span className="text-text">Match</span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex gap-8 list-none">
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link to={link.to} className="text-subtle text-sm transition-colors hover:text-gold">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop auth */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <span className="text-subtle text-sm">{user.name ?? user.email}</span>
              <button className="btn-nav" onClick={handleSignOut}>Sign out</button>
            </>
          ) : (
            <>
              <button
                className="text-subtle text-sm hover:text-gold transition-colors"
                onClick={() => openAuthModal('signin')}
              >
                Sign in
              </button>
              <button className="btn-nav" onClick={() => openAuthModal('signup')}>
                Join →
              </button>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2 z-10"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block w-5 h-0.5 bg-text transition-all duration-200 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-5 h-0.5 bg-text transition-all duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-0.5 bg-text transition-all duration-200 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile menu drawer */}
      {menuOpen && (
        <div
          className="md:hidden absolute top-full left-0 right-0 z-50 border-b border-border py-4 px-6 flex flex-col gap-4"
          style={{ background: '#14142a' }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="text-subtle text-sm hover:text-gold transition-colors py-1"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="border-t border-border pt-4 flex flex-col gap-3">
            {user ? (
              <>
                <span className="text-subtle text-sm">{user.name ?? user.email}</span>
                <button className="btn-nav text-left w-fit" onClick={handleSignOut}>Sign out</button>
              </>
            ) : (
              <>
                <button
                  className="text-subtle text-sm hover:text-gold transition-colors text-left"
                  onClick={() => { openAuthModal('signin'); setMenuOpen(false) }}
                >
                  Sign in
                </button>
                <button
                  className="btn-nav w-fit"
                  onClick={() => { openAuthModal('signup'); setMenuOpen(false) }}
                >
                  Join →
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
