import express from 'express'
import { createServer } from 'http'

const app = express()
const PORT = process.env.PORT || 4000

app.use(express.json())

// CORS for dev
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  if (req.method === 'OPTIONS') return res.sendStatus(204)
  next()
})

const ALL_DIMENSIONS = [
  'Personality', 'Values', 'Intellect', 'Spirituality', 'Communication',
  'Attachment', 'Lifestyle', 'Humor', 'Ambition', 'Intimacy', 'Finances', 'Location'
]

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

const PROFILE_POOL = [
  {
    id: '1', emoji: '🌿', name: 'Sofia', age: 29, city: 'Stockholm', job: 'Writer',
    bio: 'I write about the quiet spaces between words. Looking for someone who appreciates silence as much as conversation.',
    tags: ['Solitude', 'Philosophy', 'Late nights'], values: ['Authenticity', 'Deep conversations', 'Solitude'],
    dimensionScores: { Personality: 88, Values: 94, Intellect: 86, Spirituality: 84, Communication: 82, Attachment: 78, Lifestyle: 80, Humor: 66, Ambition: 72, Intimacy: 90, Finances: 68, Location: 88 },
  },
  {
    id: '2', emoji: '🌊', name: 'Marcus', age: 32, city: 'Copenhagen', job: 'Architect',
    bio: 'I design spaces that breathe. I believe in doing fewer things, better.',
    tags: ['Minimalism', 'Nature', 'Honesty'], values: ['Minimalism', 'Nature', 'Honesty'],
    dimensionScores: { Personality: 78, Values: 86, Intellect: 88, Spirituality: 54, Communication: 80, Attachment: 72, Lifestyle: 92, Humor: 70, Ambition: 88, Intimacy: 74, Finances: 90, Location: 82 },
  },
  {
    id: '3', emoji: '🌺', name: 'Leila', age: 27, city: 'Berlin', job: 'Therapist',
    bio: 'I hold space for others all day. At night I need someone who can hold space for me.',
    tags: ['Depth', 'Music', 'Slow living'], values: ['Vulnerability', 'Depth', 'Growth'],
    dimensionScores: { Personality: 84, Values: 84, Intellect: 78, Spirituality: 76, Communication: 96, Attachment: 92, Lifestyle: 72, Humor: 80, Ambition: 64, Intimacy: 94, Finances: 60, Location: 76 },
  },
  {
    id: '4', emoji: '🌙', name: 'Daniel', age: 34, city: 'Oslo', job: 'Researcher',
    bio: "I study how humans learn. I'm still learning how to love.",
    tags: ['Curiosity', 'Books', 'Vulnerability'], values: ['Intellect', 'Vulnerability', 'Honesty'],
    dimensionScores: { Personality: 68, Values: 80, Intellect: 96, Spirituality: 60, Communication: 76, Attachment: 68, Lifestyle: 68, Humor: 84, Ambition: 92, Intimacy: 72, Finances: 78, Location: 80 },
  },
  {
    id: '5', emoji: '🔥', name: 'Anika', age: 31, city: 'Amsterdam', job: 'Designer',
    bio: 'Color, texture, movement — I see the world in layers. I want a partner who sees it differently.',
    tags: ['Creativity', 'Honesty', 'Travel'], values: ['Creativity', 'Adventure', 'Authenticity'],
    dimensionScores: { Personality: 86, Values: 72, Intellect: 70, Spirituality: 56, Communication: 88, Attachment: 68, Lifestyle: 90, Humor: 92, Ambition: 84, Intimacy: 72, Finances: 64, Location: 66 },
  },
  {
    id: '6', emoji: '🌸', name: 'Kai', age: 28, city: 'Helsinki', job: 'Musician',
    bio: 'Music is how I process the world. Looking for someone who feels before they think.',
    tags: ['Art', 'Emotions', 'Silence'], values: ['Creativity', 'Spirituality', 'Depth'],
    dimensionScores: { Personality: 74, Values: 70, Intellect: 64, Spirituality: 92, Communication: 68, Attachment: 86, Lifestyle: 70, Humor: 76, Ambition: 58, Intimacy: 88, Finances: 56, Location: 66 },
  },
  {
    id: '7', emoji: '✨', name: 'Vera', age: 33, city: 'Vienna', job: 'Philosopher',
    bio: "I ask questions for a living. Searching for someone who enjoys not having all the answers.",
    tags: ['Depth', 'Ethics', 'Wonder'], values: ['Intellect', 'Ethics', 'Wonder'],
    dimensionScores: { Personality: 72, Values: 78, Intellect: 94, Spirituality: 82, Communication: 76, Attachment: 66, Lifestyle: 64, Humor: 72, Ambition: 76, Intimacy: 70, Finances: 70, Location: 66 },
  },
  {
    id: '8', emoji: '🌍', name: 'Elias', age: 30, city: 'Zurich', job: 'Engineer',
    bio: 'I build things that last. Hoping to build something real.',
    tags: ['Logic', 'Nature', 'Simplicity'], values: ['Simplicity', 'Nature', 'Stability'],
    dimensionScores: { Personality: 64, Values: 72, Intellect: 86, Spirituality: 48, Communication: 66, Attachment: 70, Lifestyle: 80, Humor: 66, Ambition: 88, Intimacy: 62, Finances: 94, Location: 72 },
  },
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

function computeDimensionCompatibility(userScores, profileScores) {
  const compat = {}
  for (const dim of ALL_DIMENSIONS) {
    const u = userScores[dim] ?? 65
    const p = profileScores[dim] ?? 65
    compat[dim] = Math.round(Math.max(0, 100 - Math.abs(u - p) * 1.4))
  }
  return compat
}

function cosineSimilarity(userScores, profileScores) {
  let dot = 0, magA = 0, magB = 0
  for (const dim of ALL_DIMENSIONS) {
    const a = userScores[dim] ?? 65
    const b = profileScores[dim] ?? 65
    dot += a * b
    magA += a * a
    magB += b * b
  }
  if (magA === 0 || magB === 0) return 0
  return dot / (Math.sqrt(magA) * Math.sqrt(magB))
}

function getTopSharedDimensions(dimCompatibility, n = 3) {
  return Object.entries(dimCompatibility)
    .sort(([, a], [, b]) => b - a)
    .slice(0, n)
    .map(([dim]) => dim)
}

function computeMatches(userScores) {
  return PROFILE_POOL
    .map((profile) => {
      const dimCompat = computeDimensionCompatibility(userScores, profile.dimensionScores)
      const cosine = cosineSimilarity(userScores, profile.dimensionScores)
      const avgCompat = Object.values(dimCompat).reduce((s, v) => s + v, 0) / ALL_DIMENSIONS.length
      const matchScore = Math.round(cosine * 60 + avgCompat * 0.4)
      const topDimensions = getTopSharedDimensions(dimCompat, 3)
      return {
        ...profile,
        matchScore,
        dimensionCompatibility: dimCompat,
        topDimensions,
      }
    })
    .sort((a, b) => b.matchScore - a.matchScore)
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'DeepMatch API', version: '0.3.0', timestamp: new Date().toISOString() })
})

app.get('/api/matches', (req, res) => {
  const stored = req.query.scores
  if (stored) {
    try {
      const userScores = JSON.parse(decodeURIComponent(stored))
      return res.json({ matches: computeMatches(userScores), source: 'computed' })
    } catch {}
  }
  res.json({ matches: PROFILE_POOL, note: 'Static profiles — submit answers for ranked matches' })
})

app.post('/api/answers', (req, res) => {
  const { answers } = req.body
  if (!Array.isArray(answers) || answers.length === 0) {
    return res.status(400).json({ error: 'answers array required' })
  }
  const dimensionScores = computeDimensionScores(answers)
  const matches = computeMatches(dimensionScores)
  res.json({
    success: true,
    message: 'Profile computed.',
    dimensionScores,
    answeredQuestions: answers.length,
    matches,
  })
})

app.post('/api/compute-matches', (req, res) => {
  const { dimensionScores } = req.body
  if (!dimensionScores || typeof dimensionScores !== 'object') {
    return res.status(400).json({ error: 'dimensionScores object required' })
  }
  const matches = computeMatches(dimensionScores)
  res.json({ success: true, matches })
})

app.post('/api/profile', (req, res) => {
  const profile = req.body
  res.json({ success: true, id: Math.random().toString(36).slice(2), profile })
})

const server = createServer(app)
server.listen(PORT, () => {
  console.log('DeepMatch API running on http://localhost:' + PORT)
})
