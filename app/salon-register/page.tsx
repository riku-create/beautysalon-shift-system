'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { saveSalon, getSalon } from '@/lib/data'
import type { Salon } from '@/lib/data'

export default function SalonRegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    openHours: '09:00',
    closeHours: '19:00'
  })
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{
    type: 'success' | 'error' | 'info'
    text: string
  } | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    try {
      // 入力値の検証
      if (!formData.name.trim()) {
        setMessage({ type: 'error', text: 'サロン名を入力してください' })
        return
      }

      if (!formData.email.trim()) {
        setMessage({ type: 'error', text: 'メールアドレスを入力してください' })
        return
      }

      if (!formData.phone.trim()) {
        setMessage({ type: 'error', text: '電話番号を入力してください' })
        return
      }

      if (!formData.address.trim()) {
        setMessage({ type: 'error', text: '住所を入力してください' })
        return
      }

      // サロンデータを作成
      const salonData: Salon = {
        id: 'salon-' + Date.now(),
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        openHours: formData.openHours,
        closeHours: formData.closeHours
      }

      console.log('🏪 サロン情報保存:', salonData)

      // localStorageにサロン情報を保存
      saveSalon(salonData)

      setMessage({ 
        type: 'success', 
        text: '🎉 サロン登録が完了しました！ログインページに移動します。' 
      })

      // フォームリセット
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        openHours: '09:00',
        closeHours: '19:00'
      })

      // 2秒後にログインページへリダイレクト
      setTimeout(() => {
        router.push('/login')
      }, 2000)

    } catch (error) {
      console.error('❌ サロン登録エラー:', error)
      setMessage({ 
        type: 'error', 
        text: 'サロン登録中にエラーが発生しました。もう一度お試しください。' 
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-blue-600 hover:text-blue-500 mb-4"
          >
            ← トップページに戻る
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">サロン登録</h1>
          <p className="text-gray-600 mt-2">完全無料でご利用いただけます</p>
        </div>
        
        {/* メッセージ表示 */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : message.type === 'error'
              ? 'bg-red-50 text-red-700 border border-red-200'
              : 'bg-blue-50 text-blue-700 border border-blue-200'
          }`}>
            {message.text}
          </div>
        )}
        
        {/* フォーム */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                サロン名 *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="美容室名を入力してください"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                メールアドレス *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="contact@salon.com"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                電話番号 *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="03-1234-5678"
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                住所 *
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="東京都渋谷区..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="openHours" className="block text-sm font-medium text-gray-700 mb-2">
                  開店時間
                </label>
                <input
                  type="time"
                  id="openHours"
                  name="openHours"
                  value={formData.openHours}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="closeHours" className="block text-sm font-medium text-gray-700 mb-2">
                  閉店時間
                </label>
                <input
                  type="time"
                  id="closeHours"
                  name="closeHours"
                  value={formData.closeHours}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-md text-white font-semibold ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
              } transition duration-200`}
            >
              {isLoading ? '登録中...' : 'サロン登録'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              既にアカウントをお持ちの方は{' '}
              <Link href="/login" className="text-blue-600 hover:text-blue-500 font-medium">
                ログイン
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}