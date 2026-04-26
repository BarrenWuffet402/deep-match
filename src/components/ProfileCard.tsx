import { useNavigate } from 'react-router-dom'

export interface Profile {
  id?: string | number
  emoji: string
  name: string
  age: number
  city: string
  job: string
  tags: string[]
  matchScore: number
}

interface ProfileCardProps {
  profile: Profile
}

export default function ProfileCard({ profile }: ProfileCardProps) {
  const navigate = useNavigate()

  const handleClick = () => {
    if (profile.id !== undefined) {
      navigate(`/matches/${profile.id}`)
    }
  }

  return (
    <div className="card w-full flex-shrink-0" onClick={handleClick} role={profile.id !== undefined ? 'button' : undefined}>
      <div
        className="w-full h-40 sm:h-44 flex items-center justify-center text-5xl"
        style={{ background: 'linear-gradient(135deg, #1e1e35, #2a2a45)' }}
      >
        {profile.emoji}
      </div>
      <div className="p-4">
        <div className="text-base font-serif mb-1">
          {profile.name}, {profile.age}
        </div>
        <div className="text-xs text-subtle mb-3">
          {profile.city} · {profile.job}
        </div>
        <div className="flex flex-wrap gap-1">
          {profile.tags.map((tag) => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
        <div className="text-xs text-gold mt-3">✦ {profile.matchScore}% deep match</div>
      </div>
    </div>
  )
}
