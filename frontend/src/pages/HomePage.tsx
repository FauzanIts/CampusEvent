import { Link } from 'react-router-dom'
import { Calendar, MapPin, Cloud, Clock, ArrowRight, GraduationCap, Sparkles, Users, Zap, Heart, Code2 } from 'lucide-react'

const isLoggedIn = () => !!localStorage.getItem('token')

export default function HomePage() {
  const loggedIn = isLoggedIn()

  return (
    <div className="animate-fade-in space-y-16 pb-12">
      {/* Hero Section - Creative Design */}
      <section className="relative">
        {/* Background decorations */}
        <div className="absolute -top-6 left-0 h-72 w-72 rounded-full bg-indigo-200 opacity-30 blur-3xl"></div>
        <div className="absolute -top-6 right-0 h-72 w-72 rounded-full bg-purple-200 opacity-30 blur-3xl"></div>
        <div className="absolute bottom-0 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-amber-200 opacity-20 blur-3xl"></div>

        <div className="relative rounded-3xl border border-slate-200/60 bg-white/80 px-6 py-12 backdrop-blur-xl md:px-12 md:py-20">
          <div className="mx-auto max-w-4xl text-center">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700">
              <Sparkles className="h-4 w-4" />
              <span>Solusi Cerdas untuk Kampus Modern</span>
            </div>

            {/* Main Title */}
            <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
              Semua Acara Kampus
              <span className="relative">
                <span className="relative z-10 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent"> dalam Genggaman</span>
                <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 200 8" fill="none">
                  <path d="M1 5.5C47.6667 2.16667 141.4 -2.1 199 5.5" stroke="url(#gradient)" strokeWidth="3" strokeLinecap="round"/>
                  <defs>
                    <linearGradient id="gradient" x1="1" y1="5" x2="199" y2="5">
                      <stop stopColor="#4f46e5"/>
                      <stop offset="0.5" stopColor="#9333ea"/>
                      <stop offset="1" stopColor="#4f46e5"/>
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </h1>

            {/* Description */}
            <p className="mx-auto mb-10 max-w-2xl text-lg text-slate-600 md:text-xl">
              <span className="font-semibold text-slate-700">CampusEvent</span> adalah platform terintegrasi yang membantu mahasiswa dan organisasi kampus merencanakan acara dengan dukungan peta lokasi dan prakiraan cuaca real-time.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              {loggedIn ? (
                <Link
                  to="/events"
                  className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:shadow-xl hover:shadow-indigo-500/40"
                >
                  Buka Dashboard
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:shadow-xl hover:shadow-indigo-500/40"
                  >
                    Mulai Gratis
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 rounded-2xl border-2 border-slate-200 bg-white px-8 py-4 text-base font-semibold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50"
                  >
                    Sudah punya akun?
                  </Link>
                </>
              )}
            </div>

            {/* Trust badges */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <Zap className="h-4 w-4" />
                </div>
                <span>Setup Instan</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-100 text-sky-600">
                  <Cloud className="h-4 w-4" />
                </div>
                <span>Cuaca Real-time</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                  <MapPin className="h-4 w-4" />
                </div>
                <span>Peta Interaktif</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid - Bento Style */}
      <section>
        <div className="mb-8 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
            FITUR UNGGULAN
          </span>
          <h2 className="mt-4 text-3xl font-bold text-slate-900">Semua yang Kamu Butuhkan</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Feature 1 - Large */}
          <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-indigo-50 to-white p-8 transition hover:shadow-lg md:col-span-2 lg:col-span-1 lg:row-span-2">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-indigo-200 opacity-50 blur-2xl transition group-hover:bg-indigo-300"></div>
            <div className="relative">
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/30">
                <Calendar className="h-7 w-7" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-slate-900">Manajemen Acara</h3>
              <p className="text-slate-600">
                Buat, kelola, dan pantau semua acara kampus dalam satu dashboard yang intuitif. Lengkap dengan pengingat otomatis untuk acara yang akan datang.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700">CRUD Event</span>
                <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700">Pengingat</span>
                <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700">Riwayat</span>
              </div>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-emerald-50 to-white p-6 transition hover:shadow-lg">
            <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-emerald-200 opacity-50 blur-xl transition group-hover:bg-emerald-300"></div>
            <div className="relative">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-lg shadow-emerald-500/30">
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-slate-900">Geocoding Otomatis</h3>
              <p className="text-sm text-slate-600">
                Masukkan nama lokasi, koordinat GPS terdeteksi otomatis dan tampil di peta.
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-sky-50 to-white p-6 transition hover:shadow-lg">
            <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-sky-200 opacity-50 blur-xl transition group-hover:bg-sky-300"></div>
            <div className="relative">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-sky-600 text-white shadow-lg shadow-sky-500/30">
                <Cloud className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-slate-900">Prakiraan Cuaca</h3>
              <p className="text-sm text-slate-600">
                Data cuaca real-time dari OpenWeather untuk persiapan acara lebih matang.
              </p>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-amber-50 to-white p-6 transition hover:shadow-lg">
            <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-amber-200 opacity-50 blur-xl transition group-hover:bg-amber-300"></div>
            <div className="relative">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500 text-white shadow-lg shadow-amber-500/30">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-slate-900">Notifikasi Visual</h3>
              <p className="text-sm text-slate-600">
                Acara dalam 5 hari ditandai khusus dengan countdown yang jelas.
              </p>
            </div>
          </div>

          {/* Feature 5 */}
          <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-purple-50 to-white p-6 transition hover:shadow-lg">
            <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-purple-200 opacity-50 blur-xl transition group-hover:bg-purple-300"></div>
            <div className="relative">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-purple-600 text-white shadow-lg shadow-purple-500/30">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-slate-900">Multi User</h3>
              <p className="text-sm text-slate-600">
                Sistem autentikasi aman dengan JWT token dan API key per pengguna.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="rounded-3xl bg-slate-900 px-6 py-12 text-white md:px-12 md:py-16">
        <div className="mb-10 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium">
            CARA KERJA
          </span>
          <h2 className="mt-4 text-3xl font-bold">Semudah 1, 2, 3</h2>
        </div>

        <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-2xl font-bold shadow-lg">
              1
            </div>
            <h3 className="mb-2 font-semibold">Daftar Akun</h3>
            <p className="text-sm text-slate-400">Buat akun gratis dalam hitungan detik</p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 text-2xl font-bold shadow-lg">
              2
            </div>
            <h3 className="mb-2 font-semibold">Tambah Acara</h3>
            <p className="text-sm text-slate-400">Isi detail acara, lokasi otomatis terdeteksi</p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-amber-500 text-2xl font-bold shadow-lg">
              3
            </div>
            <h3 className="mb-2 font-semibold">Pantau & Kelola</h3>
            <p className="text-sm text-slate-400">Lihat peta, cuaca, dan kelola dari dashboard</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden rounded-3xl border border-indigo-200 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 px-6 py-12 text-center md:px-12">
        <div className="absolute left-0 top-0 h-40 w-40 rounded-full bg-indigo-300 opacity-30 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 h-40 w-40 rounded-full bg-purple-300 opacity-30 blur-3xl"></div>
        
        <div className="relative">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg">
            <GraduationCap className="h-8 w-8" />
          </div>
          <h2 className="mb-4 text-2xl font-bold text-slate-900 md:text-3xl">
            Siap Mengelola Acara Kampus?
          </h2>
          <p className="mb-8 text-slate-600">
            Bergabung dengan platform yang memudahkan semua kegiatan kampusmu.
          </p>
          {loggedIn ? (
            <Link
              to="/events"
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-4 font-semibold text-white shadow-lg transition hover:shadow-xl"
            >
              Buka Dashboard
              <ArrowRight className="h-5 w-5" />
            </Link>
          ) : (
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-4 font-semibold text-white shadow-lg transition hover:shadow-xl"
            >
              Daftar Sekarang — Gratis!
              <ArrowRight className="h-5 w-5" />
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 pt-8">
        <div className="flex flex-col items-center gap-6 text-center">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-md">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold text-slate-900">CampusEvent</span>
          </div>
          
          {/* Developer Credit */}
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-20 blur-xl"></div>
            <div className="relative flex items-center gap-3 rounded-2xl border border-indigo-200 bg-white px-6 py-4 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100">
                <Code2 className="h-5 w-5 text-indigo-600" />
              </div>
              <div className="text-left">
                <p className="text-xs font-medium text-slate-500">Dikembangkan dengan</p>
                <p className="flex items-center gap-1 text-sm font-semibold text-slate-800">
                  <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                  <span>oleh</span>
                  <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Kelompok 7</span>
                </p>
              </div>
            </div>
          </div>

          <p className="text-sm text-slate-500">
            © 2025 CampusEvent. Platform Manajemen Acara Kampus.
          </p>
        </div>
      </footer>
    </div>
  )
}
