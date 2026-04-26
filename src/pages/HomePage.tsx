import { useNavigate } from 'react-router-dom'
import HeroSection from '../components/HeroSection'
import StatBar from '../components/StatBar'
import ProfileCard from '../components/ProfileCard'
import type { Profile } from '../components/ProfileCard'
import QuestionCard from '../components/QuestionCard'
import type { Question } from '../components/QuestionCard'
import HowItWorks from '../components/HowItWorks'

const sampleProfiles: Profile[] = [
  { emoji: '🌿', name: 'Sofia', age: 29, city: 'Stockholm', job: 'Writer', tags: ['Solitude', 'Philosophy', 'Late nights'], matchScore: 91 },
  { emoji: '🌊', name: 'Marcus', age: 32, city: 'Copenhagen', job: 'Architect', tags: ['Minimalism', 'Nature', 'Honesty'], matchScore: 88 },
  { emoji: '😭', name: 'Leila', age: 27, city: 'Berlin', job: 'Therapist', tags: ['Depth', 'Music', 'Slow living'], matchScore: 85 },
  { emoji: '🌙', name: 'Daniel', age: 34, city: 'Oslo', job: 'Researcher', tags: ['Curiosity', 'Books', 'Vulnerability'], matchScore: 83 },
]

const sampleQuestion: Question = {
  id: 2,
  text: 'When a relationship gets hard, your instinct is to...',
  options: [
    "Talk it out, even if it's uncomfortable",
    'Give it space and come back when calm',
    'Understand the root cause first',
    'It depends — I read the situation',
  ],
}

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <>
      <HeroSection />
      <StatBar />

      <p className="text-center text-xs tracking-[0.2em] text-subtle uppercase py-6">
        Today&apos;s deep matches
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 px-4 sm:px-8 pb-12 max-w-6xl mx-auto">
        {sampleProfiles.map((profile) => (
          <ProfileCard key={profile.name} profile={profile} />
        ))}
      </div>

      <section className="bg-[#10101f] border-t border-b border-border px-4 sm:px-8 py-10 sm:py-12">
        <h2 className="text-center text-xl sm:text-2xl font-normal font-serif mb-2">
          The questions that matter
        </h2>
        <p className="text-center text-subtle text-sm mb-8">A taste of what shapes your match</p>
        <QuestionCard
          question={sampleQuestion}
          questionNumber={2}
          totalQuestions={5}
          onNext={() => navigate('/questions')}
        />
      </section>

      <HowItWorks />
    </>
  )
}
