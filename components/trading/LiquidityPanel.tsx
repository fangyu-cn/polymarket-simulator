'use client'

import { useState } from 'react'
import { Market } from '@/lib/store/useMarketStore'
import { Plus, Minus } from 'lucide-react'

interface LiquidityPanelProps {
  market: Market
}

export default function LiquidityPanel({ market }: LiquidityPanelProps) {
  const [action, setAction] = useState<'add' | 'remove'>('add')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)

  const totalLiquidity = market.yes_pool + market.no_pool

  const handleLiquidity = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('请输入有效金额')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/markets/${market.id}/liquidity`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          amount: parseFloat(amount),
        }),
      })

      if (response.ok) {
        setAmount('')
        alert(action === 'add' ? '成功添加流动性！' : '成功移除流动性！')
        // TODO: 刷新市场数据
      } else {
        const error = await response.json()
        alert(error.message || '操作失败')
      }
    } catch (error) {
      console.error('Liquidity error:', error)
      alert('操作失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  if (market.is_resolved) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="text-center text-gray-500 dark:text-gray-400 py-8">
          市场已结算
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        流动性管理
      </h2>

      {/* Current Liquidity */}
      <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">当前流动性</div>
        <div className="text-2xl font-bold text-gray-900 dark:text-white">
          ${totalLiquidity.toLocaleString()}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setAction('add')}
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
            action === 'add'
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          <Plus className="w-4 h-4 inline mr-1" />
          添加
        </button>
        <button
          onClick={() => setAction('remove')}
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
            action === 'remove'
              ? 'bg-red-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          <Minus className="w-4 h-4 inline mr-1" />
          移除
        </button>
      </div>

      {/* Amount Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {action === 'add' ? '投入金额 (USDC)' : 'LP 代币数量'}
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          step="0.01"
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      {/* Submit */}
      <button
        onClick={handleLiquidity}
        disabled={loading || !amount}
        className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? '处理中...' : action === 'add' ? '添加流动性' : '移除流动性'}
      </button>

      {/* Info */}
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-xs text-blue-800 dark:text-blue-400">
        {action === 'add' ? (
          <div>
            添加流动性将按当前比例同时向 YES 和 NO 池注入资金，并获得 LP 代币。
          </div>
        ) : (
          <div>
            移除流动性将按 LP 代币比例取回资金。注意可能存在无常损失。
          </div>
        )}
      </div>
    </div>
  )
}

