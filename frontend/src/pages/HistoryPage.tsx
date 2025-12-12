import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, RefreshCw, Calendar, MapPin, Trash2, AlertTriangle, CheckCircle, Clock, ArrowLeft } from 'lucide-react'
import api from '../api'

interface Event {
  _id: string
  title: string
  description: string
  date: string
  time?: string
  location: string
  latitude?: number
  longitude?: number
}

export default function HistoryPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<'date-asc' | 'date-desc'>('date-desc')
  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; id?: string; title?: string }>({ open: false })
  const navigate = useNavigate()

  // Helper to get correct date without timezone shift
  const parseEventDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const userTimezoneOffset = date.getTimezoneOffset() * 60000
    return new Date(date.getTime() + userTimezoneOffset)
  }

  const fetchEvents = async () => {
    try {
      const res = await api.get('/events')
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      // Filter only completed events (date has passed)
      const completedEvents = res.data.filter((e: Event) => {
        const eventDate = parseEventDate(e.date)
        eventDate.setHours(0, 0, 0, 0)
        return eventDate.getTime() < today.getTime()
      })
      setEvents(completedEvents)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal memuat riwayat acara')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  const formatDate = (dateStr: string) => {
    return parseEventDate(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const getDaysAgo = (dateStr: string) => {
    const eventDate = parseEventDate(dateStr)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const diffTime = today.getTime() - eventDate.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    if (diffDays === 1) return '1 hari yang lalu'
    return `${diffDays} hari yang lalu`
  }

  const filteredEvents = events
    .filter(e => 
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.location.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'date-asc') return new Date(a.date).getTime() - new Date(b.date).getTime()
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/events/${id}`)
      setEvents(events.filter(e => e._id !== id))
      setError('')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal menghapus acara')
    }
  }

  const handleConfirmDelete = async () => {
    if (!confirmDelete.id) return;
    await handleDelete(confirmDelete.id);
    setConfirmDelete({ open: false });
  };

  const handleCancelDelete = () => setConfirmDelete({ open: false });

  return (
    <div className="py-6">
      <div className="mx-auto max-w-4xl space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/events')}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white border border-slate-200 text-slate-500 shadow-sm transition hover:bg-slate-50 hover:text-slate-700"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Riwayat Acara</h1>
          <p className="text-sm text-slate-500">{events.length} acara telah selesai</p>
        </div>
        <button
          onClick={fetchEvents}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white border border-slate-200 text-slate-500 shadow-sm transition hover:bg-slate-50 hover:text-slate-700"
          title="Refresh"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          <Search className="h-5 w-5 text-slate-400" />
        </div>
        <input
          type="text"
          placeholder="Cari riwayat acara..."
          className="h-12 w-full rounded-full border border-slate-200 bg-white pl-12 pr-4 text-sm text-slate-700 placeholder:text-slate-400 shadow-sm transition focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600"></div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium text-red-800">Terjadi Kesalahan</p>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredEvents.length === 0 && (
        <div className="rounded-2xl bg-white px-6 py-16 text-center shadow-sm border border-slate-200">
          <div className="mx-auto flex max-w-sm flex-col items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <Clock className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Belum ada riwayat</h3>
              <p className="mt-2 text-sm text-slate-500">
                {search
                  ? `Tidak ada hasil untuk "${search}"`
                  : 'Acara yang sudah selesai akan muncul di sini.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Timeline List */}
      {filteredEvents.length > 0 && (
        <div className="space-y-3">
          {filteredEvents.map((event) => (
            <div
              key={event._id}
              className="group relative flex gap-4 rounded-2xl bg-white p-4 shadow-sm border border-slate-200 transition hover:shadow-md hover:border-slate-300"
            >
              {/* Timeline indicator */}
              <div className="flex flex-col items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <CheckCircle className="h-6 w-6" />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h3
                      className="font-semibold text-slate-900 truncate cursor-pointer transition group-hover:text-indigo-600"
                      onClick={() => navigate(`/events/${event._id}`)}
                    >
                      {event.title}
                    </h3>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDate(event.date)}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        <span className="truncate max-w-[200px]">{event.location}</span>
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-slate-500 line-clamp-1">{event.description}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="hidden sm:inline-flex text-xs text-slate-400">
                      {getDaysAgo(event.date)}
                    </span>
                    <button
                      onClick={() => navigate(`/events/${event._id}`)}
                      className="inline-flex h-8 items-center gap-1 rounded-lg bg-slate-100 px-3 text-xs font-medium text-slate-600 transition hover:bg-indigo-100 hover:text-indigo-700"
                    >
                      Detail
                    </button>
                    <button
                      onClick={() => setConfirmDelete({ open: true, id: event._id, title: event.title })}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                      title="Hapus"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Modal */}
      {confirmDelete.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Hapus Riwayat?</h3>
                <p className="text-sm text-slate-500">Tindakan ini tidak dapat dibatalkan</p>
              </div>
            </div>
            <p className="mb-6 text-sm text-slate-600">
              Apakah Anda yakin ingin menghapus <span className="font-semibold text-slate-900">"{confirmDelete.title}"</span> dari riwayat?
            </p>
            <div className="flex gap-3">
              <button 
                className="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50" 
                onClick={handleCancelDelete}
              >
                Batal
              </button>
              <button 
                className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700" 
                onClick={handleConfirmDelete}
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}