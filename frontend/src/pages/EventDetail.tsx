import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Calendar, MapPin, Edit, Trash2, ArrowLeft, Cloud, Wind, Droplets, Thermometer, AlertTriangle, Map as MapIcon, Clock } from 'lucide-react'
import api from '../api'

interface WeatherInfo {
  temperature: number
  description: string
  humidity: number
  windSpeed: number
  feelsLike: number
  icon: string
}

interface Event {
  _id: string
  title: string
  description: string
  date: string
  time?: string
  location: string
  latitude?: number
  longitude?: number
  weatherInfo?: WeatherInfo
}

export default function EventDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [event, setEvent] = useState<Event | null>(null)
  const [weather, setWeather] = useState<WeatherInfo | null>(null)
  const [weatherLoading, setWeatherLoading] = useState(false)
  const [weatherError, setWeatherError] = useState('')
  const [error, setError] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const hasCoords = !!(event?.latitude && event?.longitude)

  const fetchEvent = async () => {
    try {
      const res = await api.get(`/events/${id}`)
      setEvent(res.data)
      if (res.data.weatherInfo) {
        setWeather(res.data.weatherInfo)
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal memuat acara')
    }
  }

  const fetchWeather = async () => {
    if (!event?.latitude || !event?.longitude) {
      setWeatherError('Event tidak memiliki koordinat. Cuaca tidak dapat ditampilkan.')
      return
    }
    
    setWeatherLoading(true)
    setWeatherError('')
    try {
      const res = await api.get(`/events/${id}/weather`)
      setWeather(res.data.weather)
    } catch (err: any) {
      setWeatherError(err.response?.data?.message || 'Gagal memuat data cuaca')
    } finally {
      setWeatherLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirmOpen) return
    setDeleting(true)
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      await api.delete(`/events/${id}`, {
        headers: { 'x-api-key': user.apiKey }
      })
      navigate('/events')
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal menghapus acara')
    } finally {
      setDeleting(false)
      setConfirmOpen(false)
    }
  }

  useEffect(() => {
    fetchEvent()
  }, [id])

  useEffect(() => {
    if (event?.latitude && event?.longitude && !weather && !weatherError) {
      fetchWeather()
    }
  }, [event])

  const formatDate = (dateStr: string) => {
    // Parse date string and add timezone offset to prevent date shift
    const date = new Date(dateStr)
    const userTimezoneOffset = date.getTimezoneOffset() * 60000
    const correctedDate = new Date(date.getTime() + userTimezoneOffset)
    return correctedDate.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (error) {
    return (
      <div className="mx-auto max-w-xl rounded-lg border border-red-200 bg-red-50 px-4 py-6 text-sm text-red-700">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <p className="font-semibold">Gagal memuat acara</p>
          </div>
          <p className="text-xs leading-relaxed">{error}</p>
          <div>
            <button
              onClick={() => navigate('/events')}
              className="inline-flex items-center gap-1 rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Kembali ke daftar</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="flex justify-center py-20">
        <span className="loading loading-spinner loading-lg text-slate-500"></span>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 animate-fade-in">
      {/* Header */}
      <div className="rounded-lg border border-slate-200 bg-white px-4 py-4 md:px-5 md:py-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600">
                <Calendar className="h-3.5 w-3.5" />
                <span>{formatDate(event.date)}</span>
              </div>
              {event.time && (
                <div className="inline-flex items-center gap-1 rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-[11px] font-medium text-indigo-600">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{event.time} WIB</span>
                </div>
              )}
            </div>
            <h1 className="text-xl font-semibold tracking-tight text-slate-900">{event.title}</h1>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <MapPin className="h-3.5 w-3.5" />
              <span>{event.location}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/events/${id}/edit`)}
              className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              <Edit className="h-3.5 w-3.5" />
              <span>Edit</span>
            </button>
            <button
              onClick={() => setConfirmOpen(true)}
              className="inline-flex items-center gap-1 rounded-md border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Hapus</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-5">
          {/* Description */}
          <div className="rounded-lg border border-slate-200 bg-white px-4 py-4 md:px-5 md:py-5">
            <h2 className="mb-3 text-sm font-semibold text-slate-900">Deskripsi acara</h2>
            {event.description ? (
              <p className="whitespace-pre-line text-xs leading-relaxed text-slate-600">{event.description}</p>
            ) : (
              <p className="text-xs italic text-slate-400">Tidak ada deskripsi.</p>
            )}
          </div>

          {/* Map */}
          <div className="rounded-lg border border-slate-200 bg-white px-4 py-4 md:px-5 md:py-5">
            <div className="mb-3 flex items-center gap-2">
              <MapIcon className="h-4 w-4 text-slate-500" />
              <h2 className="text-sm font-semibold text-slate-900">Lokasi & peta</h2>
            </div>

            {hasCoords ? (
              <div className="space-y-3">
                <div className="h-80 overflow-hidden rounded-md border border-slate-200 bg-slate-50">
                  <iframe
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    scrolling="no"
                    marginHeight={0}
                    marginWidth={0}
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${event.longitude! - 0.01},${event.latitude! - 0.01},${event.longitude! + 0.01},${event.latitude! + 0.01}&layer=mapnik&marker=${event.latitude},${event.longitude}`}
                    className="h-full w-full bg-white"
                  ></iframe>
                </div>
                <div className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2 text-[11px] text-slate-600">
                  <div className="flex gap-4 font-mono">
                    <span>Lat: {event.latitude}</span>
                    <span>Lon: {event.longitude}</span>
                  </div>
                  <a
                    href={`https://www.openstreetmap.org/?mlat=${event.latitude}&mlon=${event.longitude}#map=16/${event.latitude}/${event.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] font-medium text-slate-700 underline-offset-2 hover:underline"
                  >
                    Buka di OSM
                  </a>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between rounded-md border border-amber-100 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5" />
                  <div>
                    <p className="font-semibold">Koordinat belum diatur</p>
                    <p className="text-[11px] opacity-80">Lokasi peta tidak dapat ditampilkan.</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/events/${id}/edit`)}
                  className="inline-flex items-center rounded-md border border-amber-200 bg-white px-2 py-1 text-[11px] font-medium text-amber-800 hover:bg-amber-50"
                >
                  Atur lokasi
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Weather Widget */}
          <div className="rounded-lg border border-slate-200 bg-white px-4 py-4 md:px-5 md:py-5 text-xs">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cloud className="h-4 w-4 text-slate-500" />
                <h2 className="text-xs font-semibold text-slate-900">Prakiraan cuaca</h2>
              </div>
              {!weatherLoading && !weatherError && (
                <button
                  onClick={fetchWeather}
                  className="text-[11px] font-medium text-slate-500 hover:text-slate-800"
                >
                  Perbarui
                </button>
              )}
            </div>

            {weatherLoading ? (
              <div className="flex justify-center py-6">
                <span className="loading loading-spinner loading-sm text-slate-500"></span>
              </div>
            ) : weatherError ? (
              <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-[11px] text-red-700">
                <div className="flex items-start justify-between gap-2">
                  <span>{weatherError}</span>
                  <button
                    onClick={fetchWeather}
                    className="text-[11px] font-medium underline-offset-2 hover:underline"
                  >
                    Coba lagi
                  </button>
                </div>
              </div>
            ) : weather ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-semibold text-slate-900">{Math.round(weather.temperature)}°C</div>
                    <div className="mt-1 capitalize text-xs text-slate-600">{weather.description}</div>
                  </div>
                  <img
                    src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                    alt={weather.description}
                    className="h-12 w-12"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2 rounded-md bg-slate-50 px-2 py-2">
                    <Thermometer className="h-3.5 w-3.5 text-slate-500" />
                    <span>Feels: {Math.round(weather.feelsLike)}°C</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-md bg-slate-50 px-2 py-2">
                    <Droplets className="h-3.5 w-3.5 text-slate-500" />
                    <span>Humidity: {weather.humidity}%</span>
                  </div>
                  <div className="col-span-2 flex items-center gap-2 rounded-md bg-slate-50 px-2 py-2">
                    <Wind className="h-3.5 w-3.5 text-slate-500" />
                    <span>Wind: {weather.windSpeed} m/s</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-[11px] text-slate-500">Data cuaca belum tersedia.</p>
            )}
          </div>

          {/* Quick Actions */}
          <div className="rounded-lg border border-slate-200 bg-white px-4 py-4 md:px-5 md:py-5">
            <h3 className="mb-2 text-xs font-semibold text-slate-900">Navigasi</h3>
            <button
              onClick={() => navigate('/events')}
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Kembali ke daftar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {confirmOpen && (
        <dialog className="modal modal-open">
          <div className="modal-box max-w-sm">
            <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-red-700">
              <AlertTriangle className="h-4 w-4" />
              Hapus acara?
            </h3>
            <p className="mb-4 text-xs text-slate-600">
              Apakah Anda yakin ingin menghapus
              {' '}
              <span className="font-semibold">"{event.title}"</span>?
              {' '}
              Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex justify-end gap-2 text-xs">
              <button
                className="inline-flex items-center rounded-md border border-slate-200 bg-white px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-50"
                onClick={() => setConfirmOpen(false)}
                disabled={deleting}
              >
                Batal
              </button>
              <button
                className="inline-flex items-center rounded-md border border-red-200 bg-red-50 px-3 py-1.5 font-medium text-red-700 hover:bg-red-100"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? (
                  <span className="loading loading-spinner loading-xs"></span>
                ) : (
                  'Hapus'
                )}
              </button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setConfirmOpen(false)}>close</button>
          </form>
        </dialog>
      )}
    </div>
  )
}
