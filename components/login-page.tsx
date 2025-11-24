'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { LogIn, AlertCircle, Eye, EyeOff } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const router = useRouter()

  // Check if already logged in
  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (token) {
      router.push('/')
    }
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Use Firebase Authentication
      const { signInWithEmailAndPassword } = await import('firebase/auth')
      const { auth } = await import('@/firebase.config')

      // Convert username to email format if it's just "admin"
      const email = username.includes('@') ? username : `${username}@gmail.com`

      // Sign in with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Get Firebase ID token
      const token = await user.getIdToken()

      // Save token and user info to localStorage
      localStorage.setItem('adminToken', token)
      localStorage.setItem('adminUsername', username.includes('@') ? user.email?.split('@')[0] || username : username)

      // Immediately redirect to home
      window.location.href = '/'
    } catch (err: any) {
      // Handle Firebase errors with user-friendly messages
      let errorMessage = 'Login failed'

      if (err.code === 'auth/user-not-found') {
        errorMessage = 'User not found. Please check your email.'
      } else if (err.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password. Please try again.'
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email format.'
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Please try again later.'
      } else if (err.code === 'auth/invalid-credential') {
        errorMessage = 'Invalid credentials. Please check your username and password.'
      } else if (err.message) {
        errorMessage = err.message
      }

      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-surface flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute top-20 right-20 w-96 h-96 rounded-full filter blur-3xl"
          style={{ backgroundColor: '#fa9233' }}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className="absolute bottom-20 left-20 w-96 h-96 rounded-full filter blur-3xl"
          style={{ backgroundColor: '#03a3ec' }}
        />
      </div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-surface via-background to-surface p-8 border-b border-border">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
              className="flex justify-center mb-4"
            >
              <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#fa9233' }}>
                <LogIn size={32} className="text-white" />
              </div>
            </motion.div>

            <h1 className="text-2xl font-bold text-center text-foreground mb-2">
              Admin Login
            </h1>
            <p className="text-center text-sm text-muted">
              Sign in to your admin dashboard
            </p>
          </div>

          {/* Form */}
          <div className="p-8 space-y-6">
            {/* Error Alert */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-gap-3 p-4 rounded-lg"
                style={{
                  backgroundColor: error.includes('successful') ? '#10b98166' : '#ef444466',
                }}
              >
                <AlertCircle
                  size={20}
                  style={{ color: error.includes('successful') ? '#10b981' : '#ef4444' }}
                />
                <span className="text-sm font-500" style={{ color: error.includes('successful') ? '#10b981' : '#ef4444' }}>
                  {error}
                </span>
              </motion.div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              {/* Username Input */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <label className="block text-sm font-600 text-foreground mb-2 uppercase tracking-wider">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="w-full px-4 py-3 border-2 border-border rounded-lg bg-background text-foreground placeholder-muted focus:outline-none focus:border-blue focus:ring-2 focus:ring-blue/20 transition-all"
                  required
                  disabled={loading}
                />
              </motion.div>

              {/* Password Input */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <label className="block text-sm font-600 text-foreground mb-2 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 border-2 border-border rounded-lg bg-background text-foreground placeholder-muted focus:outline-none focus:border-blue focus:ring-2 focus:ring-blue/20 transition-all pr-12"
                    required
                    minLength={6}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors cursor-pointer"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </motion.div>

              {/* Submit Button */}
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                whileHover={!loading ? { scale: 1.02 } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg font-600 text-white transition-all cursor-pointer hover:cursor-pointer"
                style={{ backgroundColor: '#fa9233', opacity: loading ? 0.7 : 1 }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    Logging in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </motion.button>

              
            </form>
          </div>
        </div>


      </motion.div>
    </div>
  )
}
