const DIMENSIONS = [
  'Personality', 'Values', 'Intellect', 'Spirituality', 'Communication',
  'Attachment', 'Lifestyle', 'Humor', 'Ambition', 'Intimacy', 'Finances', 'Location'
]

interface DimensionChartProps {
  scores: Record<string, number>
  userScores?: Record<string, number>
}

export default function DimensionChart({ scores, userScores }: DimensionChartProps) {
  return (
    <div className="flex flex-col gap-3">
      {DIMENSIONS.map((dim) => {
        const matchVal = scores[dim] ?? 70
        const userVal = userScores?.[dim] ?? 70
        return (
          <div key={dim}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-subtle">{dim}</span>
              <div className="flex gap-2 items-center">
                {userScores && (
                  <span className="text-xs" style={{ color: '#9b95a3' }}>{userVal}%</span>
                )}
                <span className="text-xs text-gold">{matchVal}%</span>
              </div>
            </div>
            <div className="relative h-2 rounded-full overflow-hidden" style={{ background: '#1e1e35' }}>
              {/* User bar (behind, subtle) */}
              {userScores && (
                <div
                  className="absolute top-0 left-0 h-full rounded-full transition-all duration-700"
                  style={{ width: `${userVal}%`, background: 'rgba(155,149,163,0.4)' }}
                />
              )}
              {/* Match bar (gold, in front) */}
              <div
                className="absolute top-0 left-0 h-full rounded-full transition-all duration-700"
                style={{
                  width: `${matchVal}%`,
                  background: 'linear-gradient(90deg, #c9a96e, #e8c98a)',
                  opacity: 0.85,
                }}
              />
            </div>
          </div>
        )
      })}
      {userScores && (
        <div className="flex gap-4 mt-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-2 rounded-full" style={{ background: 'linear-gradient(90deg,#c9a96e,#e8c98a)' }} />
            <span className="text-xs text-subtle">Their score</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-2 rounded-full" style={{ background: 'rgba(155,149,163,0.5)' }} />
            <span className="text-xs text-subtle">Your score</span>
          </div>
        </div>
      )}
    </div>
  )
}
