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