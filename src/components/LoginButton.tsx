'use client'

import { useAuth } from '@/contexts/AuthContext'

export default function LoginButton() {
  const { isLoading, isAuthenticated, user, loginWithRedirect, logout } = useAuth()

  if (isLoading) {
    return (
      <div className="animate-pulse bg-gray-200 h-10 w-24 rounded"></div>
    )
  }

  if (isAuthenticated && user) {
    return (
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          {user.picture && (
            <img
              src={user.picture}
              alt={user.name || 'User'}
              className="w-8 h-8 rounded-full"
            />
          )}
          <span className="text-gray-700">สวัสดี, {user.name}</span>
        </div>
        <button
          onClick={logout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
        >
          ออกจากระบบ
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={loginWithRedirect}
      className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
    >
      เข้าสู่ระบบ
    </button>
  )
}
