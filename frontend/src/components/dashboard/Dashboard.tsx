'use client'

import { useAuth } from '@/providers/AuthProvider'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Dashboard() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const [currentTime, setCurrentTime] = useState(new Date())

  // Mock prayer times (سنربطها بـ API لاحقاً)
  const prayerTimes = {
    fajr: '05:30',
    dhuhr: '12:15',
    asr: '15:45', 
    maghrib: '18:20',
    isha: '19:45'
  }

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleSignOut = async () => {
    await signOut()
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>جاري التحميل...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-gray-900">
                🕌 Alexa Azan
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                مرحباً، {user.user_metadata?.full_name || user.email}
              </span>
              <button
                onClick={handleSignOut}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm"
              >
                تسجيل الخروج
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          
          {/* Current Time Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg mb-6">
            <div className="p-6 text-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                الوقت الحالي
              </h2>
              <div className="text-4xl font-bold text-indigo-600">
                {currentTime.toLocaleTimeString('ar-SA')}
              </div>
              <div className="text-gray-500 mt-2">
                {currentTime.toLocaleDateString('ar-SA', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>
          </div>

          {/* Prayer Times Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
            {Object.entries(prayerTimes).map(([prayer, time]) => {
              const prayerNames = {
                fajr: 'الفجر',
                dhuhr: 'الظهر',
                asr: 'العصر',
                maghrib: 'المغرب',
                isha: 'العشاء'
              }
              
              return (
                <div key={prayer} className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-6 text-center">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {prayerNames[prayer as keyof typeof prayerNames]}
                    </h3>
                    <div className="text-2xl font-bold text-indigo-600">
                      {time}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Alexa Devices Section */}
          <div className="bg-white overflow-hidden shadow rounded-lg mb-6">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                أجهزة أليكسا المرتبطة
              </h2>
              <div className="text-gray-500 text-center py-8">
                لم يتم ربط أي أجهزة بعد
                <br />
                <span className="text-sm">سيتم إضافة هذه الميزة قريباً</span>
              </div>
            </div>
          </div>

          {/* Settings Section */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                الإعدادات السريعة
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">الموقع</h3>
                  <p className="text-gray-500 text-sm">الرياض، السعودية</p>
                  <button className="mt-2 text-indigo-600 hover:text-indigo-900 text-sm">
                    تغيير الموقع
                  </button>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">طريقة الحساب</h3>
                  <p className="text-gray-500 text-sm">رابطة العالم الإسلامي</p>
                  <button className="mt-2 text-indigo-600 hover:text-indigo-900 text-sm">
                    تغيير الطريقة
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
