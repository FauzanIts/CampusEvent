import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.post('/auth/register', { name, email, password })
      navigate('/login')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Register failed')
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white shadow p-6 mt-8 rounded">
      <h1 className="text-xl font-bold mb-4">Register</h1>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          className="border p-2 w-full"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="border p-2 w-full"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="border p-2 w-full"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="bg-slate-800 text-white px-4 py-2 rounded w-full">
          Register
        </button>
      </form>
    </div>
  )
}
