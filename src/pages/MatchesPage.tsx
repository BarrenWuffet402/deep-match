import { useState, useEffect } from 'react'
import ProfileCard from '../components/ProfileCard'
import type { Profile } from '../components/ProfileCard'

const DIMENSIONS = ['Personality', 'Values', 'Intellect', 'Spirituality', 'Communication',
  'Attachment', 'Lifestyle', 'Humor', 'Ambition', 'Intimacy', 'Finances', 'Location']

const FALLBACK_MATCHES: Profile[] = [
  { id: '1', emoji: '🌿', name: 'Sofia', age: 29, city: 'Stockholm', job: 'Writer', tags: ['Solitude', 'Philosophy', 'Late nights'], matchScore: 91 },
  { id: '2', emoji: '🌊', name: 'Marcus', age: 32, city: 'Copenhagen', job: 'Architect', tags: ['Minimalism', 'Nature', 'Honesty'], matchScore: 88 },
  { id: '3', emoji: '😭', name: 'Leila', age: 27, city: 'Berlin', job: 'Therapist', tags: ['Depth', 'Music', 'Slow living'], matchScore: 85 },
  { id: '4', emoji: '🌙', name: 'Daniel', age: 34, city: 'Oslo', job: 'Researcher', tags: ['Curiosity', 'Books', 'Vulnerability'], matchScore: 83 },
  { id: '5', emoji: '🔥', name: 'Anika', age: 31, city: 'Amsterdam', job: 'Designer', tags: ['Creativity', 'Honesty', 'Travel'], matchScore: 79 },
  { id: '6', emoji: '🌸', name: 'Kai', age: 28, city: 'Helsinki', job: 'Musician', tags: ['Art', 'Emotions', 'Silence'], matchScore: 77 },
  { id: '7', emoji: '✨', name: 'Vera', age: 33, city: 'Vienna', job: 'Philosopher', tags: ['Depth', 'Ethics', 'Wonder'], matchScore: 75 },
  { id: '8', emoji: '🌍', name: 'Elias', age: 30, city: 'Zurich', job: 'Engineer', tags: ['Logic', 'Nature', 'Simplicity'], matchScore: 72 },
]

export default function MatchesPage() {
  const [matches, setMatches] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [apiSource, setApiSource] = useState<'api' | 'fallback'>('fallback')

  useEffect(() => {
    let cancelled = false
    const fetchMatches = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/matches', { signal: AbortSignal.timeout(3000) })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        if (!cancelled) {
          const apiProfiles: Profile[] = (data.matches || []).map((m: Profile & { id: number }) => ({ ...m, id: String(m.id) }))
          const apiIds = new Set(apiProfiles.map((p) => p.id))
          const supplemental = FALLBACK_MATCHES.filter((p) => !apiIds.has(p.id))
          setMatches([...apiProfiles, ...supplemental])
          setApiSource('api')
          setError(null)
        }
      } catch {
        if (!cancelled) {
          setMatches(FALLBACK_MATCHES)
          setApiSource('fallback')
          setError('API offline — showing demo matches')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchMatches()
    return () => { cancelled = true }
  }, [])

  return (
    <div className="px-4 sm:px-8 py-8 sm:py-12 max-w-6xl mx-auto">
      <div className="mb-8 sm:mb-10">
        <p className="text-xs tracking-[0.25em] text-gold uppercase mb-2">Your matches</p>
        <h1 className="text-2xl sm:text-3xl font-normal font-serif mb-2">Discover your deep connections</h1>
        <p className="text-subtle text-sm">Matched across {DIMENSIONS.length} deep dimensions</p>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 rounded-lg text-xs text-subtle border border-border flex items-center gap-2" style={{ background: '#1e1e35' }}>
          <span>⚠</span> {error}
        </div>
      )}

      {/* Dimension filters — scrollable on mobile */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-none" style={{ scrollbarWidth: 'none' }}>
        {DIMENSIONS.map((dim) => (
          <button key={dim} className="tag text-xs px-3 py-1 cursor-pointer hover:border-gold hover:text-gold transition-colors whitespace-nowrap flex-shrink-0">
            {dim}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 text-subtle">
          <div className="text-3xl mb-4 animate-pulse">✦</div>
          <p className="text-sm">Finding your matches…</p>
        </div>
      ) : (
        <>
          {apiSource === 'api' && (
            <p className="text-xs text-subtle mb-4">✓ Loaded from API · {matches.length} matches</p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {matches.map((profile) => (
              <ProfileCard key={profile.id ?? profile.name} profile={profile} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
