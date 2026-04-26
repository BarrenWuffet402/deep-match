import express from 'express'
import { createServer } from 'http'

const app = express()
const PORT = process.env.PORT || 4000

app.use(express.json())

// CORS for dev
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  next()
})

const DIMENSION_WEIGHTS = {
  0: {
    0: { Personality: 82, Lifestyle: 78, Spirituality: 72, Intellect: 75 },
    1: { Attachment: 87, Intimacy: 82, Lifestyle: 76, Values: 78 },
    2: { Ambition: 82, Humor: 76, Personality: 74, Lifestyle: 80 },
    3: { Lifestyle: 68, Humor: 84, Attachment: 62, Personality: 70 },
  },
  1: {
    0: { Communication: 92, Attachment: 82, Values: 80 },
    1: { Communication: 76, Attachment: 72, Spirituality: 68, Values: 74 },
    2: { Intellect: 88, Communication: 77, Ambition: 75 },
    3: { Personality: 78, Communication: 72, Humor: 70 },
  },
  2: {
    0: { Attachment: 77, Intimacy: 82, Values: 78, Lifestyle: 74 },
    1: { Intimacy: 92, Communication: 87, Attachment: 82, Humor: 74 },
    2: { Attachment: 72, Lifestyle: 77, Ambition: 74, Personality: 76 },
    3: { Personality: 68, Values: 68, Intellect: 70 },
  },
  3: {
    0: { Finances: 77, Values: 82, Lifestyle: 75 },
    1: { Finances: 82, Attachment: 72, Values: 76 },
    2: { Finances: 86, Ambition: 87, Lifestyle: 80 },
    3: { Finances: 67, Personality: 72, Values: 68 },
  },
  4: {
    0: { Location: 87, Lifestyle: 82, Values: 78 },
    1: { Attachment: 92, Intimacy: 87, Location: 72, Values: 84 },
    2: { Location: 67, Ambition: 78, Lifestyle: 68, Personality: 72 },
    3: { Spirituality: 87, Values: 82, Location: 72, Personality: 78 },
  },
  5: {
    0: { Personality: 82, Communication: 87, Attachment: 82, Values: 78 },
    1: { Personality: 87, Ambition: 82, Communication: 82, Humor: 78 },
    2: { Intellect: 87, Personality: 76, Humor: 78, Values: 74 },
    3: { Personality: 77, Communication: 72, Humor: 74 },
  },
  6: {
    0: { Spirituality: 96, Values: 92, Lifestyle: 78 },
    1: { Intellect: 87, Spirituality: 62, Values: 77 },
    2: { Values: 82, Personality: 82, Spirituality: 58, Humor: 74 },
    3: { Spirituality: 72, Values: 72, Intellect: 77, Personality: 70 },
  },
}

const ALL_DIMENSIONS = [
  'Personality', 'Values', 'Intellect', 'Spirituality', 'Communication',
  'Attachment', 'Lifestyle', 'Humor', 'Ambition', 'Intimacy', 'Finances', 'Location'
]

function computeDimensionScores(answers) {
  const totals = {}
  const counts = {}
  ALL_DIMENSIONS.forEach((d) => { totals[d] = 0; counts[d] = 0 })

  for (const { questionId, answer } of answers) {
    const qIndex = questionId - 1
    const weights = DIMENSION_WEIGHTS[qIndex]?.[answer]
    if (!weights) continue
    for (const [dim, val] of Object.entries(weights)) {
      if (totals[dim] !== undefined) {
        totals[dim] += val
        counts[dim]++
      }
    }
  }

  const scores = {}
  for (const dim of ALL_DIMENSIONS) {
    if (counts[dim] > 0) {
      scores[dim] = Math.round(totals[dim] / counts[dim])
    } else {
      scores[dim] = 65 + (answers.reduce((sum, a) => sum + (a.answer ?? 0), 0) * 3 + dim.length * 2) % 20
    }
  }
  return scores
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'DeepMatch API', version: '0.2.0', timestamp: new Date().toISOString() })
})

app.get('/api/matches', (req, res) => {
  res.json({
    matches: [
      { id: 1, name: 'Sofia', age: 29, city: 'Stockholm', job: 'Writer', emoji: '🌿', matchScore: 91, tags: ['Solitude', 'Philosophy', 'Late nights'] },
      { id: 2, name: 'Marcus', age: 32, city: 'Copenhagen', job: 'Architect', emoji: '🌊', matchScore: 88, tags: ['Minimalism', 'Nature', 'Honesty'] },
      { id: 3, name: 'Leila', age: 27, city: 'Berlin', job: 'Therapist', emoji: '😭', matchScore: 85, tags: ['Depth', 'Music', 'Slow living'] },
    ]
  })
})

app.post('/api/answers', (req, res) => {
  const { answers } = req.body
  if (!Array.isArray(answers) || answers.length === 0) {
    return res.status(400).json({ error: 'answers array required' })
  }
  const dimensionScores = computeDimensionScores(answers)
  res.json({ success: true, message: 'Profile computed.', dimensionScores, answeredQuestions: answers.length })
})

app.post('/api/profile', (req, res) => {
  const profile = req.body
  res.json({ success: true, id: Math.random().toString(36).slice(2), profile })
})

const server = createServer(app)
server.listen(PORT, () => {
  console.log('DeepMatch API running on http://localhost:' + PORT)
})
