// app/Services/GeocodingService.ts
import axios from 'axios'
import Env from '@ioc:Adonis/Core/Env'

export class GeocodingService {
  static async geocode(address: string) {
    try {
      const key = Env.get('GEOCODING_API_KEY')
      
      // If no API key, return null (geocoding is optional)
      if (!key || key === 'ISI_DARI_OPENCAGE_ATAU_GOOGLE') {
        console.log('[GeocodingService] API key not configured, skipping geocoding')
        return null
      }

      const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=${key}`
      const res = await axios.get(url)
      
      const result = res.data.results[0]
      if (!result) {
        console.log('[GeocodingService] No results found for:', address)
        return null
      }

      console.log('[GeocodingService] Geocoded:', address, '→', result.geometry)
      return {
        lat: result.geometry.lat,
        lng: result.geometry.lng,
      }
    } catch (error) {
      console.error('[GeocodingService] ERROR:', error.message)
      // Don't throw, just return null - geocoding is optional
      return null
    }
  }
}
