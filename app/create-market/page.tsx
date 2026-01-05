'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { showToast } from '@/components/ui/Toast'
import { Plus } from 'lucide-react'

export default function CreateMarketPage() {
  const router = useRouter()
  const [question, setQuestion] = useState('')
  const [description, setDescription] = useState('')
  const [initialLiquidity, setInitialLiquidity] = useState(1000)
  const [initialProbability, setInitialProbability] = useState(0.5)
  const [endsAt, setEndsAt] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // TODO: 调用 API 创建市场
      const response = await fetch('/api/markets/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          description,
          initialLiquidity,
          initialYesProbability: initialProbability,
          endsAt,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        showToast('市场创建成功！', 'success')
        router.push(`/markets/${data.id}`)
      } else {
        showToast(data.error || data.message || '创建失败，请重试', 'error')
        console.error('Create market error:', data)
      }
    } catch (error) {
      console.error('Error creating market:', error)
      showToast('创建失败，请重试', 'error')
    } finally {
      setLoading(false)
    }
  }

  // 计算初始池分配
  const yesPool = initialLiquidity * initialProbability
  const noPool = initialLiquidity * (1 - initialProbability)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            创建新市场
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            创建一个新的预测市场，设置初始流动性和概率
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
          {/* Question */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              事件描述 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="例如：比特币会在 2024 年底超过 10 万美元吗？"
              required
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              详细说明（可选）
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="添加更多关于这个市场的详细信息..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Initial Liquidity */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              初始流动性: {initialLiquidity.toLocaleString()} USDC
            </label>
            <input
              type="range"
              min="100"
              max="10000"
              step="100"
              value={initialLiquidity}
              onChange={(e) => setInitialLiquidity(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              这将作为初始资金池，用于市场定价
            </div>
          </div>

          {/* Initial Probability */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              初始 YES 概率: {(initialProbability * 100).toFixed(1)}%
            </label>
            <input
              type="range"
              min="0.1"
              max="0.9"
              step="0.01"
              value={initialProbability}
              onChange={(e) => setInitialProbability(parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              这决定了初始价格和资金池分配
            </div>
          </div>

          {/* Ends At */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              市场结束时间 <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              value={endsAt}
              onChange={(e) => setEndsAt(e.target.value)}
              required
              min={new Date().toISOString().slice(0, 16)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Preview */}
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              初始资金池分配预览
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-gray-600 dark:text-gray-400">YES 池</div>
                <div className="text-lg font-bold text-green-600 dark:text-green-400">
                  ${yesPool.toFixed(2)}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-600 dark:text-gray-400">NO 池</div>
                <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  ${noPool.toFixed(2)}
                </div>
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              初始 YES 价格: ${(noPool / initialLiquidity).toFixed(3)} | 
              初始 NO 价格: ${(yesPool / initialLiquidity).toFixed(3)}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              '创建中...'
            ) : (
              <>
                <Plus className="w-5 h-5" />
                创建市场
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

