import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Question } from '../components/QuestionCard'

const questions: Question[] = [
  { id: 1, text: "When you picture your ideal Sunday morning, you're...", options: ['Alone with coffee and a book', 'On a slow walk with someone you love', 'Creating something — music, art, words', 'Still in bed, completely unbothered'] },
  { id: 2, text: "When a relationship gets hard, your instinct is to...", options: ["Talk it out, even if it's uncomfortable", 'Give it space and come back when calm', 'Understand the root cause first', "It depends — I read the situation"] },
  { id: 3, text: "Which of these feels most true about how you love?", options: ['I love quietly — through presence and small acts', 'I love loudly — words, touch, full expression', 'I love deeply but need space to stay myself', "I'm still figuring out how I love"] },
  { id: 4, text: 'Your relationship with money is best described as...', options: ['A tool — enough is enough', 'Security — I need a cushion to feel free', 'Freedom — I want it to open doors', 'Complicated — it carries a lot of weight'] },
  { id: 5, text: 'What does "home" feel like to you?', options: ['A specific place I return to', 'Wherever the people I love are', "Something I'm still searching for", 'Inside myself — I carry it with me'] },
  { id: 6, text: "In your closest friendships, you're usually...", options: ['The one people come to — I hold space well', 'The one who makes things happen and brings energy', 'The quiet observer who notices everything', "Different depending on who I'm with"] },
  { id: 7, text: 'How do you feel about spirituality or meaning-making?', options: ["It's central to how I live", "I'm curious but skeptical", 'I find meaning in people and experiences, not frameworks', "Still working it out — it's a live question for me"] },
]

type Direction = 'forward' | 'backward'

export default function QuestionFlowPage() {
  const navigate = useNavigate()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>(Array(questions.length).fill(null))
  const [direction, setDirection] = useState<Direction>('forward')
  const [animating, setAnimating] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const currentQuestion = questions[currentIndex]
  const isLast = currentIndex === questions.length - 1
  const progress = ((currentIndex + (answers[currentIndex] !== null ? 1 : 0)) / questions.length) * 100

  const handleAnswer = (optionIndex: number) => {
    const updated = [...answers]
    updated[currentIndex] = optionIndex
    setAnswers(updated)
  }

  const transition = (newIndex: number, dir: Direction) => {
    if (animating) return
    setDirection(dir)
    setAnimating(true)
    setTimeout(() => { setCurrentIndex(newIndex); setAnimating(false) }, 280)
  }

  const handleNext = async () => {
    if (isLast) {
      setSubmitting(true)
      const payload = answers.map((a, i) => ({ questionId: questions[i].id, answer: a }))
      try {
        const res = await fetch('http://localhost:4000/api/answers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ answers: payload }),
          signal: AbortSignal.timeout(3000),
        })
        if (res.ok) {
          const data = await res.json()
          if (data.dimensionScores) {
            localStorage.setItem('deepmatch_dimension_scores', JSON.stringify(data.dimensionScores))
          }
        }
      } catch {
        // API may be offline; proceed anyway
      }
      setSubmitting(false)
      navigate('/matches')
    } else {
      transition(currentIndex + 1, 'forward')
    }
  }

  const handleBack = () => {
    if (currentIndex > 0) transition(currentIndex - 1, 'backward')
  }

  const slideClass = animating
    ? direction === 'forward' ? 'question-exit-left' : 'question-exit-right'
    : 'question-enter'

  return (
    <div className="px-4 sm:px-8 py-8 sm:py-12">
      <style>{`
        @keyframes slideInRight { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slideInLeft  { from { opacity: 0; transform: translateX(-40px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slideOutLeft { from { opacity: 1; transform: translateX(0); } to { opacity: 0; transform: translateX(-40px); } }
        @keyframes slideOutRight{ from { opacity: 1; transform: translateX(0); } to { opacity: 0; transform: translateX(40px); } }
        .question-enter { animation: ${direction === 'forward' ? 'slideInRight' : 'slideInLeft'} 0.28s ease both; }
        .question-exit-left  { animation: slideOutLeft  0.28s ease both; }
        .question-exit-right { animation: slideOutRight 0.28s ease both; }
      `}</style>

      <div className="text-center mb-8">
        <p className="text-xs tracking-[0.25em] text-gold uppercase mb-2">The deep questions</p>
        <h1 className="text-xl sm:text-2xl font-serif font-normal mb-2">What shapes your world</h1>
        <p className="text-subtle text-sm">Honest answers get better matches. There are no wrong ones.</p>
      </div>

      {/* Progress bar */}
      <div className="max-w-xl mx-auto mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-subtle">Question {currentIndex + 1} of {questions.length}</span>
          <span className="text-xs text-gold">{Math.round(progress)}%</span>
        </div>
        <div className="h-1 rounded-full overflow-hidden" style={{ background: '#1e1e35' }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #c9a96e, #e8c98a)' }}
          />
        </div>
      </div>

      {/* Animated question card */}
      <div ref={containerRef} className="max-w-xl mx-auto">
        <div key={currentIndex} className={`bg-surface border border-border rounded-2xl p-5 sm:p-8 ${slideClass}`}>
          <p className="text-base sm:text-lg leading-relaxed mb-6 font-serif">{currentQuestion.text}</p>
          <div className="flex flex-col gap-3">
            {currentQuestion.options.map((opt, idx) => (
              <button
                key={idx}
                className={`q-option${answers[currentIndex] === idx ? ' selected' : ''}`}
                onClick={() => handleAnswer(idx)}
              >
                {opt}
              </button>
            ))}
          </div>

          <div className="flex justify-between items-center mt-6">
            <div>
              {currentIndex > 0 && (
                <button className="btn-ghost text-sm px-5 py-2" onClick={handleBack}>← Back</button>
              )}
            </div>
            <button
              className="btn-primary text-sm px-6 py-2"
              onClick={handleNext}
              disabled={answers[currentIndex] === null || submitting}
              style={{ opacity: answers[currentIndex] === null || submitting ? 0.5 : 1 }}
            >
              {submitting ? 'Saving…' : isLast ? 'See my matches →' : 'Next →'}
            </button>
          </div>
        </div>
      </div>

      {isLast && answers[currentIndex] !== null && (
        <div className="text-center mt-6">
          <p className="text-subtle text-sm">
            That's all {questions.length} questions — ready to see your matches?
          </p>
        </div>
      )}
    </div>
  )
}
