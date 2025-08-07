'use client'

import { useAuth } from '@/contexts/AuthContext'
import LoginButton from '@/components/LoginButton'
import { useState, useEffect } from 'react'

export default function Home() {
  const { isLoading, isAuthenticated, user, getAccessToken } = useAuth()
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [tokenLoading, setTokenLoading] = useState(false)

  useEffect(() => {
    const fetchAccessToken = async () => {
      if (isAuthenticated && !isLoading) {
        setTokenLoading(true)
        try {
          const token = await getAccessToken()
          setAccessToken(token || null)
        } catch (error) {
          console.error('Error fetching access token:', error)
          setAccessToken(null)
        } finally {
          setTokenLoading(false)
        }
      }
    }

    fetchAccessToken()
  }, [isAuthenticated, isLoading, getAccessToken])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">RAI Auth</h1>
            </div>
            <LoginButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            ยินดีต้อนรับสู่ RAI Auth
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Next.js Application with Auth0 Authentication
          </p>

          {isLoading && (
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="animate-pulse flex space-x-4">
                <div className="rounded-full bg-gray-200 h-12 w-12"></div>
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          )}

          {!isLoading && !isAuthenticated && (
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="text-6xl mb-4">🔐</div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                เข้าสู่ระบบเพื่อเริ่มใช้งาน
              </h3>
              <p className="text-gray-600 mb-6">
                กรุณาเข้าสู่ระบบด้วย Auth0 เพื่อเข้าถึงเนื้อหาภายใน
              </p>
            </div>
          )}

          {!isLoading && isAuthenticated && user && (
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                เข้าสู่ระบบสำเร็จ!
              </h3>
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h4 className="text-lg font-medium text-gray-800 mb-4">Access Token:</h4>
                {tokenLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span className="text-gray-600">กำลังโหลด token...</span>
                  </div>
                ) : accessToken ? (
                  <div className="bg-white rounded border p-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-medium text-gray-700">Token:</span>
                      <button
                        onClick={() => navigator.clipboard.writeText(accessToken)}
                        className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
                      >
                        คัดลอก
                      </button>
                    </div>
                    <code className="text-xs text-gray-800 break-all font-mono bg-gray-100 p-2 rounded block">
                      {accessToken}
                    </code>
                  </div>
                ) : (
                  <p className="text-red-600">ไม่สามารถดึง access token ได้</p>
                )}
              </div>
              <p className="text-gray-600">
                คุณสามารถใช้ access token นี้เพื่อเรียก API ได้
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500">
            <p>&copy; 2024 RAI Auth. Powered by Next.js และ Auth0</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
