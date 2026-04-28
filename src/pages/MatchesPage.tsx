import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ProfileCard from '../components/ProfileCard'
import type { Profile } from '../components/ProfileCard'

const DIMENSIONS = ['Personality', 'Values', 'Intellect', 'Spirituality', 'Communication',
  'Attachment', 'Lifestyle', 'Humor', 'Ambition', 'Intimacy', 'Finances', 'Location']

export default function MatchesPage() {
  const [matches, setMatches] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasScores, setHasScores] = useState(false)
  const [apiSource, setApiSource] = useState<'api' | 'fallback'>('fallback')

  useEffect(() => {
    let cancelled = false

    const fetchMatches = async () => {
      // Check for stored dimension scores
      const stored = localStorage.getItem('deepmatch_dimension_scores')
      const userDimensionScores = stored ? JSON.parse(stored) : null

      if (userDimensionScores) {
        setHasScores(true)
        try {
          const res = await fetch('http://localhost:4000/api/compute-matches', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ dimensionScores: userDimensionScores }),
            signal: AbortSignal.timeout(4000),
          })
          if (!res.ok) throw new Error(`HTTP ${res.status}`)
          const data = await res.json()
          if (!cancelled) {
            const ranked: Profile[] = (data.matches || []).map((m: Profile & { id: string }) => ({ ...m, id: String(m.id) }))
            setMatches(ranked)
            // Cache matches for detail page
            try { localStorage.setItem("deepmatch_matches", JSON.stringify(ranked)) } catch {}
            setApiSource('api')
            setError(null)
          }
        } catch {
          if (!cancelled) {
            setError('Could not reach the API — showing unranked profiles')
            setApiSource('fallback')
            // Try to fetch static profiles
            await fetchStaticProfiles(cancelled)
          }
        } finally {
          if (!cancelled) setLoading(false)
        }
      } else {
        // No scores — fetch static profiles as preview
        setHasScores(false)
        await fetchStaticProfiles(cancelled)
        if (!cancelled) setLoading(false)
      }
    }

    const fetchStaticProfiles = async (cancelled: boolean) => {
      try {
        const res = await fetch('http://localhost:4000/api/matches', { signal: AbortSignal.timeout(3000) })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        if (!cancelled) {
          const profiles: Profile[] = (data.matches || []).map((m: Profile & { id: string }) => ({ ...m, id: String(m.id) }))
          setMatches(profiles)
          setApiSource('api')
        }
      } catch {
        if (!cancelled) {
          setApiSource('fallback')
        }
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

      {/* Prompt to complete questions if no scores */}
      {!loading && !hasScores && (
        <div
          className="mb-8 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4"
          style={{ background: 'linear-gradient(135deg, #1e1a10, #2a2010)', border: '1px solid rgba(201,169,110,0.3)' }}
        >
          <div className="text-2xl">✦</div>
          <div className="flex-1">
            <p className="text-gold font-serif mb-1">Complete your questions to see your real matches</p>
            <p className="text-subtle text-sm">Answer 7 deep questions and we'll rank these profiles by true compatibility.</p>
          </div>
          <Link to="/questions" className="btn-primary text-sm px-5 py-2 whitespace-nowrap flex-shrink-0">
            Take the questions →
          </Link>
        </div>
      )}

      {/* Dimension filters */}
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
          {apiSource === 'api' && hasScores && (
            <p className="text-xs text-subtle mb-4">✓ Ranked by compatibility · {matches.length} matches</p>
          )}
          {apiSource === 'api' && !hasScores && (
            <p className="text-xs text-subtle mb-4">Showing all profiles — complete questions for ranked results</p>
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
