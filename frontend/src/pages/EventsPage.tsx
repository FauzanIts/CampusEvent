import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Plus, RefreshCw, Calendar, MapPin, Trash2, Edit, AlertTriangle, CheckCircle, Clock } from 'lucide-react'
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

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<'date-asc' | 'date-desc'>('date-asc')
  const [coordFilter, setCoordFilter] = useState<'all' | 'with' | 'without'>('all')
  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; id?: string; title?: string }>({ open: false })
  const navigate = useNavigate()

  const fetchEvents = async () => {
    try {
      const res = await api.get('/events')
      setEvents(res.data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal memuat daftar acara')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  const formatDate = (dateStr: string) => {
    // Parse date string and add timezone offset to prevent date shift
    const date = new Date(dateStr)
    const userTimezoneOffset = date.getTimezoneOffset() * 60000
    const correctedDate = new Date(date.getTime() + userTimezoneOffset)
    return correctedDate.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  // Helper to get correct date without timezone shift
  const parseEventDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const userTimezoneOffset = date.getTimezoneOffset() * 60000
    return new Date(date.getTime() + userTimezoneOffset)
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const fiveDaysLater = new Date(today)
  fiveDaysLater.setDate(fiveDaysLater.getDate() + 5)

  // Filter only upcoming events (date is today or in the future)
  const upcomingEvents = events.filter(e => {
    const eventDate = parseEventDate(e.date)
    eventDate.setHours(0, 0, 0, 0)
    return eventDate.getTime() >= today.getTime()
  })

  const filteredEvents = upcomingEvents
    .filter(e => 
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.location.toLowerCase().includes(search.toLowerCase())
    )
    .filter(e => {
      if (coordFilter === 'with') return !!(e.latitude && e.longitude)
      if (coordFilter === 'without') return !(e.latitude && e.longitude)
      return true
    })
    .sort((a, b) => {
      if (sortBy === 'date-desc') return parseEventDate(b.date).getTime() - parseEventDate(a.date).getTime()
      return parseEventDate(a.date).getTime() - parseEventDate(b.date).getTime()
    })

  const completed = events.filter(e => {
    const eventDate = parseEventDate(e.date)
    eventDate.setHours(0, 0, 0, 0)
    return eventDate.getTime() < today.getTime()
  }).length
  const upcoming = events.filter(e => {
    const eventDate = parseEventDate(e.date)
    eventDate.setHours(0, 0, 0, 0)
    return eventDate.getTime() >= today.getTime()
  }).length
  const comingSoon = events.filter(e => {
    const eventDate = parseEventDate(e.date)
    eventDate.setHours(0, 0, 0, 0)
    return eventDate.getTime() >= today.getTime() && eventDate.getTime() <= fiveDaysLater.getTime()
  }).length

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
      <div className="mx-auto max-w-6xl space-y-8 rounded-xl border border-slate-200 bg-white px-5 py-6 shadow-sm animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard Acara</h1>
          <p className="mt-1 text-sm text-slate-500">Ringkasan kegiatan kampus yang Anda kelola.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchEvents}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => navigate('/events/new')}
            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" />
            <span>Event Baru</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      {!loading && (completed > 0 || upcoming > 0) && (
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Total Acara</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{upcoming}</p>
              <p className="mt-1 text-xs text-slate-400">Acara aktif</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
              <Calendar className="h-5 w-5" />
            </div>
          </div>

          <button
            onClick={() => navigate('/history')}
            className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm text-left transition hover:border-emerald-300 hover:shadow-md"
          >
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Acara Selesai</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{completed}</p>
              <p className="mt-1 text-xs text-emerald-600">Lihat riwayat →</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle className="h-5 w-5" />
            </div>
          </button>

          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Akan Datang</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{comingSoon}</p>
              <p className="mt-1 text-xs text-amber-600">Dalam 5 hari ke depan</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-600">
              <Calendar className="h-5 w-5" />
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Cari judul atau lokasi..."
              className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 transition focus:border-indigo-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <select
              className="h-10 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 transition focus:border-indigo-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date-asc' | 'date-desc')}
            >
              <option value="date-asc">Tanggal terdekat</option>
              <option value="date-desc">Tanggal terjauh</option>
            </select>
            <select
              className="h-10 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 transition focus:border-indigo-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
              value={coordFilter}
              onChange={(e) => setCoordFilter(e.target.value as 'all' | 'with' | 'without')}
            >
              <option value="all">Semua lokasi</option>
              <option value="with">Ada koordinat</option>
              <option value="without">Tanpa koordinat</option>
            </select>
          </div>
        </div>
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
        <div className="rounded-xl border-2 border-dashed border-slate-200 bg-white px-6 py-16 text-center">
          <div className="mx-auto flex max-w-md flex-col items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <Search className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Belum ada acara</h3>
              <p className="mt-1 text-sm text-slate-500">
                {search
                  ? `Tidak ada hasil untuk "${search}". Coba ubah kata kunci pencarian.`
                  : 'Mulai dengan menambahkan satu acara kampus yang ingin dipantau.'}
              </p>
            </div>
            {!search && (
              <button
                onClick={() => navigate('/events/new')}
                className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700"
              >
                <Plus className="h-4 w-4" />
                <span>Buat Acara Pertama</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filteredEvents.map((event) => {
          const eventDate = parseEventDate(event.date)
          eventDate.setHours(0, 0, 0, 0)
          const isComingSoon = eventDate.getTime() >= today.getTime() && eventDate.getTime() <= fiveDaysLater.getTime()
          const daysUntil = Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
          
          const getDaysLabel = () => {
            if (daysUntil === 0) return 'Hari ini!'
            if (daysUntil === 1) return 'Besok!'
            return `${daysUntil} hari lagi!`
          }
          
          return (
          <div
            key={event._id}
            className={`group flex flex-col overflow-hidden rounded-xl border shadow-sm transition hover:shadow-md ${
              isComingSoon 
                ? 'border-amber-300 bg-amber-50/50' 
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            {/* Coming Soon Banner */}
            {isComingSoon && (
              <div className="flex items-center justify-center gap-1.5 bg-amber-400 px-3 py-1.5 text-xs font-semibold text-white">
                <Clock className="h-3.5 w-3.5" />
                {getDaysLabel()}
              </div>
            )}
            <div className="flex flex-1 flex-col p-5">
              <div className="mb-3 flex items-start justify-between">
                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => navigate(`/events/${event._id}`)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition ${
                      isComingSoon 
                        ? 'bg-amber-200 text-amber-800 hover:bg-amber-300' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDate(event.date)}
                  </button>
                  {event.time && (
                    <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                      <Clock className="h-3 w-3" />
                      {event.time} WIB
                    </span>
                  )}
                </div>
                {event.latitude ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
                    <MapPin className="h-3 w-3" /> GPS
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700">
                    <AlertTriangle className="h-3 w-3" /> Manual
                  </span>
                )}
              </div>
              
              <h2
                className="mb-2 cursor-pointer text-base font-semibold text-slate-900 line-clamp-1 transition group-hover:text-indigo-600"
                onClick={() => navigate(`/events/${event._id}`)}
              >
                {event.title}
              </h2>
              
              <div className="mb-3 flex items-center gap-1.5 text-sm text-slate-500">
                <MapPin className="h-4 w-4 shrink-0" />
                <span className="truncate">{event.location}</span>
              </div>
              
              <p className="mb-4 flex-1 text-sm leading-relaxed text-slate-500 line-clamp-2">
                {event.description}
              </p>
              
              <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
                <button
                  onClick={() => navigate(`/events/${event._id}`)}
                  className="text-sm font-medium text-indigo-600 transition hover:text-indigo-700"
                >
                  Lihat Detail →
                </button>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => navigate(`/events/${event._id}/edit`)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
                    title="Edit"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setConfirmDelete({ open: true, id: event._id, title: event.title })}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                    title="Hapus"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          )
        })}
      </div>

      {/* Delete Modal */}
      {confirmDelete.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Hapus Acara?</h3>
                <p className="text-sm text-slate-500">Tindakan ini tidak dapat dibatalkan</p>
              </div>
            </div>
            <p className="mb-6 text-sm text-slate-600">
              Apakah Anda yakin ingin menghapus <span className="font-semibold text-slate-900">"{confirmDelete.title}"</span>?
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
