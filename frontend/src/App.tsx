// src/App.tsx
import { Routes, Route, Navigate, Link } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import EventsPage from './pages/EventsPage'
import EventForm from './pages/EventForm'
import EventDetail from './pages/EventDetail'

const isLoggedIn = () => !!localStorage.getItem('token')

export default function App() {
  return (
    <div className="min-h-screen bg-slate-100">
      <nav className="flex justify-between items-center px-4 py-3 bg-slate-800 text-white">
        <Link to={isLoggedIn() ? '/events' : '/login'} className="font-bold">
          CampusEvent Dashboard
        </Link>
        <div className="space-x-3">
          {isLoggedIn() ? (
            <>
              <Link to="/events">Events</Link>
              <button
                onClick={() => {
                  localStorage.removeItem('token')
                  localStorage.removeItem('user')
                  window.location.href = '/login'
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </nav>

      <div className="p-4">
        <Routes>
          <Route
            path="/"
            element={isLoggedIn() ? <Navigate to="/events" /> : <Navigate to="/login" />}
          />
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
        </Routes>
      </div>
    </div>
  )
}
