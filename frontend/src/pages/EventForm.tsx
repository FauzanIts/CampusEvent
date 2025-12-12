// src/pages/EventForm.tsx
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Pencil, Plus, Calendar, MapPin, FileText, Lightbulb, Save, X, AlertCircle, CheckCircle, Clock } from 'lucide-react'
import api from '../api'

export default function EventForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [location, setLocation] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (!isEdit) return

    const loadEvent = async () => {
      setPageLoading(true)
      setError('')
      try {
        const res = await api.get(`/events/${id}`)
        const event = res.data
        setTitle(event.title || '')
        setDescription(event.description || '')
        setDate(event.date ? event.date.substring(0, 10) : '')
        setTime(event.time || '')
        setLocation(event.location || '')
      } catch (err: any) {
        setError(err.response?.data?.message || 'Gagal memuat data acara')
      } finally {
        setPageLoading(false)
      }
    }

    loadEvent()
  }, [id, isEdit])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!title.trim() || !description.trim() || !date || !location.trim()) {
      setError('Semua kolom wajib diisi')
      return
    }

    setLoading(true)

    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        date,
        time: time || null,
        location: location.trim(),
      }

      if (isEdit) {
        await api.put(`/events/${id}`, payload)
        setSuccess('Perubahan berhasil disimpan')
        navigate(`/events/${id}`)
      } else {
        await api.post('/events', payload)
        setSuccess('Acara berhasil dibuat')
        navigate('/events')
      }
    } catch (err: any) {
      const fallback = isEdit ? 'Gagal menyimpan perubahan' : 'Gagal membuat acara'
      setError(err.response?.data?.message || fallback)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl animate-fade-in pb-10">
      {/* Header Section */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-medium text-slate-700">
          {isEdit ? <Pencil className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
          <span>{isEdit ? 'Edit acara' : 'Acara baru'}</span>
        </div>
        <div className="mt-3 space-y-1">
          <h1 className="text-xl font-semibold tracking-tight text-slate-900">
            {isEdit ? 'Perbarui detail acara' : 'Buat acara kampus'}
          </h1>
          <p className="max-w-xl text-xs text-slate-500">
            {isEdit
              ? 'Sesuaikan informasi acara agar peserta selalu mendapatkan informasi terbaru.'
              : 'Tambahkan acara kampus baru dan pastikan informasi dasarnya jelas.'}
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white px-4 py-5 md:px-6 md:py-6">
        {error && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
            <div className="flex items-start gap-2">
              <AlertCircle className="mt-0.5 h-3.5 w-3.5" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
            <div className="flex items-start gap-2">
              <CheckCircle className="mt-0.5 h-3.5 w-3.5" />
              <span>{success}</span>
            </div>
          </div>
        )}

        {pageLoading ? (
          <div className="flex flex-col items-center justify-center py-16 text-xs text-slate-500">
            <span className="loading loading-spinner loading-md mb-3 text-slate-500"></span>
            <p>Sedang memuat data acara...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-7 text-xs">
              {/* Main Info Section */}
              <div className="space-y-6">
                <h3 className="flex items-center gap-2 border-b border-slate-100 pb-2 text-xs font-semibold text-slate-900">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-900 text-white">
                    <FileText className="h-3.5 w-3.5" />
                  </div>
                  <span>Informasi utama</span>
                </h3>
                
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div className="col-span-1 md:col-span-2">
                    <div className="space-y-1">
                      <label className="block text-[11px] font-medium text-slate-700">
                        Judul acara <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: Seminar Teknologi AI 2024"
                        className="h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-xs text-slate-700 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-0"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-medium text-slate-700">
                      Tanggal pelaksanaan <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      </div>
                      <input
                        type="date"
                        className="h-9 w-full rounded-md border border-slate-200 bg-white pl-9 pr-3 text-xs text-slate-700 focus:border-slate-400 focus:outline-none focus:ring-0"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-medium text-slate-700">
                      Jam mulai
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Clock className="h-3.5 w-3.5 text-slate-400" />
                      </div>
                      <input
                        type="time"
                        className="h-9 w-full rounded-md border border-slate-200 bg-white pl-9 pr-3 text-xs text-slate-700 focus:border-slate-400 focus:outline-none focus:ring-0"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-medium text-slate-700">
                      Lokasi <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="Kota (mis. Jakarta, Bandung)"
                        className="h-9 w-full rounded-md border border-slate-200 bg-white pl-9 pr-3 text-xs text-slate-700 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-0"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Description Section */}
              <div className="space-y-6">
                <h3 className="flex items-center gap-2 border-b border-slate-100 pb-2 text-xs font-semibold text-slate-900">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-100 text-slate-700">
                    <FileText className="h-3.5 w-3.5" />
                  </div>
                  <span>Detail lengkap</span>
                </h3>

                <div className="space-y-1">
                  <label className="block text-[11px] font-medium text-slate-700">
                    Deskripsi acara <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    className="min-h-[110px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-0"
                    placeholder="Jelaskan detail acara, pembicara, rundown, dan informasi penting lainnya..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    disabled={loading}
                  ></textarea>
                </div>

                {/* Tip Box */}
                <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] text-slate-600">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="mt-0.5 h-3.5 w-3.5 text-slate-500" />
                    <div>
                      <h4 className="mb-0.5 font-semibold">Tips lokasi cerdas</h4>
                      <p className="opacity-80">
                        Masukkan nama kota yang valid (seperti "Jakarta", "Surabaya", "Yogyakarta") agar sistem dapat otomatis
                        menampilkan peta lokasi dan prakiraan cuaca untuk acara Anda.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 flex justify-end gap-2 border-t border-slate-100 pt-4 text-xs">
                <button
                  type="button"
                  onClick={() => navigate('/events')}
                  className="inline-flex items-center rounded-md border border-slate-200 bg-white px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-50"
                  disabled={loading}
                >
                  <X className="mr-1.5 h-3.5 w-3.5" />
                  <span>Batal</span>
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center rounded-md bg-slate-900 px-3 py-1.5 font-medium text-white hover:bg-slate-800"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="loading loading-spinner loading-xs text-white"></span>
                  ) : (
                    <>
                      <Save className="mr-1.5 h-3.5 w-3.5" />
                      <span>{isEdit ? 'Simpan perubahan' : 'Buat acara sekarang'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
      </div>
    </div>
  )
}
