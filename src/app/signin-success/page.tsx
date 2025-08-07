'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import getAuth0 from '@/utils/auth0.utils'

export default function SigninSuccess() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { refreshAuthStatus } = useAuth()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const auth0 = await getAuth0()
        if (auth0) {
          // ตรวจสอบว่ามี code หรือ state ใน URL หรือไม่
          const urlParams = new URLSearchParams(window.location.search)
          const hasCode = urlParams.has('code')
          const hasState = urlParams.has('state')
          
          if (hasCode || hasState) {
            // จัดการ callback จาก Auth0
            await auth0.handleRedirectCallback()
            
            // ลบ query parameters ออกจาก URL
            window.history.replaceState({}, document.title, '/signin-success')
          }
          
          // ตรวจสอบสถานะการเข้าสู่ระบบ
          const isAuthenticated = await auth0.isAuthenticated()
          
          if (isAuthenticated) {
            // Refresh auth status ใน context
            await refreshAuthStatus()
            
            window.location.href = '/'
            
          } else {
            setError('ไม่สามารถเข้าสู่ระบบได้')
          }
        }
      } catch (err) {
        console.error('Error handling signin:', err)
        setError('เกิดข้อผิดพลาดในการเข้าสู่ระบบ')
      } finally {
        setLoading(false)
      }
    }

    handleCallback()
  }, [router, refreshAuthStatus])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-6"></div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              กำลังดำเนินการเข้าสู่ระบบ
            </h2>
            <div className="space-y-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full animate-pulse w-3/4"></div>
              </div>
              <p className="text-gray-600 text-sm">
                กรุณารอสักครู่...
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // กรณีที่เข้าสู่ระบบสำเร็จ
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
        <div className="text-center">
          <div className="text-green-600 text-6xl mb-6">✅</div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            เข้าสู่ระบบสำเร็จ!
          </h2>
          <p className="text-gray-600 mb-6">
            กำลังนำคุณไปยังหน้าแรก...
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-green-600 h-2 rounded-full animate-pulse w-full"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
