'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth'
import { resetAllData, getUsers } from '@/lib/data'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [debugMode, setDebugMode] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    console.log('[DEBUG] ログインフォーム送信:', { email, password })

    try {
      const success = await login(email, password)
      console.log('[DEBUG] ログイン結果:', success)
      if (success) {
        console.log('[DEBUG] ダッシュボードへリダイレクト')
        router.push('/dashboard')
      } else {
        setError('メールアドレスまたはパスワードが正しくありません。')
        if (debugMode) {
          const users = getUsers()
          console.log('[DEBUG] 現在のユーザー一覧:', users)
        }
      }
    } catch (err) {
      console.error('[DEBUG] ログインエラー:', err)
      setError('ログインに失敗しました。もう一度お試しください。')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetData = () => {
    if (confirm('全てのデータをリセットしますか？この操作は元に戻せません。')) {
      resetAllData()
      alert('データをリセットしました。ページを再読み込みしてください。')
      window.location.reload()
    }
  }

  const handleTestLogin = (testEmail: string, testPassword: string) => {
    setEmail(testEmail)
    setPassword(testPassword)
  }

  const handleDebugInfo = () => {
    const users = getUsers()
    console.log('=== システムデバッグ情報 ===')
    console.log('localStorage内容:', {
      users: localStorage.getItem('beauty-salon-users'),
      auth_user: localStorage.getItem('auth_user')
    })
    console.log('登録済みユーザー:', users)
    alert(`登録済みユーザー数: ${users.length}\n詳細はコンソールを確認してください。`)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex justify-center">
          <h1 className="text-3xl font-bold text-blue-600">美容室シフト管理</h1>
        </Link>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          ログイン
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          アカウントをお持ちでない方は{' '}
          <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
            無料トライアルを開始
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <h3 className="text-sm font-medium text-blue-800 mb-3">📋 テストアカウント情報</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-blue-700">管理者:</span>
                <button
                  onClick={() => handleTestLogin('admin@salon.com', 'admin123')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs"
                >
                  admin@salon.com
                </button>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-700">従業員:</span>
                <button
                  onClick={() => handleTestLogin('employee@salon.com', 'employee123')}
                  className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs"
                >
                  employee@salon.com
                </button>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-700">お客様:</span>
                <button
                  onClick={() => handleTestLogin('customer@example.com', 'customer123')}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 rounded text-xs"
                >
                  customer@example.com
                </button>
              </div>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                メールアドレス
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="メールアドレスを入力"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                パスワード
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm pr-10"
                  placeholder="パスワードを入力"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-700">{error}</div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'ログイン中...' : 'ログイン'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">システム機能</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                onClick={() => setDebugMode(!debugMode)}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                {debugMode ? '🐛 ON' : '🐛 OFF'}
              </button>
              <button
                onClick={handleDebugInfo}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                📊 状態確認
              </button>
            </div>

            <div className="mt-3">
              <button
                onClick={handleResetData}
                className="w-full inline-flex justify-center py-2 px-4 border border-red-300 rounded-md shadow-sm bg-red-50 text-sm font-medium text-red-700 hover:bg-red-100"
              >
                🗑️ データリセット
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}