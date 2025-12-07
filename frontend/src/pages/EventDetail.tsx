import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api'

interface Event {
  _id: string
  title: string
  description: string
  date: string
  location: string
  weatherInfo?: any
}

export default function EventDetail() {
  const { id } = useParams()
  const [event, setEvent] = useState<Event | null>(null)
  const [weather, setWeather] = useState<any>(null)
  const [error, setError] = useState('')

  const fetchEvent = async () => {
    try {
      const res = await api.get(`/events/${id}`)
      setEvent(res.data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load event')
    }
  }

  const fetchWeather = async () => {
    try {
      const res = await api.get(`/events/${id}/weather`)
      setWeather(res.data.weather)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load weather')
    }
  }

  useEffect(() => {
    fetchEvent()
  }, [id])

  return (
    <div className="max-w-xl mx-auto bg-white shadow p-6 mt-4 rounded">
      {error && <p className="text-red-500 mb-2">{error}</p>}
      {event ? (
        <>
          <h1 className="text-2xl font-bold mb-2">{event.title}</h1>
          <p className="text-gray-600 mb-1">
            {new Date(event.date).toLocaleString()}
          </p>
          <p className="mb-2">Location: {event.location}</p>
          <p className="mb-4">{event.description}</p>

          <button
            className="bg-blue-600 text-white px-3 py-2 rounded mb-3"
            onClick={fetchWeather}
          >
            Load Weather
          </button>

          {weather && (
            <div className="border rounded p-3">
              <p className="font-semibold mb-1">Weather Info:</p>
              <p>Temp: {weather.main?.temp} °C</p>
              <p>Condition: {weather.weather?.[0]?.description}</p>
            </div>
          )}
        </>
      ) : (
        !error && <p>Loading...</p>
      )}
    </div>
  )
}
