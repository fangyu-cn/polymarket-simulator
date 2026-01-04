'use client'

import { useState } from 'react'
import { Market } from '@/lib/store/useMarketStore'
import { getPrices } from '@/lib/utils/amm'
import { ArrowUp, ArrowDown } from 'lucide-react'

interface TradingPanelProps {
  market: Market
}

export default function TradingPanel({ market }: TradingPanelProps) {
  const [action, setAction] = useState<'buy' | 'sell'>('buy')
  const [option, setOption] = useState<'yes' | 'no'>('yes')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)

  const prices = getPrices({
    yesPool: market.yes_pool,
    noPool: market.no_pool,
    k: market.yes_pool * market.no_pool,
  })

  const handleTrade = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('请输入有效金额')
      return
    }

    setLoading(true)
    try {
      const tradeType = `${action.toUpperCase()}_${option.toUpperCase()}` as
        | 'BUY_YES'
        | 'BUY_NO'
        | 'SELL_YES'
        | 'SELL_NO'

      const response = await fetch(`/api/markets/${market.id}/trade`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tradeType,
          amount: parseFloat(amount),
        }),
      })

      if (response.ok) {
        setAmount('')
        alert('交易成功！')
        // TODO: 刷新市场数据
      } else {
        const error = await response.json()
        alert(error.message || '交易失败')
      }
    } catch (error) {
      console.error('Trade error:', error)
      alert('交易失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  if (market.is_resolved) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="text-center text-gray-500 dark:text-gray-400 py-8">
          市场已结算，无法继续交易
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        交易
      </h2>

      {/* Action Buttons */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setAction('buy')}
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
            action === 'buy'
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          <ArrowUp className="w-4 h-4 inline mr-1" />
          买入
        </button>
        <button
          onClick={() => setAction('sell')}
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
            action === 'sell'
              ? 'bg-red-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          <ArrowDown className="w-4 h-4 inline mr-1" />
          卖出
        </button>
      </div>

      {/* Option Buttons */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setOption('yes')}
          className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
            option === 'yes'
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          YES
          <div className="text-xs mt-1 opacity-80">
            ${prices.yesPrice.toFixed(3)}
          </div>
        </button>
        <button
          onClick={() => setOption('no')}
          className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
            option === 'no'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          NO
          <div className="text-xs mt-1 opacity-80">
            ${prices.noPrice.toFixed(3)}
          </div>
        </button>
      </div>

      {/* Amount Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {action === 'buy' ? '投入金额 (USDC)' : '卖出份额数'}
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          step="0.01"
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        {action === 'buy' && amount && (
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            预估可获得: {(
              parseFloat(amount) / (option === 'yes' ? prices.yesPrice : prices.noPrice)
            ).toFixed(4)} 份
          </div>
        )}
      </div>

      {/* Submit */}
      <button
        onClick={handleTrade}
        disabled={loading || !amount}
        className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? '处理中...' : `${action === 'buy' ? '买入' : '卖出'} ${option.toUpperCase()}`}
      </button>
    </div>
  )
}

