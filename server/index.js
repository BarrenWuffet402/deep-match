import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'

const app = express()
const PORT = process.env.PORT || 4000
const httpServer = createServer(app)

const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    methods: ['GET', 'POST'],
  },
})

app.use(express.json())

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  if (req.method === 'OPTIONS') return res.sendStatus(204)
  next()
})

// Match queue: array of { socketId, gender, ageRange, preference, waitingSince }
const matchQueue = []

// Active rooms: roomId -> { users: [socketId, socketId], extendVotes: Set }
const activeRooms = new Map()

// Post-call connect votes: roomId -> { votes: Map<socketId, bool> }
const postCallVotes = new Map()

// Chat rooms: roomId -> [{ from, text, ts }]
const chatHistory = new Map()

function findMatch(entry) {
  for (let i = 0; i < matchQueue.length; i++) {
    const candidate = matchQueue[i]
    if (candidate.socketId === entry.socketId) continue

    // Preference compatibility (voice/video/either)
    const prefOk =
      entry.preference === 'either' ||
      candidate.preference === 'either' ||
      entry.preference === candidate.preference

    if (!prefOk) continue

    // Gender preference filtering
    const entryWantsCandidate =
      !entry.genderPref || entry.genderPref === 'any' || entry.genderPref === candidate.gender
    const candidateWantsEntry =
      !candidate.genderPref || candidate.genderPref === 'any' || candidate.genderPref === entry.gender

    if (!entryWantsCandidate || !candidateWantsEntry) continue

    // Age range filtering
    if (entry.ageRange && candidate.age) {
      const [minA, maxA] = entry.ageRange
      if (candidate.age < minA || candidate.age > maxA) continue
    }
    if (candidate.ageRange && entry.age) {
      const [minB, maxB] = candidate.ageRange
      if (entry.age < minB || entry.age > maxB) continue
    }

    return i
  }
  return -1
}

function removeFromQueue(socketId) {
  const idx = matchQueue.findIndex((e) => e.socketId === socketId)
  if (idx !== -1) matchQueue.splice(idx, 1)
}

function makeRoomId() {
  return 'room-' + Math.random().toString(36).slice(2, 10)
}

io.on('connection', (socket) => {
  // --- Queue management ---

  socket.on('join-queue', (data) => {
    removeFromQueue(socket.id)
    const entry = {
      socketId: socket.id,
      gender: data.gender || 'unknown',
      genderPref: data.genderPref || 'any',
      age: data.age || null,
      ageRange: data.ageRange || null,
      preference: data.preference || 'either',
      waitingSince: Date.now(),
    }

    const matchIdx = findMatch(entry)
    if (matchIdx !== -1) {
      const matched = matchQueue.splice(matchIdx, 1)[0]
      const roomId = makeRoomId()
      const callPreference =
        entry.preference !== 'either'
          ? entry.preference
          : matched.preference !== 'either'
          ? matched.preference
          : 'voice'

      activeRooms.set(roomId, { users: [socket.id, matched.socketId], extendVotes: new Set() })

      socket.join(roomId)
      io.sockets.sockets.get(matched.socketId)?.join(roomId)

      io.to(socket.id).emit('match-found', { roomId, role: 'caller', preference: callPreference })
      io.to(matched.socketId).emit('match-found', { roomId, role: 'callee', preference: callPreference })
    } else {
      matchQueue.push(entry)
      socket.emit('queue-joined', { position: matchQueue.length, estimatedWait: matchQueue.length * 15 })
    }
  })

  socket.on('leave-queue', () => {
    removeFromQueue(socket.id)
    socket.emit('queue-left')
  })

  // --- WebRTC signalling ---

  socket.on('offer', ({ roomId, offer }) => {
    socket.to(roomId).emit('offer', { offer })
  })

  socket.on('answer', ({ roomId, answer }) => {
    socket.to(roomId).emit('answer', { answer })
  })

  socket.on('ice-candidate', ({ roomId, candidate }) => {
    socket.to(roomId).emit('ice-candidate', { candidate })
  })

  // --- Call lifecycle ---

  socket.on('call-ended', ({ roomId }) => {
    socket.to(roomId).emit('peer-ended-call')
    cleanupRoom(roomId)
  })

  socket.on('extend-request', ({ roomId }) => {
    const room = activeRooms.get(roomId)
    if (!room) return
    room.extendVotes.add(socket.id)
    socket.to(roomId).emit('extend-requested')

    if (room.extendVotes.size === 2) {
      room.extendVotes.clear()
      io.to(roomId).emit('call-extended')
    }
  })

  socket.on('extend-decline', ({ roomId }) => {
    io.to(roomId).emit('extend-declined')
    const room = activeRooms.get(roomId)
    if (room) room.extendVotes.clear()
  })

  // --- Post-call ---

  socket.on('post-call-vote', ({ roomId, connect }) => {
    if (!postCallVotes.has(roomId)) {
      postCallVotes.set(roomId, { votes: new Map() })
    }
    const record = postCallVotes.get(roomId)
    record.votes.set(socket.id, connect)

    const room = activeRooms.get(roomId)
    if (!room) return

    if (record.votes.size === 2) {
      const bothConnect = [...record.votes.values()].every(Boolean)
      if (bothConnect) {
        chatHistory.set(roomId, [])
        io.to(roomId).emit('mutual-connect', { roomId })
      } else {
        io.to(roomId).emit('no-connect')
      }
      postCallVotes.delete(roomId)
    }
  })

  // --- Chat (post-match) ---

  socket.on('chat-message', ({ roomId, text }) => {
    if (!text || typeof text !== 'string') return
    const msg = { from: socket.id, text: text.slice(0, 500), ts: Date.now() }
    const history = chatHistory.get(roomId)
    if (history !== undefined) {
      history.push(msg)
      io.to(roomId).emit('chat-message', msg)
    }
  })

  // --- Cleanup on disconnect ---

  socket.on('disconnect', () => {
    removeFromQueue(socket.id)
    for (const [roomId, room] of activeRooms.entries()) {
      if (room.users.includes(socket.id)) {
        socket.to(roomId).emit('peer-disconnected')
        cleanupRoom(roomId)
        break
      }
    }
  })
})

function cleanupRoom(roomId) {
  activeRooms.delete(roomId)
}

// --- REST endpoints ---

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'DeepMatch API', version: '0.4.0', timestamp: new Date().toISOString(), queueDepth: matchQueue.length })
})

app.get('/api/queue-depth', (req, res) => {
  res.json({ depth: matchQueue.length, estimatedWait: matchQueue.length * 15 })
})

httpServer.listen(PORT, () => {
  console.log('DeepMatch API + Socket.io running on http://localhost:' + PORT)
})
