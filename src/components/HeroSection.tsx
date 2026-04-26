import { useNavigate } from 'react-router-dom'

export default function HeroSection() {
  const navigate = useNavigate()

  return (
    <section className="flex flex-col items-center text-center px-6 sm:px-8 pt-14 sm:pt-20 pb-10 sm:pb-12 gap-5 sm:gap-6">
      <p className="text-xs tracking-[0.25em] text-gold uppercase">Beyond the surface</p>
      <h1 className="text-3xl sm:text-4xl md:text-6xl leading-tight max-w-2xl font-normal font-serif">
        Meet someone who <em className="italic text-gold">gets</em> you — not just likes you
      </h1>
      <p className="text-subtle max-w-md leading-relaxed text-sm sm:text-base">
        DeepMatch pairs you based on values, worldview, and the questions that actually matter.
        No swiping. No noise.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-2 w-full sm:w-auto px-4 sm:px-0">
        <button className="btn-primary w-full sm:w-auto" onClick={() => navigate('/profile')}>
          Start your profile
        </button>
        <button className="btn-ghost w-full sm:w-auto" onClick={() => {
          document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })
        }}>
          See how it works
        </button>
      </div>
    </section>
  )
}
