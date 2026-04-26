import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import DimensionChart from '../components/DimensionChart'
import ScoreExplanationModal from '../components/ScoreExplanationModal'

const STARTER_PROMPTS = [
  "What's something you believed strongly at 20 that you've since changed your mind about?",
  "Describe a moment when you felt completely at home somewhere unexpected.",
  "What would you do differently if you knew no one would judge you?",
  "What's the most important thing someone could know about you to truly understand you?",
  "What's a question you wish people asked you more?",
]

const PROFILES: Record<string, {
  id: string; emoji: string; name: string; age: number; city: string; job: string;
  tags: string[]; matchScore: number; bio: string; values: string[];
  dimensionScores: Record<string, number>
}> = {
  '1': { id: '1', emoji: '🌿', name: 'Sofia', age: 29, city: 'Stockholm', job: 'Writer', tags: ['Solitude', 'Philosophy', 'Late nights'], matchScore: 91, bio: 'I write about the quiet spaces between words. Looking for someone who appreciates silence as much as conversation.', values: ['Authenticity', 'Deep conversations', 'Solitude'], dimensionScores: { Personality: 94, Values: 96, Intellect: 89, Spirituality: 78, Communication: 91, Attachment: 85, Lifestyle: 88, Humor: 72, Ambition: 82, Intimacy: 90, Finances: 76, Location: 95 } },
  '2': { id: '2', emoji: '🌊', name: 'Marcus', age: 32, city: 'Copenhagen', job: 'Architect', tags: ['Minimalism', 'Nature', 'Honesty'], matchScore: 88, bio: 'I design spaces that breathe. I believe in doing fewer things, better.', values: ['Minimalism', 'Nature', 'Honesty'], dimensionScores: { Personality: 85, Values: 92, Intellect: 90, Spirituality: 65, Communication: 88, Attachment: 80, Lifestyle: 91, Humor: 79, Ambition: 88, Intimacy: 84, Finances: 90, Location: 87 } },
  '3': { id: '3', emoji: '😭', name: 'Leila', age: 27, city: 'Berlin', job: 'Therapist', tags: ['Depth', 'Music', 'Slow living'], matchScore: 85, bio: 'I hold space for others all day. At night I need someone who can hold space for me.', values: ['Vulnerability', 'Depth', 'Growth'], dimensionScores: { Personality: 88, Values: 87, Intellect: 85, Spirituality: 82, Communication: 95, Attachment: 91, Lifestyle: 79, Humor: 81, Ambition: 74, Intimacy: 93, Finances: 72, Location: 83 } },
  '4': { id: '4', emoji: '🌙', name: 'Daniel', age: 34, city: 'Oslo', job: 'Researcher', tags: ['Curiosity', 'Books', 'Vulnerability'], matchScore: 83, bio: "I study how humans learn. I'm still learning how to love.", values: ['Intellect', 'Vulnerability', 'Honesty'], dimensionScores: { Personality: 79, Values: 84, Intellect: 96, Spirituality: 70, Communication: 82, Attachment: 78, Lifestyle: 76, Humor: 85, Ambition: 91, Intimacy: 80, Finances: 81, Location: 82 } },
  '5': { id: '5', emoji: '🔥', name: 'Anika', age: 31, city: 'Amsterdam', job: 'Designer', tags: ['Creativity', 'Honesty', 'Travel'], matchScore: 79, bio: 'Color, texture, movement — I see the world in layers. I want a partner who sees it differently.', values: ['Creativity', 'Adventure', 'Authenticity'], dimensionScores: { Personality: 81, Values: 79, Intellect: 77, Spirituality: 68, Communication: 85, Attachment: 74, Lifestyle: 83, Humor: 88, Ambition: 86, Intimacy: 78, Finances: 75, Location: 76 } },
  '6': { id: '6', emoji: '🌸', name: 'Kai', age: 28, city: 'Helsinki', job: 'Musician', tags: ['Art', 'Emotions', 'Silence'], matchScore: 77, bio: 'Music is how I process the world. Looking for someone who feels before they think.', values: ['Creativity', 'Spirituality', 'Depth'], dimensionScores: { Personality: 80, Values: 76, Intellect: 72, Spirituality: 88, Communication: 75, Attachment: 82, Lifestyle: 77, Humor: 79, Ambition: 70, Intimacy: 85, Finances: 68, Location: 74 } },
  '7': { id: '7', emoji: '✨', name: 'Vera', age: 33, city: 'Vienna', job: 'Philosopher', tags: ['Depth', 'Ethics', 'Wonder'], matchScore: 75, bio: "I ask questions for a living. Searching for someone who enjoys not having all the answers.", values: ['Intellect', 'Ethics', 'Wonder'], dimensionScores: { Personality: 74, Values: 78, Intellect: 95, Spirituality: 80, Communication: 77, Attachment: 71, Lifestyle: 73, Humor: 76, Ambition: 79, Intimacy: 72, Finances: 74, Location: 72 } },
  '8': { id: '8', emoji: '🌍', name: 'Elias', age: 30, city: 'Zurich', job: 'Engineer', tags: ['Logic', 'Nature', 'Simplicity'], matchScore: 72, bio: 'I build things that last. Hoping to build something real.', values: ['Simplicity', 'Nature', 'Stability'], dimensionScores: { Personality: 71, Values: 75, Intellect: 82, Spirituality: 60, Communication: 70, Attachment: 74, Lifestyle: 80, Humor: 72, Ambition: 85, Intimacy: 69, Finances: 88, Location: 73 } },
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

export default function MatchDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const profile = id ? PROFILES[id] : null

  // Messaging state
  const [showCompose, setShowCompose] = useState(false)
  const [noteText, setNoteText] = useState('')
  const [sentNotes, setSentNotes] = useState<SentNote[]>([])
  const [noteSent, setNoteSent] = useState(false)

  // Score modal
  const [showScoreModal, setShowScoreModal] = useState(false)

  // User dimension scores from localStorage (set after question flow)
  const [userDimensionScores, setUserDimensionScores] = useState<Record<string, number> | undefined>(undefined)

  useEffect(() => {
    if (id) {
      const all = getStoredNotes()
      setSentNotes(all.filter((n) => n.matchId === id))
    }
    // Load user dimension scores if available
    const stored = localStorage.getItem('deepmatch_dimension_scores')
    if (stored) {
      try { setUserDimensionScores(JSON.parse(stored)) } catch { /* ignore */ }
    }
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

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Back */}
      <button
        onClick={() => navigate('/matches')}
        className="text-subtle text-sm hover:text-gold transition-colors mb-8 flex items-center gap-1"
      >
        ← Back to matches
      </button>

      {/* Header */}
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
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-gold text-xl">✦</span>
            <span className="text-gold font-serif text-lg">{profile.matchScore}%</span>
            <span className="text-subtle text-sm">deep match</span>
          </div>
        </div>
      </div>

      {/* Bio */}
      <div className="bg-surface border border-border rounded-2xl p-5 sm:p-6 mb-6">
        <p className="text-sm text-subtle uppercase tracking-widest mb-3">In their own words</p>
        <p className="font-serif leading-relaxed text-text">"{profile.bio}"</p>
      </div>

      {/* Values */}
      <div className="bg-surface border border-border rounded-2xl p-5 sm:p-6 mb-6">
        <p className="text-sm text-subtle uppercase tracking-widest mb-3">Core values</p>
        <div className="flex flex-wrap gap-2">
          {profile.values.map((v) => (
            <span key={v} className="tag">{v}</span>
          ))}
        </div>
      </div>

      {/* Dimension Chart */}
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
        <DimensionChart scores={profile.dimensionScores} userScores={userDimensionScores} />
      </div>

      {/* Conversation starter */}
      <div className="rounded-2xl p-5 sm:p-6 mb-8" style={{ background: 'linear-gradient(135deg, #1e1a10, #2a2010)', border: '1px solid rgba(201,169,110,0.3)' }}>
        <p className="text-xs text-gold uppercase tracking-widest mb-3">✦ Conversation starter</p>
        <p className="font-serif text-text leading-relaxed">"{starterPrompt}"</p>
        <p className="text-xs text-subtle mt-3">A shared prompt to start something real.</p>
      </div>

      {/* Note compose area */}
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
              <button
                className="btn-ghost text-sm px-5 py-2"
                onClick={() => { setShowCompose(false); setNoteText('') }}
              >
                Cancel
              </button>
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

      {/* Success toast */}
      {noteSent && (
        <div
          className="mb-6 px-4 py-3 rounded-xl text-sm text-gold flex items-center gap-2"
          style={{ background: '#1e1a10', border: '1px solid rgba(201,169,110,0.3)' }}
        >
          ✦ Note sent to {profile.name}
        </div>
      )}

      {/* Sent notes history */}
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

      {/* CTA */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button className="btn-primary flex-1" onClick={() => setShowCompose(!showCompose)}>
          {showCompose ? 'Cancel note' : 'Send a note →'}
        </button>
        <button className="btn-ghost" onClick={() => navigate('/matches')}>See more</button>
      </div>

      {/* Score explanation modal */}
      {showScoreModal && <ScoreExplanationModal onClose={() => setShowScoreModal(false)} />}
    </div>
  )
}
