// app/Services/WeatherService.ts
import axios from 'axios'
import Env from '@ioc:Adonis/Core/Env'

export interface WeatherData {
  temperature: number
  description: string
  humidity: number
  windSpeed: number
  feelsLike: number
  icon: string
}

export class WeatherService {
  static async getWeather(lat: number, lon: number): Promise<WeatherData | null> {
    const apiKey = Env.get('OPENWEATHER_API_KEY')
    
    if (!apiKey) {
      console.warn('[WeatherService] OPENWEATHER_API_KEY not configured')
      return null
    }

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
      const res = await axios.get(url, { timeout: 5000 })
      
      const data = res.data
      
      return {
        temperature: Math.round(data.main.temp),
        description: data.weather[0]?.description || 'Unknown',
        humidity: data.main.humidity,
        windSpeed: Math.round((data.wind.speed * 3.6) * 10) / 10, // Convert m/s to km/h
        feelsLike: Math.round(data.main.feels_like),
        icon: data.weather[0]?.icon || '01d'
      }
    } catch (error: any) {
      console.error('[WeatherService] Error fetching weather:', error.message)
      throw new Error('Failed to fetch weather data')
    }
  }
}
