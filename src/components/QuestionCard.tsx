import { useState } from 'react'

export interface Question {
  id: number
  text: string
  options: string[]
}

interface QuestionCardProps {
  question: Question
  questionNumber: number
  totalQuestions: number
  onAnswer?: (optionIndex: number) => void
  onNext?: () => void
  onBack?: () => void
  selectedOption?: number | null
  showNav?: boolean
}

export default function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  onNext,
  onBack,
  selectedOption = null,
  showNav = true,
}: QuestionCardProps) {
  const [localSelected, setLocalSelected] = useState<number | null>(selectedOption)

  const handleSelect = (idx: number) => {
    setLocalSelected(idx)
    onAnswer?.(idx)
  }

  const dots = Array.from({ length: totalQuestions }, (_, i) => i < questionNumber)

  return (
    <div className="max-w-xl mx-auto bg-surface border border-border rounded-2xl p-5 sm:p-8">
      <div className="text-xs text-gold tracking-widest uppercase mb-3">
        Question {questionNumber} of {totalQuestions}
      </div>
      <p className="text-base sm:text-lg leading-relaxed mb-6 font-serif">{question.text}</p>
      <div className="flex flex-col gap-3">
        {question.options.map((opt, idx) => (
          <button
            key={idx}
            className={`q-option${localSelected === idx ? ' selected' : ''}`}
            onClick={() => handleSelect(idx)}
          >
            {opt}
          </button>
        ))}
      </div>
      {showNav && (
        <div className="flex justify-between items-center mt-6">
          <span className="text-sm text-subtle">
            {dots.map((filled, i) => (
              <span key={i}>{filled ? '●' : '○'}</span>
            ))}
          </span>
          <div className="flex gap-3">
            {onBack && questionNumber > 1 && (
              <button className="btn-ghost text-sm px-5 py-2" onClick={onBack}>
                ← Back
              </button>
            )}
            {onNext && (
              <button
                className="btn-primary text-sm px-6 py-2"
                onClick={onNext}
                disabled={localSelected === null}
                style={{ opacity: localSelected === null ? 0.5 : 1 }}
              >
                Next →
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
