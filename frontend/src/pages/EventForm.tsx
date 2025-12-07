// src/pages/EventForm.tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'

export default function EventForm() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [location, setLocation] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validate fields
    if (!title.trim() || !description.trim() || !date || !location.trim()) {
      setError('All fields are required')
      return
    }

    setLoading(true)

    try {
      const response = await api.post('/events', {
        title: title.trim(),
        description: description.trim(),
        date,
        location: location.trim(),
      })

      console.log('Event created successfully:', response.data)
      navigate('/events')
    } catch (err: any) {
      console.error('CREATE EVENT ERROR:', err)
      console.error('Error response:', err.response?.data)
      
      const errorMessage = err.response?.data?.message ||
                          err.message ||
                          'Failed to create event'
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto bg-white shadow p-6 mt-12 rounded">
      <h1 className="text-xl font-bold mb-4">New Event</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-1">Title *</label>
          <input
            className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-slate-500"
            placeholder="Event title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description *</label>
          <textarea
            className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-slate-500"
            placeholder="Event description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Date *</label>
          <input
            type="date"
            className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-slate-500"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Location *</label>
          <input
            className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-slate-500"
            placeholder="Event location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="flex-1 bg-slate-800 text-white px-4 py-2 rounded hover:bg-slate-700 disabled:bg-slate-400 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Event'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/events')}
            className="px-4 py-2 border border-slate-300 rounded hover:bg-slate-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
