import { Routes, Route } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { SocketProvider } from './context/SocketContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AuthModal from './components/AuthModal'
import RequireAuth from './components/RequireAuth'
import HomePage from './pages/HomePage'
import MatchesPage from './pages/MatchesPage'
import MatchDetailPage from './pages/MatchDetailPage'
import ProfileSetupPage from './pages/ProfileSetupPage'
import QuestionFlowPage from './pages/QuestionFlowPage'
import StoriesPage from './pages/StoriesPage'
import HowItWorksPage from './pages/HowItWorksPage'
import ConnectPage from './pages/ConnectPage'
import CallPage from './pages/CallPage'
import PostCallPage from './pages/PostCallPage'

function AppInner() {
  const { showAuthModal, authModalMode, closeAuthModal } = useAuth()

  return (
    <div className="min-h-screen flex flex-col">
      <Routes>
        {/* Full-screen call routes — no Navbar/Footer */}
        <Route path="/connect" element={<ConnectPage />} />
        <Route path="/call" element={<CallPage />} />
        <Route path="/post-call" element={<PostCallPage />} />

        {/* Standard layout routes */}
        <Route
          path="*"
          element={
            <>
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/matches" element={<RequireAuth><MatchesPage /></RequireAuth>} />
                  <Route path="/matches/:id" element={<RequireAuth><MatchDetailPage /></RequireAuth>} />
                  <Route path="/profile" element={<RequireAuth><ProfileSetupPage /></RequireAuth>} />
                  <Route path="/questions" element={<RequireAuth><QuestionFlowPage /></RequireAuth>} />
                  <Route path="/stories" element={<StoriesPage />} />
                  <Route path="/how-it-works" element={<HowItWorksPage />} />
                </Routes>
              </main>
              <Footer />
              {showAuthModal && <AuthModal defaultMode={authModalMode} onClose={closeAuthModal} />}
            </>
          }
        />
      </Routes>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <AppInner />
      </SocketProvider>
    </AuthProvider>
  )
}
