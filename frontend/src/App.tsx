// src/App.tsx
import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom'
import { GraduationCap, LogOut, Clock, Home } from 'lucide-react'
import Login from './pages/Login'
import Register from './pages/Register'
import EventsPage from './pages/EventsPage'
import EventForm from './pages/EventForm'
import EventDetail from './pages/EventDetail'
import HistoryPage from './pages/HistoryPage'
import HomePage from './pages/HomePage'

const isLoggedIn = () => !!localStorage.getItem('token')

function Navbar() {
  const location = useLocation()
  const loggedIn = isLoggedIn()
  
  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/')

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white shadow-sm">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link
          to="/"
          className="flex items-center gap-2.5 font-semibold text-slate-900 transition hover:opacity-80"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <GraduationCap className="h-4.5 w-4.5" />
          </div>
          <span className="text-base tracking-tight">CampusEvent</span>
        </Link>

        {loggedIn ? (
          <nav className="flex items-center gap-1">
            <Link
              to="/"
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
                location.pathname === '/'
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Home className="h-4 w-4" />
              Home
            </Link>
            <Link
              to="/events"
              className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                isActive('/events') && !isActive('/history')
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/history"
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
                isActive('/history')
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Clock className="h-4 w-4" />
              Riwayat
            </Link>
            <button
              onClick={() => {
                localStorage.removeItem('token')
                localStorage.removeItem('user')
                window.location.href = '/login'
              }}
              className="ml-2 inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
            >
              <LogOut className="h-4 w-4" />
              Keluar
            </button>
          </nav>
        ) : (
          <nav className="flex items-center gap-2">
            <Link
              to="/"
              className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                location.pathname === '/'
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              Home
            </Link>
            <Link
              to="/login"
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
            >
              Masuk
            </Link>
            <Link
              to="/register"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
            >
              Daftar
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}

export default function App() {
  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-700 antialiased">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 animate-fade-in">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/events"
            element={isLoggedIn() ? <EventsPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/events/new"
            element={isLoggedIn() ? <EventForm /> : <Navigate to="/login" />}
          />
          <Route
            path="/events/:id"
            element={isLoggedIn() ? <EventDetail /> : <Navigate to="/login" />}
          />
          <Route
            path="/events/:id/edit"
            element={isLoggedIn() ? <EventForm /> : <Navigate to="/login" />}
          />
          <Route
            path="/history"
            element={isLoggedIn() ? <HistoryPage /> : <Navigate to="/login" />}
          />
        </Routes>
      </main>
    </div>
  )
}
