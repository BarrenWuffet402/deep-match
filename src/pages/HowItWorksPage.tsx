import { useAuth } from '../context/AuthContext'

const steps = [
  {
    number: '01',
    icon: '🧬',
    title: 'Answer deeply',
    description:
      'We ask about the things that actually shape compatibility — how you handle conflict, what safety means to you, how you express care. Not hobbies. Not job titles.',
    detail:
      'The questionnaire takes about 20–30 minutes and covers all 12 match dimensions. You can pause and return at any time. There are no right answers — only honest ones.',
  },
  {
    number: '02',
    icon: '🔮',
    title: 'Get matched',
    description:
      'Our algorithm finds people who align with you across dimensions that predict long-term connection — not just initial attraction.',
    detail:
      'You receive a compatibility score broken down by dimension. You can see exactly where you align and where you differ — which is just as important.',
  },
  {
    number: '03',
    icon: '💬',
    title: 'Start a real conversation',
    description:
      'Every match comes with a shared conversation prompt — a question specific to your unique pairing. No more "hey" openers.',
    detail:
      "The prompt is generated from your overlap and differences. It's designed to get you past small talk and into something real within the first exchange.",
  },
]

const dimensions = [
  {
    icon: '🪐',
    name: 'Personality',
    description: 'Introversion, openness, conscientiousness — the traits that shape how you move through the world.',
  },
  {
    icon: '⚖️',
    name: 'Values',
    description: "What you believe in. Family, freedom, integrity, growth — the non-negotiables you can't compromise on.",
  },
  {
    icon: '🔍',
    name: 'Intellect',
    description: 'How you think. Curiosity, abstraction, the pleasure you take in ideas and conversation.',
  },
  {
    icon: '✨',
    name: 'Spirituality',
    description: 'Your relationship with meaning — religion, philosophy, the bigger picture. Compatible, not necessarily identical.',
  },
  {
    icon: '🗣️',
    name: 'Communication',
    description: 'How you express yourself, how you listen, and what you need when a conversation gets hard.',
  },
  {
    icon: '🔗',
    name: 'Attachment',
    description: 'Your patterns around closeness and distance — anxious, avoidant, or secure. Understanding this changes everything.',
  },
  {
    icon: '🌿',
    name: 'Lifestyle',
    description: 'City or countryside. Spontaneous or structured. Morning person or night owl. The daily texture of life.',
  },
  {
    icon: '😄',
    name: 'Humor',
    description: 'Dry wit, absurdism, slapstick, or wordplay. Shared laughter is a love language.',
  },
  {
    icon: '🚀',
    name: 'Ambition',
    description: "Your drive, your goals, and how much you want a partner who shares or complements them.",
  },
  {
    icon: '🌡️',
    name: 'Intimacy',
    description: 'Emotional and physical closeness — what you need, how you give, and how you receive.',
  },
  {
    icon: '💰',
    name: 'Finances',
    description: "Money values, spending philosophy, and financial goals. Rarely discussed early — almost always important.",
  },
  {
    icon: '📍',
    name: 'Location',
    description: "Where you are and where you want to be. We factor in willingness to move, not just current city.",
  },
]

const differences = [
  {
    them: '👆 Swipe on a photo',
    us: '🧬 Match on who you are',
  },
  {
    them: `😐 "Hey, how's your weekend?"`,
    us: '💬 A custom prompt built for your pairing',
  },
  {
    them: '📊 One compatibility number',
    us: '📐 12-dimension breakdown you can explore',
  },
  {
    them: '♾️ Infinite scroll, infinite options',
    us: '🎯 A curated set of meaningful matches',
  },
  {
    them: '👻 Ghosts and no-replies',
    us: '🤝 Context that makes starting easier',
  },
]

const faqs = [
  {
    q: 'How long does the questionnaire take?',
    a: "Most people complete it in 20–30 minutes. It's designed to be reflective, not rapid-fire. You can save your progress and return anytime. The depth of your answers directly affects the quality of your matches — so take your time.",
  },
  {
    q: 'Can two very different people still be a good match?',
    a: "Yes — and often they are. Compatibility isn't about being identical. Some dimensions benefit from similarity (values, attachment style, communication). Others benefit from complementarity. Our algorithm weighs both. We show you exactly where you align and where you differ, so you can decide what matters most.",
  },
  {
    q: 'What happens if I answer dishonestly to seem more attractive?',
    a: "You'll get matches who aren't compatible with who you actually are. The whole premise of DeepMatch is honesty — it only works if you mean it. We've found that people who answer authentically, even if those answers feel unflattering, end up with far stronger connections.",
  },
  {
    q: 'Is my data private?',
    a: "Your questionnaire answers are never shared directly with other users. Only your compatibility score and the dimensions that overlap are visible in a match. We don't sell your data and we never use it to target you with ads. Your depth is yours.",
  },
  {
    q: 'What is the "shared conversation prompt"?',
    a: "Every match comes with a custom opening prompt — a question generated from your specific pairing. It might be about your overlapping attachment styles, a value you both ranked highly, or a dimension where you differ in an interesting way. It's designed to skip the small talk.",
  },
  {
    q: 'How is this different from taking a personality test?',
    a: "Personality tests describe you as an individual. DeepMatch uses those insights to find someone who fits you. We also go beyond personality into attachment, values, lifestyle, and intimacy — things most personality frameworks don't touch. And everything is filtered through the lens of romantic compatibility, not career advice.",
  },
]

export default function HowItWorksPage() {
  const { openAuthModal } = useAuth()

  return (
    <div className="min-h-screen" style={{ background: '#0d0d1a' }}>
      {/* Hero */}
      <div className="text-center px-6 py-16 sm:py-24 max-w-3xl mx-auto">
        <p className="text-xs tracking-[0.25em] text-gold uppercase mb-5">The system</p>
        <h1 className="text-3xl sm:text-5xl font-normal font-serif leading-snug mb-6">
          Designed for depth,
          <br />
          <span className="text-gold italic">not dopamine</span>
        </h1>
        <p className="text-subtle text-base sm:text-lg leading-relaxed">
          Most apps optimize for engagement. We optimize for connection.
          Here's what that actually looks like.
        </p>
      </div>

      {/* 3 Steps */}
      <section className="max-w-5xl mx-auto px-4 sm:px-8 pb-20">
        <h2 className="text-center text-xl sm:text-2xl font-normal font-serif mb-2">Three steps</h2>
        <p className="text-center text-subtle text-sm mb-12">No games. No swipes. No noise.</p>

        <div className="flex flex-col gap-6">
          {steps.map((step) => (
            <div
              key={step.number}
              className="border border-border rounded-sm p-7 sm:p-9 flex flex-col sm:flex-row gap-6 sm:gap-10"
              style={{ background: '#14142a' }}
            >
              <div className="flex flex-col items-center sm:items-start gap-2 sm:w-32 shrink-0">
                <span className="text-4xl">{step.icon}</span>
                <span className="text-gold font-serif text-3xl font-normal leading-none">{step.number}</span>
              </div>
              <div>
                <h3 className="text-primary font-serif text-xl mb-2">{step.title}</h3>
                <p className="text-primary text-sm leading-relaxed mb-3">{step.description}</p>
                <p className="text-subtle text-sm leading-relaxed">{step.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 12 Dimensions */}
      <section className="border-t border-border px-4 sm:px-8 py-20" style={{ background: '#14142a' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs tracking-[0.25em] text-gold uppercase mb-4">The science</p>
            <h2 className="text-2xl sm:text-4xl font-normal font-serif mb-3">12 dimensions of compatibility</h2>
            <p className="text-subtle text-sm sm:text-base max-w-xl mx-auto">
              Most apps match on location and looks. We match on the dimensions that determine whether two people
              actually work together — day after day, year after year.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {dimensions.map((dim) => (
              <div
                key={dim.name}
                className="border border-border rounded-sm p-5 hover:border-gold transition-colors duration-200"
                style={{ background: '#0d0d1a' }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{dim.icon}</span>
                  <h3 className="text-gold font-serif text-base">{dim.name}</h3>
                </div>
                <p className="text-subtle text-sm leading-relaxed">{dim.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What makes us different */}
      <section className="px-4 sm:px-8 py-20" style={{ background: '#0d0d1a' }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs tracking-[0.25em] text-gold uppercase mb-4">The difference</p>
            <h2 className="text-2xl sm:text-4xl font-normal font-serif mb-3">Not another swipe app</h2>
            <p className="text-subtle text-sm sm:text-base">
              The mechanics are different. The intention is different. The results are different.
            </p>
          </div>

          <div className="border border-border rounded-sm overflow-hidden">
            <div
              className="grid grid-cols-2 text-xs tracking-[0.15em] uppercase px-6 py-3 border-b border-border"
              style={{ background: '#1e1e38' }}
            >
              <span className="text-subtle">Other apps</span>
              <span className="text-gold">DeepMatch</span>
            </div>
            {differences.map((row, i) => (
              <div
                key={i}
                className={`grid grid-cols-2 px-6 py-4 border-b border-border last:border-0 ${i % 2 === 0 ? '' : ''}`}
                style={{ background: i % 2 === 0 ? '#14142a' : '#111128' }}
              >
                <span className="text-subtle text-sm leading-relaxed pr-4">{row.them}</span>
                <span className="text-primary text-sm leading-relaxed">{row.us}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-border px-4 sm:px-8 py-20" style={{ background: '#14142a' }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs tracking-[0.25em] text-gold uppercase mb-4">Questions</p>
            <h2 className="text-2xl sm:text-4xl font-normal font-serif">Things people ask</h2>
          </div>

          <div className="flex flex-col gap-5">
            {faqs.map((faq, i) => (
              <FaqItem key={i} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <div
        className="border-t border-border text-center px-6 py-20 sm:py-28"
        style={{ background: '#0d0d1a' }}
      >
        <p className="text-xs tracking-[0.25em] text-gold uppercase mb-5">Ready?</p>
        <h2 className="text-2xl sm:text-4xl font-normal font-serif mb-4">
          Find out who you actually match with
        </h2>
        <p className="text-subtle text-sm sm:text-base leading-relaxed max-w-md mx-auto mb-10">
          Thirty minutes of honesty. A lifetime of not settling.
        </p>
        <button
          onClick={() => openAuthModal('signup')}
          className="inline-block px-8 py-3 font-serif text-sm tracking-widest uppercase hover:opacity-90 transition-opacity"
          style={{ background: '#c9a96e', color: '#0d0d1a' }}
        >
          Start your profile →
        </button>
        <p className="text-subtle text-xs mt-5 opacity-60">Free to join. No swiping.</p>
      </div>
    </div>
  )
}

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <details
      className="border border-border rounded-sm group"
      style={{ background: '#0d0d1a' }}
    >
      <summary className="px-6 py-5 cursor-pointer list-none flex justify-between items-start gap-4 hover:text-gold transition-colors">
        <span className="font-serif text-primary text-base">{q}</span>
        <span className="text-gold text-xl shrink-0 mt-0.5 group-open:rotate-45 transition-transform duration-200">+</span>
      </summary>
      <div className="px-6 pb-5">
        <p className="text-subtle text-sm leading-relaxed">{a}</p>
      </div>
    </details>
  )
}
