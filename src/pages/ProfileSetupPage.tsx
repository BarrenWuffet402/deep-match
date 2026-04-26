import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

type Step = 'basics' | 'values' | 'done'

export default function ProfileSetupPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>('basics')
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name: '', age: '', city: '', job: '', bio: '' })
  const [selectedValues, setSelectedValues] = useState<string[]>([])

  const valueOptions = [
    'Authenticity', 'Deep conversations', 'Solitude', 'Adventure', 'Stability',
    'Creativity', 'Family', 'Spirituality', 'Minimalism', 'Growth',
    'Humor', 'Vulnerability', 'Ambition', 'Nature', 'Intellect',
  ]

  const toggleValue = (v: string) =>
    setSelectedValues((prev) =>
      prev.includes(v) ? prev.filter((x) => x !== v) : prev.length < 5 ? [...prev, v] : prev
    )

  const handleBasicsSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep('values')
  }

  const handleValuesSubmit = async () => {
    setSaving(true)
    try {
      await fetch('http://localhost:4000/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, values: selectedValues }),
        signal: AbortSignal.timeout(3000),
      })
    } catch {
      // API may be offline; proceed anyway
    }
    setSaving(false)
    setStep('done')
  }

  if (step === 'done') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 sm:px-8 text-center">
        <div className="text-6xl mb-6">✦</div>
        <h2 className="text-2xl font-serif font-normal mb-4 text-gold">Profile created</h2>
        <p className="text-subtle mb-8 max-w-sm text-sm sm:text-base">
          We're finding your deep matches now. This takes a moment — we actually think about it.
        </p>
        <button className="btn-primary w-full sm:w-auto" onClick={() => navigate('/questions')}>
          Answer the deep questions →
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
      <p className="text-xs tracking-[0.25em] text-gold uppercase mb-2">
        {step === 'basics' ? 'Step 1 of 2' : 'Step 2 of 2'}
      </p>
      <h1 className="text-xl sm:text-2xl font-serif font-normal mb-2">
        {step === 'basics' ? 'Who are you?' : 'What do you value?'}
      </h1>
      <p className="text-subtle text-sm mb-8">
        {step === 'basics'
          ? 'The basics — we need a place to start.'
          : 'Pick up to 5 things that matter most to you.'}
      </p>

      {/* Progress bar */}
      <div className="h-1 rounded-full mb-8 overflow-hidden" style={{ background: '#1e1e35' }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: step === 'basics' ? '50%' : '100%', background: 'linear-gradient(90deg,#c9a96e,#e8c98a)' }}
        />
      </div>

      {step === 'basics' && (
        <form onSubmit={handleBasicsSubmit} className="flex flex-col gap-5">
          {[
            { id: 'name', label: 'Name', placeholder: 'Your first name' },
            { id: 'age', label: 'Age', placeholder: '25', type: 'number' },
            { id: 'city', label: 'City', placeholder: 'Where you live' },
            { id: 'job', label: 'What you do', placeholder: 'Writer, teacher, builder...' },
          ].map(({ id, label, placeholder, type = 'text' }) => (
            <div key={id}>
              <label className="block text-sm text-subtle mb-1" htmlFor={id}>{label}</label>
              <input
                id={id}
                type={type}
                placeholder={placeholder}
                value={form[id as keyof typeof form]}
                onChange={(e) => setForm({ ...form, [id]: e.target.value })}
                required
                className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-text font-serif text-sm focus:outline-none focus:border-gold transition-colors"
              />
            </div>
          ))}
          <div>
            <label className="block text-sm text-subtle mb-1" htmlFor="bio">In a sentence</label>
            <textarea
              id="bio"
              placeholder="What would you want a match to know about you right away?"
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              rows={3}
              className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-text font-serif text-sm focus:outline-none focus:border-gold transition-colors resize-none"
            />
          </div>
          <button type="submit" className="btn-primary mt-2 w-full sm:w-auto">Continue →</button>
        </form>
      )}

      {step === 'values' && (
        <div>
          <div className="flex flex-wrap gap-2 mb-8">
            {valueOptions.map((v) => (
              <button
                key={v}
                onClick={() => toggleValue(v)}
                className={`tag cursor-pointer transition-all py-2 ${
                  selectedValues.includes(v) ? 'border-gold text-gold bg-[#1e1a10]' : 'hover:border-gold hover:text-gold'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
          <p className="text-xs text-subtle mb-6">{selectedValues.length}/5 selected</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="btn-ghost w-full sm:w-auto" onClick={() => setStep('basics')}>← Back</button>
            <button
              className="btn-primary w-full sm:w-auto"
              disabled={selectedValues.length === 0 || saving}
              style={{ opacity: selectedValues.length === 0 || saving ? 0.5 : 1 }}
              onClick={handleValuesSubmit}
            >
              {saving ? 'Saving…' : 'Next: Deep questions →'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
