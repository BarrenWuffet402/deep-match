import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import DimensionChart from '../components/DimensionChart'
import ScoreExplanationModal from '../components/ScoreExplanationModal'
import type { Profile } from '../components/ProfileCard'

const STARTER_PROMPTS = [
  "What's something you believed strongly at 20 that you've since changed your mind about?",
  "Describe a moment when you felt completely at home somewhere unexpected.",
  "What would you do differently if you knew no one would judge you?",
  "What's the most important thing someone could know about you to truly understand you?",
  "What's a question you wish people asked you more?",
]

// Local profile data — mirrors the server pool so the page works offline too
const LOCAL_PROFILES: Record<string, Profile & { bio: string; values: string[] }> = {
  '1': {
    id: '1', emoji: '🌿', name: 'Sofia', age: 29, city: 'Stockholm', job: 'Writer',
    tags: ['Solitude', 'Philosophy', 'Late nights'], matchScore: 0,
    bio: 'I write about the quiet spaces between words. Looking for someone who appreciates silence as much as conversation.',
    values: ['Authenticity', 'Deep conversations', 'Solitude'],
    dimensionScores: { Personality: 88, Values: 94, Intellect: 86, Spirituality: 84, Communication: 82, Attachment: 78, Lifestyle: 80, Humor: 66, Ambition: 72, Intimacy: 90, Finances: 68, Location: 88 },
  },
  '2': {
    id: '2', emoji: '🌊', name: 'Marcus', age: 32, city: 'Copenhagen', job: 'Architect',
    tags: ['Minimalism', 'Nature', 'Honesty'], matchScore: 0,
    bio: 'I design spaces that breathe. I believe in doing fewer things, better.',
    values: ['Minimalism', 'Nature', 'Honesty'],
    dimensionScores: { Personality: 78, Values: 86, Intellect: 88, Spirituality: 54, Communication: 80, Attachment: 72, Lifestyle: 92, Humor: 70, Ambition: 88, Intimacy: 74, Finances: 90, Location: 82 },
  },
  '3': {
    id: '3', emoji: '🌺', name: 'Leila', age: 27, city: 'Berlin', job: 'Therapist',
    tags: ['Depth', 'Music', 'Slow living'], matchScore: 0,
    bio: 'I hold space for others all day. At night I need someone who can hold space for me.',
    values: ['Vulnerability', 'Depth', 'Growth'],
    dimensionScores: { Personality: 84, Values: 84, Intellect: 78, Spirituality: 76, Communication: 96, Attachment: 92, Lifestyle: 72, Humor: 80, Ambition: 64, Intimacy: 94, Finances: 60, Location: 76 },
  },
  '4': {
    id: '4', emoji: '🌙', name: 'Daniel', age: 34, city: 'Oslo', job: 'Researcher',
    tags: ['Curiosity', 'Books', 'Vulnerability'], matchScore: 0,
    bio: "I study how humans learn. I'm still learning how to love.",
    values: ['Intellect', 'Vulnerability', 'Honesty'],
    dimensionScores: { Personality: 68, Values: 80, Intellect: 96, Spirituality: 60, Communication: 76, Attachment: 68, Lifestyle: 68, Humor: 84, Ambition: 92, Intimacy: 72, Finances: 78, Location: 80 },
  },
  '5': {
    id: '5', emoji: '🔥', name: 'Anika', age: 31, city: 'Amsterdam', job: 'Designer',
    tags: ['Creativity', 'Honesty', 'Travel'], matchScore: 0,
    bio: 'Color, texture, movement — I see the world in layers. I want a partner who sees it differently.',
    values: ['Creativity', 'Adventure', 'Authenticity'],
    dimensionScores: { Personality: 86, Values: 72, Intellect: 70, Spirituality: 56, Communication: 88, Attachment: 68, Lifestyle: 90, Humor: 92, Ambition: 84, Intimacy: 72, Finances: 64, Location: 66 },
  },
  '6': {
    id: '6', emoji: '🌸', name: 'Kai', age: 28, city: 'Helsinki', job: 'Musician',
    tags: ['Art', 'Emotions', 'Silence'], matchScore: 0,
    bio: 'Music is how I process the world. Looking for someone who feels before they think.',
    values: ['Creativity', 'Spirituality', 'Depth'],
    dimensionScores: { Personality: 74, Values: 70, Intellect: 64, Spirituality: 92, Communication: 68, Attachment: 86, Lifestyle: 70, Humor: 76, Ambition: 58, Intimacy: 88, Finances: 56, Location: 66 },
  },
  '7': {
    id: '7', emoji: '✨', name: 'Vera', age: 33, city: 'Vienna', job: 'Philosopher',
    tags: ['Depth', 'Ethics', 'Wonder'], matchScore: 0,
    bio: "I ask questions for a living. Searching for someone who enjoys not having all the answers.",
    values: ['Intellect', 'Ethics', 'Wonder'],
    dimensionScores: { Personality: 72, Values: 78, Intellect: 94, Spirituality: 82, Communication: 76, Attachment: 66, Lifestyle: 64, Humor: 72, Ambition: 76, Intimacy: 70, Finances: 70, Location: 66 },
  },
  '8': {
    id: '8', emoji: '🌍', name: 'Elias', age: 30, city: 'Zurich', job: 'Engineer',
    tags: ['Logic', 'Nature', 'Simplicity'], matchScore: 0,
    bio: 'I build things that last. Hoping to build something real.',
    values: ['Simplicity', 'Nature', 'Stability'],
    dimensionScores: { Personality: 64, Values: 72, Intellect: 86, Spirituality: 48, Communication: 66, Attachment: 70, Lifestyle: 80, Humor: 66, Ambition: 88, Intimacy: 62, Finances: 94, Location: 72 },
  },
}

const NOTES_KEY = 'deepmatch_notes'

interface SentNote {
  matchId: string
  matchName: string
  text: string
  sentAt: string
}

function getStoredNotes(): SentNote[] {
  try { return JSON.parse(localStorage.getItem(NOTES_KEY) || '[]') } catch { return [] }
}

function storeNote(note: SentNote) {
  const notes = getStoredNotes()
  notes.push(note)
  localStorage.setItem(NOTES_KEY, JSON.stringify(notes))
}

const ALL_DIMENSIONS = [
  'Personality', 'Values', 'Intellect', 'Spirituality', 'Communication',
  'Attachment', 'Lifestyle', 'Humor', 'Ambition', 'Intimacy', 'Finances', 'Location'
]

function getTopSharedDimensions(userScores: Record<string, number>, profileScores: Record<string, number>, n = 3): string[] {
  return ALL_DIMENSIONS
    .map((dim) => {
      const u = userScores[dim] ?? 65
      const p = profileScores[dim] ?? 65
      const compat = Math.max(0, 100 - Math.abs(u - p) * 1.4)
      return { dim, compat }
    })
    .sort((a, b) => b.compat - a.compat)
    .slice(0, n)
    .map((x) => x.dim)
}

export default function MatchDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  // Resolve profile — try to get enriched data from stored matches, fall back to local pool
  const [profile, setProfile] = useState<(typeof LOCAL_PROFILES)[string] | null>(null)
  const [matchScore, setMatchScore] = useState<number>(0)
  const [topDimensions, setTopDimensions] = useState<string[]>([])

  const [showCompose, setShowCompose] = useState(false)
  const [noteText, setNoteText] = useState('')
  const [sentNotes, setSentNotes] = useState<SentNote[]>([])
  const [noteSent, setNoteSent] = useState(false)
  const [showScoreModal, setShowScoreModal] = useState(false)
  const [userDimensionScores, setUserDimensionScores] = useState<Record<string, number> | undefined>(undefined)

  useEffect(() => {
    if (!id) return

    // Load user scores
    const stored = localStorage.getItem('deepmatch_dimension_scores')
    let userScores: Record<string, number> | undefined
    if (stored) {
      try { userScores = JSON.parse(stored) } catch { /* malformed */ }
    }
    if (userScores) setUserDimensionScores(userScores)

    // Load profile — prefer cached match data from matches page, fall back to local
    const cachedMatchesRaw = localStorage.getItem('deepmatch_matches')
    let cachedMatch: (typeof LOCAL_PROFILES)[string] | null = null
    if (cachedMatchesRaw) {
      try {
        const cachedMatches = JSON.parse(cachedMatchesRaw) as Array<typeof LOCAL_PROFILES[string]>
        cachedMatch = cachedMatches.find((m) => String(m.id) === id) ?? null
      } catch {}
    }

    const base = LOCAL_PROFILES[id] ?? null
    const resolved = cachedMatch ?? base
    setProfile(resolved)

    if (resolved) {
      const score = cachedMatch?.matchScore ?? 0
      setMatchScore(score)

      if (userScores && resolved.dimensionScores) {
        setTopDimensions(getTopSharedDimensions(userScores, resolved.dimensionScores))
      }
    }

    // Load notes
    const all = getStoredNotes()
    setSentNotes(all.filter((n) => n.matchId === id))
  }, [id])

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-8">
        <p className="text-subtle mb-4">Profile not found.</p>
        <button className="btn-ghost" onClick={() => navigate('/matches')}>← Back to matches</button>
      </div>
    )
  }

  const starterPrompt = STARTER_PROMPTS[parseInt(id ?? '0') % STARTER_PROMPTS.length]

  const handleSendNote = () => {
    if (!noteText.trim()) return
    const note: SentNote = {
      matchId: id!,
      matchName: profile.name,
      text: noteText.trim(),
      sentAt: new Date().toISOString(),
    }
    storeNote(note)
    setSentNotes((prev) => [...prev, note])
    setNoteText('')
    setShowCompose(false)
    setNoteSent(true)
    setTimeout(() => setNoteSent(false), 3000)
  }

  const displayScore = matchScore || profile.matchScore || 0

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <button
        onClick={() => navigate('/matches')}
        className="text-subtle text-sm hover:text-gold transition-colors mb-8 flex items-center gap-1"
      >
        ← Back to matches
      </button>

      <div className="flex items-start gap-4 sm:gap-6 mb-8">
        <div
          className="w-16 h-16 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center text-3xl sm:text-5xl flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #1e1e35, #2a2a45)' }}
        >
          {profile.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-serif font-normal mb-1">
            {profile.name}, {profile.age}
          </h1>
          <p className="text-subtle text-sm mb-2">{profile.city} · {profile.job}</p>
          {displayScore > 0 ? (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-gold text-xl">✦</span>
              <span className="text-gold font-serif text-lg">{displayScore}%</span>
              <span className="text-subtle text-sm">deep match</span>
            </div>
          ) : (
            <div className="text-subtle text-sm">Complete your questions to see your match score</div>
          )}
          {topDimensions.length > 0 && (
            <div className="text-xs mt-1" style={{ color: '#9b95a3' }}>
              Strong on: {topDimensions.join(' · ')}
            </div>
          )}
        </div>
      </div>

      <div className="bg-surface border border-border rounded-2xl p-5 sm:p-6 mb-6">
        <p className="text-sm text-subtle uppercase tracking-widest mb-3">In their own words</p>
        <p className="font-serif leading-relaxed text-text">"{profile.bio}"</p>
      </div>

      <div className="bg-surface border border-border rounded-2xl p-5 sm:p-6 mb-6">
        <p className="text-sm text-subtle uppercase tracking-widest mb-3">Core values</p>
        <div className="flex flex-wrap gap-2">
          {profile.values?.map((v) => (
            <span key={v} className="tag">{v}</span>
          ))}
        </div>
      </div>

      <div className="bg-surface border border-border rounded-2xl p-5 sm:p-6 mb-6">
        <div className="flex items-start justify-between mb-1 gap-2">
          <p className="text-sm text-subtle uppercase tracking-widest">Compatibility breakdown</p>
          <button
            className="text-xs text-gold hover:underline flex-shrink-0"
            onClick={() => setShowScoreModal(true)}
          >
            How is this calculated?
          </button>
        </div>
        <p className="text-xs text-subtle mb-5">Across 12 deep dimensions</p>
        {profile.dimensionScores ? (
          <DimensionChart scores={profile.dimensionScores} userScores={userDimensionScores} />
        ) : (
          <p className="text-subtle text-sm">No dimension data available.</p>
        )}
      </div>

      <div className="rounded-2xl p-5 sm:p-6 mb-8" style={{ background: 'linear-gradient(135deg, #1e1a10, #2a2010)', border: '1px solid rgba(201,169,110,0.3)' }}>
        <p className="text-xs text-gold uppercase tracking-widest mb-3">✦ Conversation starter</p>
        <p className="font-serif text-text leading-relaxed">"{starterPrompt}"</p>
        <p className="text-xs text-subtle mt-3">A shared prompt to start something real.</p>
      </div>

      {showCompose && (
        <div className="bg-surface border border-border rounded-2xl p-5 sm:p-6 mb-6">
          <p className="text-sm text-subtle uppercase tracking-widest mb-4">Send a note to {profile.name}</p>
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder={`Something genuine — maybe start with: "${starterPrompt.slice(0, 50)}..."`}
            rows={4}
            maxLength={400}
            className="w-full rounded-lg px-4 py-3 text-text font-serif text-sm focus:outline-none focus:border-gold transition-colors resize-none"
            style={{ background: '#0d0d1a', border: '1px solid rgba(155,149,163,0.2)' }}
          />
          <div className="flex justify-between items-center mt-3">
            <span className="text-xs text-subtle">{noteText.length}/400</span>
            <div className="flex gap-2">
              <button className="btn-ghost text-sm px-5 py-2" onClick={() => { setShowCompose(false); setNoteText('') }}>Cancel</button>
              <button
                className="btn-primary text-sm px-5 py-2"
                onClick={handleSendNote}
                disabled={!noteText.trim()}
                style={{ opacity: !noteText.trim() ? 0.5 : 1 }}
              >
                Send →
              </button>
            </div>
          </div>
        </div>
      )}

      {noteSent && (
        <div className="mb-6 px-4 py-3 rounded-xl text-sm text-gold flex items-center gap-2"
          style={{ background: '#1e1a10', border: '1px solid rgba(201,169,110,0.3)' }}>
          ✦ Note sent to {profile.name}
        </div>
      )}

      {sentNotes.length > 0 && (
        <div className="bg-surface border border-border rounded-2xl p-5 sm:p-6 mb-6">
          <p className="text-sm text-subtle uppercase tracking-widest mb-4">Notes you've sent</p>
          <div className="flex flex-col gap-3">
            {sentNotes.map((note, i) => (
              <div key={i} className="rounded-lg px-4 py-3" style={{ background: '#0d0d1a', border: '1px solid rgba(155,149,163,0.15)' }}>
                <p className="font-serif text-sm text-text leading-relaxed">"{note.text}"</p>
                <p className="text-xs text-subtle mt-2">
                  {new Date(note.sentAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <button className="btn-primary flex-1" onClick={() => setShowCompose(!showCompose)}>
          {showCompose ? 'Cancel note' : 'Send a note →'}
        </button>
        <button className="btn-ghost" onClick={() => navigate('/matches')}>See more</button>
      </div>

      {showScoreModal && <ScoreExplanationModal onClose={() => setShowScoreModal(false)} />}
    </div>
  )
}
