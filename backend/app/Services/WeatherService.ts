// app/Services/WeatherService.ts
import axios from 'axios'
import Env from '@ioc:Adonis/Core/Env'

export class WeatherService {
  static async getWeather(lat: number, lon: number) {
    const apiKey = Env.get('OPENWEATHER_API_KEY')
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`

    const res = await axios.get(url)
    return res.data
  }
}
