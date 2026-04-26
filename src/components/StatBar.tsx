interface Stat {
  value: string
  label: string
}

const stats: Stat[] = [
  { value: '94%', label: 'Say their match just gets them' },
  { value: '38k', label: 'Meaningful connections' },
  { value: '12', label: 'Deep dimensions matched' },
]

export default function StatBar() {
  return (
    <div className="flex justify-center gap-6 sm:gap-12 py-8 flex-wrap px-4">
      {stats.map((stat) => (
        <div key={stat.label} className="text-center">
          <div className="text-2xl sm:text-3xl text-gold font-serif">{stat.value}</div>
          <div className="text-xs text-subtle tracking-widest uppercase mt-1 max-w-24 sm:max-w-none leading-snug">{stat.label}</div>
        </div>
      ))}
    </div>
  )
}
