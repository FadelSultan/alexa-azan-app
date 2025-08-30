import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { createClient } from '@supabase/supabase-js'

// Client-side Supabase client (الأساسي للمصادقة)
export const createClientSupabase = () =>
  createClientComponentClient()

// Simple client for basic operations
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

// Database Types
export interface User {
  id: string
  email: string
  full_name: string | null
  timezone: string
  location: any
  alexa_user_id: string | null
  created_at: string
  updated_at: string
}

export interface Device {
  id: string
  user_id: string
  device_id: string
  device_name: string
  device_type: string
  is_active: boolean
  created_at: string
}

export interface PrayerSettings {
  id: string
  user_id: string
  calculation_method: string
  madhab: string
  high_latitude: string
  prayer_adjustments: {
    fajr: number
    dhuhr: number
    asr: number
    maghrib: number
    isha: number
  }
  azan_enabled: {
    fajr: boolean
    dhuhr: boolean
    asr: boolean
    maghrib: boolean
    isha: boolean
  }
  created_at: string
}