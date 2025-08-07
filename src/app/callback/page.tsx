'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import getAuth0 from '@/utils/auth0.utils'

export default function Callback() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const auth0 = await getAuth0()
        if (auth0) {
          await auth0.handleRedirectCallback()
          router.push('/')
        }
      } catch (err) {
        console.error('Error handling callback:', err)
        setError('เกิดข้อผิดพลาดในการเข้าสู่ระบบ')
      } finally {
        setLoading(false)
      }
    }

    handleCallback()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังดำเนินการเข้าสู่ระบบ...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">❌</div>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            กลับหน้าหลัก
          </button>
        </div>
      </div>
    )
  }

  return null
}
