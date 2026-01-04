'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react'
import { calculatePositionValue, getPrices } from '@/lib/utils/amm'

interface Position {
  market_id: string
  market_question: string
  yes_shares: number
  no_shares: number
  liquidity_tokens: number
  market: {
    yes_pool: number
    no_pool: number
    is_resolved: boolean
    outcome: boolean | null
  }
}

export default function PortfolioPage() {
  const [positions, setPositions] = useState<Position[]>([])
  const [balance, setBalance] = useState(1000)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: 从 Supabase 获取用户持仓和余额
    // 暂时使用模拟数据
    setBalance(1000)
    setPositions([])
    setLoading(false)
  }, [])

  const totalValue = positions.reduce((sum, pos) => {
    const value = calculatePositionValue(
      {
        yesPool: pos.market.yes_pool,
        noPool: pos.market.no_pool,
        k: pos.market.yes_pool * pos.market.no_pool,
      },
      pos.yes_shares,
      pos.no_shares,
      pos.market.is_resolved,
      pos.market.outcome
    )
    return sum + value
  }, balance)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center text-gray-500 dark:text-gray-400">加载中...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            我的投资组合
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            查看你的持仓和收益
          </p>
        </div>

        {/* Balance Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">可用余额</div>
              <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                ${balance.toFixed(2)} USDC
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">总资产</div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                ${totalValue.toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* Positions */}
        {positions.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
            <Wallet className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <div className="text-gray-500 dark:text-gray-400 mb-4">
              还没有持仓
            </div>
            <Link
              href="/markets"
              className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              浏览市场
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {positions.map((position) => {
              const value = calculatePositionValue(
                {
                  yesPool: position.market.yes_pool,
                  noPool: position.market.no_pool,
                  k: position.market.yes_pool * position.market.no_pool,
                },
                position.yes_shares,
                position.no_shares,
                position.market.is_resolved,
                position.market.outcome
              )
              const prices = getPrices({
                yesPool: position.market.yes_pool,
                noPool: position.market.no_pool,
                k: position.market.yes_pool * position.market.no_pool,
              })

              return (
                <div
                  key={position.market_id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <Link
                        href={`/markets/${position.market_id}`}
                        className="text-lg font-bold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400"
                      >
                        {position.market_question}
                      </Link>
                      {position.market.is_resolved && (
                        <div className={`inline-block ml-3 px-2 py-1 rounded text-xs font-medium ${
                          position.market.outcome
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                        }`}>
                          {position.market.outcome ? 'YES ✓' : 'NO ✓'}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600 dark:text-gray-400">持仓价值</div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        ${value.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">YES 份额</div>
                      <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                        {position.yes_shares.toFixed(4)}
                      </div>
                      <div className="text-xs text-gray-500">
                        @ ${prices.yesPrice.toFixed(3)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">NO 份额</div>
                      <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                        {position.no_shares.toFixed(4)}
                      </div>
                      <div className="text-xs text-gray-500">
                        @ ${prices.noPrice.toFixed(3)}
                      </div>
                    </div>
                    {position.liquidity_tokens > 0 && (
                      <div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">LP 代币</div>
                        <div className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">
                          {position.liquidity_tokens.toFixed(4)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

