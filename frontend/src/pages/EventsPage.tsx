import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api'

interface Event {
  _id: string
  title: string
  date: string
  location: string
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const fetchEvents = async () => {
    try {
      const res = await api.get('/events')
      setEvents(res.data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load events')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Events</h1>
        <button
          className="bg-green-600 text-white px-3 py-2 rounded"
          onClick={() => navigate('/events/new')}
        >
          + New Event
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500 mb-2">{error}</p>}

      <div className="bg-white shadow rounded overflow-hidden">
        <table className="w-full border">
          <thead className="bg-slate-200">
            <tr>
              <th className="border px-2 py-1">Title</th>
              <th className="border px-2 py-1">Date</th>
              <th className="border px-2 py-1">Location</th>
              <th className="border px-2 py-1">Action</th>
            </tr>
          </thead>
          <tbody>
            {events.map((e) => (
              <tr key={e._id}>
                <td className="border px-2 py-1">{e.title}</td>
                <td className="border px-2 py-1">
                  {new Date(e.date).toLocaleDateString()}
                </td>
                <td className="border px-2 py-1">{e.location}</td>
                <td className="border px-2 py-1 space-x-2">
                  <Link
                    className="text-blue-600"
                    to={`/events/${e._id}`}
                  >
                    Detail
                  </Link>
                  {/* Delete nanti bisa ditambah (butuh x-api-key di header) */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
