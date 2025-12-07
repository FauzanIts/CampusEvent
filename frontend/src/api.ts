// src/api.ts
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3333',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - add token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    
    console.log('[API Request]', {
      url: config.url,
      method: config.method,
      hasToken: !!token,
      tokenPreview: token ? token.substring(0, 20) + '...' : 'null'
    })
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Add API key if available (for delete operations)
    const userStr = localStorage.getItem('user')
    if (userStr && config.headers) {
      try {
        const user = JSON.parse(userStr)
        if (user.apiKey) {
          config.headers['x-api-key'] = user.apiKey
        }
      } catch (error) {
        console.error('Failed to parse user data:', error)
      }
    }

    return config
  },
  (error) => {
    console.error('[API Request Error]', error)
    return Promise.reject(error)
  }
)

// Response interceptor - handle 401 and auto-logout
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear storage and redirect to login
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      
      // Only redirect if not already on login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api
