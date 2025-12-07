// src/pages/Login.tsx
import { useState } from 'react'
import api from '../api'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Clear old tokens first
    localStorage.removeItem('token')
    localStorage.removeItem('user')

    try {
      console.log('[Login] Attempting login for:', email)
      const res = await api.post('/auth/login', { email, password })
      
      console.log('[Login] Login successful')
      console.log('[Login] Token:', res.data.token?.substring(0, 20) + '...')
      console.log('[Login] User:', res.data.user)
      
      // Store token and user data
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))

      console.log('[Login] Credentials stored, redirecting...')
      
      // Redirect to events page
      window.location.href = '/events'
    } catch (err: any) {
      console.error('LOGIN ERROR:', err)
      
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          'Login failed. Please try again.'
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white shadow p-6 mt-12 rounded">
      <h1 className="text-xl font-bold mb-4">Login</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-slate-500"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-slate-500"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-slate-800 text-white py-2 rounded hover:bg-slate-700 disabled:bg-slate-400 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      
      <p className="text-center mt-4 text-sm text-gray-600">
        Don't have an account?{' '}
        <a href="/register" className="text-blue-600 hover:underline">
          Register here
        </a>
      </p>
    </div>
  )
}
