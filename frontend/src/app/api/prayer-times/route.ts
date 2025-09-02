import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // استخدام مكة المكرمة كافتراضي
    const lat = 21.3891
    const lng = 39.8579
    const method = 2 // Muslim World League
    
    // استدعاء API أوقات الصلاة
    const apiUrl = `http://api.aladhan.com/v1/timings/${new Date().getTime()/1000}?latitude=${lat}&longitude=${lng}&method=${method}`
    
    const response = await fetch(apiUrl)
    const data = await response.json()
    
    if (data.code === 200) {
      const timings = data.data.timings
      
      // تنسيق الأوقات لـ Alexa
      const prayerTimes = {
        fajr: formatTime(timings.Fajr),
        dhuhr: formatTime(timings.Dhuhr), 
        asr: formatTime(timings.Asr),
        maghrib: formatTime(timings.Maghrib),
        isha: formatTime(timings.Isha),
        date: data.data.date.readable
      }
      
      return NextResponse.json(prayerTimes)
    } else {
      throw new Error('API call failed')
    }
    
  } catch (error) {
    // إرجاع أوقات افتراضية في حالة الخطأ
    return NextResponse.json({
      fajr: '5:30 AM',
      dhuhr: '12:15 PM', 
      asr: '3:45 PM',
      maghrib: '6:20 PM',
      isha: '7:45 PM',
      date: 'Today'
    })
  }
}

function formatTime(time24: string): string {
  const [hours, minutes] = time24.split(':')
  const hour = parseInt(hours)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const hour12 = hour % 12 || 12
  return `${hour12}:${minutes} ${ampm}`
}