interface ScoreExplanationModalProps {
  onClose: () => void
}

const DIMENSIONS_INFO = [
  { name: 'Personality', icon: '🪞', desc: 'How you move through the world — introvert/extrovert, energy style, core character.' },
  { name: 'Values', icon: '⚖️', desc: 'What you fundamentally believe in and orient your life around.' },
  { name: 'Intellect', icon: '🧠', desc: 'Curiosity, how you engage ideas, your relationship with learning and complexity.' },
  { name: 'Spirituality', icon: '✨', desc: 'How you make meaning — religion, philosophy, awe, or something else entirely.' },
  { name: 'Communication', icon: '💬', desc: 'How you express yourself, handle conflict, and listen.' },
  { name: 'Attachment', icon: '🫂', desc: 'How you bond — secure, anxious, avoidant patterns and what you need.' },
  { name: 'Lifestyle', icon: '🌿', desc: 'Daily rhythms, pace, routines, and how you like to spend your days.' },
  { name: 'Humor', icon: '😄', desc: 'What makes you laugh — absurdist, dry, warm, self-deprecating.' },
  { name: 'Ambition', icon: '🔭', desc: 'How you relate to goals, growth, drive, and future-building.' },
  { name: 'Intimacy', icon: '🕯️', desc: 'Emotional closeness, physical affection, vulnerability capacity.' },
  { name: 'Finances', icon: '💰', desc: 'Money philosophy — security, freedom, generosity, independence.' },
  { name: 'Location', icon: '🗺️', desc: 'Where you want to live, how rooted vs. mobile you are.' },
]

export default function ScoreExplanationModal({ onClose }: ScoreExplanationModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl border border-border overflow-hidden"
        style={{ background: '#14142a', maxHeight: '90vh' }}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-border sticky top-0" style={{ background: '#14142a' }}>
          <button
            onClick={onClose}
            className="absolute top-4 right-5 text-subtle text-xl hover:text-text transition-colors"
            aria-label="Close"
          >
            ×
          </button>
          <div className="text-gold text-xs tracking-widest uppercase mb-1">✦ How scores work</div>
          <h2 className="text-xl font-serif font-normal">The 12 Dimensions</h2>
          <p className="text-subtle text-sm mt-1">
            Your answers map to these dimensions. We compare your profile to each potential match and average the closeness across all 12.
          </p>
        </div>

        {/* Dimensions list */}
        <div className="overflow-y-auto px-6 py-4 flex flex-col gap-3" style={{ maxHeight: 'calc(90vh - 140px)' }}>
          {DIMENSIONS_INFO.map(({ name, icon, desc }) => (
            <div key={name} className="flex gap-3 items-start py-2 border-b border-border last:border-0">
              <span className="text-lg mt-0.5 flex-shrink-0">{icon}</span>
              <div>
                <p className="text-sm font-serif mb-0.5">{name}</p>
                <p className="text-xs text-subtle leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}

          {/* How it's calculated */}
          <div className="mt-2 rounded-xl p-4" style={{ background: '#1e1a10', border: '1px solid rgba(201,169,110,0.2)' }}>
            <p className="text-xs text-gold uppercase tracking-widest mb-2">The formula</p>
            <p className="text-xs text-subtle leading-relaxed">
              Each of your answers contributes to one or more dimensions. We compute a score (0–100) per dimension, then take a weighted average across all 12 to produce your overall match percentage. Dimensions you share strongly with someone pull the score up; mismatches pull it down.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
