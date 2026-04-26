import { useAuth } from '../context/AuthContext'

interface Story {
  emoji: string
  names: string
  city: string
  together: string
  quote: string
  dimensions: string[]
  matchScore: number
}

const stories: Story[] = [
  {
    emoji: '🌿',
    names: 'Elena & Tobias',
    city: 'Vienna, Austria',
    together: '2 years',
    quote:
      "I'd been on every app. I was tired of 'what do you do for fun.' DeepMatch asked me what I was afraid of — and Tobias answered the same way I would have. Our first conversation lasted six hours. We moved in together eight months later.",
    dimensions: ['Values', 'Attachment', 'Vulnerability'],
    matchScore: 94,
  },
  {
    emoji: '🌊',
    names: 'Priya & James',
    city: 'Sydney, Australia',
    together: '14 months',
    quote:
      "We matched on a Wednesday. By Friday we were talking about our childhoods, our biggest regrets, the things we'd never told anyone. It didn't feel like dating — it felt like coming home to someone I hadn't met yet.",
    dimensions: ['Intellect', 'Communication', 'Spirituality'],
    matchScore: 91,
  },
  {
    emoji: '🌙',
    names: 'Nadia & Felix',
    city: 'Berlin, Germany',
    together: '3 years',
    quote:
      "We were both skeptical. Felix had given up on apps. I almost deleted my account the day we matched. The shared prompt they gave us was 'What does safety feel like to you?' — we've been answering that question together ever since.",
    dimensions: ['Attachment', 'Communication', 'Personality'],
    matchScore: 89,
  },
  {
    emoji: '☀️',
    names: 'Marcus & Lucia',
    city: 'São Paulo, Brazil',
    together: '18 months',
    quote:
      "What surprised me most was how we fought — or didn't. From the first week, we already knew how the other person needed to be heard. DeepMatch surfaced something true about both of us before we even met for coffee.",
    dimensions: ['Humor', 'Lifestyle', 'Communication'],
    matchScore: 87,
  },
  {
    emoji: '🍂',
    names: 'Yuki & Callum',
    city: 'Edinburgh, Scotland',
    together: '11 months',
    quote:
      "I was living in Tokyo, he was in Edinburgh. The algorithm matched us anyway, across 11 time zones. We spent three months long-distance before I visited. Two days in, I knew I wasn't leaving. I didn't.",
    dimensions: ['Values', 'Ambition', 'Intimacy'],
    matchScore: 92,
  },
  {
    emoji: '💙',
    names: 'Sam & Avery',
    city: 'Portland, Oregon',
    together: '9 months',
    quote:
      "Both of us are introverted, both of us burned out on the performance of modern dating. DeepMatch felt like it was designed for people like us — people who have a lot to say, but only to the right person. We found each other.",
    dimensions: ['Personality', 'Lifestyle', 'Humor'],
    matchScore: 96,
  },
  {
    emoji: '🌸',
    names: 'Amara & Lior',
    city: 'Amsterdam, Netherlands',
    together: '2 years, 3 months',
    quote:
      "We disagreed on about a dozen things in our first conversation. Politics, spirituality, even music. But the way we listened to each other — that was identical. DeepMatch saw something neither of us had words for yet.",
    dimensions: ['Intellect', 'Spirituality', 'Finances'],
    matchScore: 85,
  },
  {
    emoji: '🔥',
    names: 'Diego & Mei',
    city: 'Mexico City, Mexico',
    together: '16 months',
    quote:
      "I filled out the questionnaire thinking it was just another gimmick. But answering those questions about how I handle conflict, what I need from a partner, what love means to me — it changed how I saw myself. And then I met Diego.",
    dimensions: ['Values', 'Attachment', 'Ambition'],
    matchScore: 90,
  },
]

function StoryCard({ story, index }: { story: Story; index: number }) {
  const isPadded = index % 3 === 1

  return (
    <div
      className={`break-inside-avoid rounded-sm border border-border p-6 sm:p-7 ${isPadded ? 'pt-8 pb-10' : ''}`}
      style={{ background: '#14142a' }}
    >
      <div className="flex items-start gap-4 mb-5">
        <div
          className="text-3xl w-12 h-12 flex items-center justify-center rounded-full shrink-0"
          style={{ background: '#1e1e38' }}
        >
          {story.emoji}
        </div>
        <div>
          <p className="text-primary font-serif text-base leading-tight">{story.names}</p>
          <p className="text-subtle text-xs mt-1">{story.city}</p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-gold font-serif text-lg leading-none">{story.matchScore}%</p>
          <p className="text-subtle text-xs mt-1">match</p>
        </div>
      </div>

      <blockquote className="text-primary text-sm sm:text-base leading-relaxed font-serif italic pl-4 border-l-2 border-gold mb-5">
        "{story.quote}"
      </blockquote>

      <div className="flex items-center justify-between">
        <div className="flex gap-1.5 flex-wrap">
          {story.dimensions.map((d) => (
            <span
              key={d}
              className="text-xs px-2 py-0.5 rounded-full text-subtle"
              style={{ background: '#1e1e38' }}
            >
              {d}
            </span>
          ))}
        </div>
        <p className="text-subtle text-xs ml-3 shrink-0">Together {story.together}</p>
      </div>
    </div>
  )
}

export default function StoriesPage() {
  const { openAuthModal } = useAuth()

  return (
    <div className="min-h-screen" style={{ background: '#0d0d1a' }}>
      <div className="text-center px-6 py-16 sm:py-24 max-w-3xl mx-auto">
        <p className="text-xs tracking-[0.25em] text-gold uppercase mb-5">Real connections</p>
        <h1 className="text-3xl sm:text-5xl font-normal font-serif leading-snug mb-6">
          The ones who found
          <br />
          <span className="text-gold italic">what they were looking for</span>
        </h1>
        <p className="text-subtle text-base sm:text-lg leading-relaxed">
          These aren't highlights or curated success stories. They're real people who
          answered honestly — and were answered back.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pb-24">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
          {stories.map((story, i) => (
            <StoryCard key={i} story={story} index={i} />
          ))}
        </div>
      </div>

      <div
        className="border-t border-border text-center px-6 py-20 sm:py-28"
        style={{ background: '#14142a' }}
      >
        <p className="text-xs tracking-[0.25em] text-gold uppercase mb-5">Your turn</p>
        <h2 className="text-2xl sm:text-4xl font-normal font-serif mb-4">
          Your story hasn't started yet
        </h2>
        <p className="text-subtle text-sm sm:text-base leading-relaxed max-w-md mx-auto mb-10">
          Answer a few honest questions about how you love, what you need, and who you are.
          We'll find someone who gets it.
        </p>
        <button
          onClick={() => openAuthModal('signup')}
          className="inline-block px-8 py-3 font-serif text-sm tracking-widest uppercase hover:opacity-90 transition-opacity"
          style={{ background: '#c9a96e', color: '#0d0d1a' }}
        >
          Start your profile →
        </button>
        <p className="text-subtle text-xs mt-5 opacity-60">Free. No swiping. No games.</p>
      </div>
    </div>
  )
}
