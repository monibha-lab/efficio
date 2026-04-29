import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react'

export default function AuthPage() {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useApp()
  const [mode, setMode] = useState('signin') // signin | signup
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleGoogle = async () => {
    setError('')
    await signInWithGoogle()
  }

  const handleEmail = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      if (mode === 'signin') {
        const { error } = await signInWithEmail(email, password)
        if (error) setError(error.message)
      } else {
        const { error } = await signUpWithEmail(email, password)
        if (error) {
          setError(error.message)
        } else {
          setSuccess('Check your email to confirm your account!')
        }
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream-100 flex items-center justify-center p-4">
      {/* Background blobs */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-sage-100 rounded-full opacity-30 blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-80 h-80 bg-lavender-100 rounded-full opacity-30 blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="font-heading font-800 text-4xl text-sage-800 tracking-widest mb-1">
            EFFICIO
          </h1>
          <div className="w-12 h-0.5 bg-sage-400 mx-auto mb-3 rounded-full" />
          <p className="text-gray-400 text-xs tracking-widest uppercase font-semibold">
            Your productivity, gamified
          </p>
        </div>

        {/* Card */}
        <div className="card">
          {/* Mode toggle */}
          <div className="flex bg-cream-100 rounded-xl p-1 mb-6">
            {['signin', 'signup'].map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(''); setSuccess('') }}
                className={`flex-1 py-2 rounded-xl text-sm font-heading font-semibold transition-all duration-200
                  ${mode === m ? 'bg-white text-sage-800 shadow-card' : 'text-gray-400'}`}
              >
                {m === 'signin' ? 'Sign in' : 'Create account'}
              </button>
            ))}
          </div>

          {/* Google */}
          <button
            onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-3 rounded-xl border border-cream-300
                       bg-white py-3 text-sm font-semibold text-gray-700 hover:bg-cream-50
                       active:scale-98 transition-all duration-150 mb-4 shadow-card"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-cream-300" />
            <span className="text-xs text-gray-400 font-semibold">or</span>
            <div className="flex-1 h-px bg-cream-300" />
          </div>

          {/* Email form */}
          <form onSubmit={handleEmail} className="space-y-3">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="input pl-10"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="input pl-10 pr-10"
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Error / success */}
            {error && (
              <div className="flex items-center gap-2 text-rose-600 text-xs bg-rose-100 rounded-xl px-3 py-2.5">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                {error}
              </div>
            )}
            {success && (
              <div className="text-sage-600 text-xs bg-sage-100 rounded-xl px-3 py-2.5">
                ✓ {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : null}
              {mode === 'signin' ? 'Sign in' : 'Create account'}
            </button>
          </form>

          {mode === 'signin' && (
            <p className="text-center text-xs text-gray-400 mt-4">
              Forgot your password?{' '}
              <span className="text-sage-600 cursor-pointer hover:underline">Reset it</span>
            </p>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          By continuing, you agree to Efficio's Terms of Service
        </p>
      </div>
    </div>
  )
}
