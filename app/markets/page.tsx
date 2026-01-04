'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useMarketStore } from '@/lib/store/useMarketStore'
import { getPrices } from '@/lib/utils/amm'
import { TrendingUp, TrendingDown, Clock, DollarSign } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export default function MarketsPage() {
  const { markets, setMarkets } = useMarketStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: 从 Supabase 获取市场数据
    // 暂时使用模拟数据
    const mockMarkets = [
      {
        id: '1',
        question: '比特币会在 2024 年底超过 10 万美元吗？',
        description: '预测比特币价格走势',
        creator_id: 'user1',
        yes_pool: 5000,
        no_pool: 5000,
        liquidity_token_supply: 10000,
        is_resolved: false,
        outcome: null,
        resolution_date: null,
        created_at: new Date().toISOString(),
        ends_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '2',
        question: 'OpenAI 会在 2024 年发布 GPT-5 吗？',
        description: 'AI 技术发展预测',
        creator_id: 'user2',
        yes_pool: 3000,
        no_pool: 7000,
        liquidity_token_supply: 10000,
        is_resolved: false,
        outcome: null,
        resolution_date: null,
        created_at: new Date().toISOString(),
        ends_at: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ]
    setMarkets(mockMarkets)
    setLoading(false)
  }, [setMarkets])

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
            市场列表
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            浏览所有活跃的预测市场
          </p>
        </div>

        {/* Markets Grid */}
        {markets.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-500 dark:text-gray-400 mb-4">
              还没有市场
            </div>
            <Link
              href="/create-market"
              className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              创建第一个市场
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {markets.map((market) => {
              const prices = getPrices({
                yesPool: market.yes_pool,
                noPool: market.no_pool,
                k: market.yes_pool * market.no_pool,
              })
              const totalLiquidity = market.yes_pool + market.no_pool
              const timeRemaining = formatDistanceToNow(new Date(market.ends_at), {
                addSuffix: true,
              })

              return (
                <Link
                  key={market.id}
                  href={`/markets/${market.id}`}
                  className="block"
                >
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-all hover:-translate-y-1">
                    {/* Market Status */}
                    {market.is_resolved ? (
                      <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-3 ${
                        market.outcome
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                      }`}>
                        {market.outcome ? 'YES ✓' : 'NO ✓'}
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-3 bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                        <Clock className="w-3 h-3" />
                        进行中
                      </div>
                    )}

                    {/* Question */}
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 line-clamp-2">
                      {market.question}
                    </h2>

                    {/* Prices */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 border border-green-200 dark:border-green-800">
                        <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">YES</div>
                        <div className="text-xl font-bold text-green-600 dark:text-green-400">
                          ${prices.yesPrice.toFixed(3)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {(prices.yesPrice * 100).toFixed(1)}%
                        </div>
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
                        <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">NO</div>
                        <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                          ${prices.noPrice.toFixed(3)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {(prices.noPrice * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        <span>${totalLiquidity.toLocaleString()}</span>
                      </div>
                      {!market.is_resolved && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{timeRemaining}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

