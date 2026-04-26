import { Link } from 'react-router-dom'

const steps = [
  { icon: '🧬', title: 'Answer deeply', description: 'Share your values, fears, and how you love — not just hobbies.' },
  { icon: '🔮', title: 'Get matched', description: 'Our algorithm finds alignment across 12 dimensions — not just vibes.' },
  { icon: '💬', title: 'Start a real conversation', description: 'You get a shared prompt to break the ice — no "hey" openers.' },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="px-4 sm:px-8 py-12 sm:py-16 text-center">
      <h2 className="text-xl sm:text-2xl font-normal font-serif mb-2">How DeepMatch works</h2>
      <p className="text-subtle text-sm mb-10 sm:mb-12">Three steps. No games.</p>
      <div className="flex flex-col sm:flex-row justify-center gap-8 sm:gap-8 items-center sm:items-start">
        {steps.map((step) => (
          <div key={step.title} className="max-w-[200px] text-center">
            <div className="text-4xl mb-4">{step.icon}</div>
            <h3 className="text-gold font-normal font-serif mb-2">{step.title}</h3>
            <p className="text-subtle text-sm leading-relaxed">{step.description}</p>
          </div>
        ))}
      </div>
      <div className="mt-10">
        <Link
          to="/how-it-works"
          className="text-sm text-gold border border-gold px-5 py-2.5 hover:bg-gold hover:text-dark transition-all duration-200 font-serif tracking-wide"
          style={{ '--tw-text-opacity': '1' } as React.CSSProperties}
        >
          See the full system →
        </Link>
      </div>
    </section>
  )
}
