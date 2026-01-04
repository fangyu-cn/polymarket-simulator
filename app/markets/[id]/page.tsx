'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useMarketStore } from '@/lib/store/useMarketStore'
import { getPrices } from '@/lib/utils/amm'
import TradingPanel from '@/components/trading/TradingPanel'
import PriceChart from '@/components/market/PriceChart'
import LiquidityPanel from '@/components/trading/LiquidityPanel'
import { Clock, DollarSign, TrendingUp } from 'lucide-react'

export default function MarketDetailPage() {
  const params = useParams()
  const marketId = params.id as string
  const { markets, selectedMarket, setSelectedMarket } = useMarketStore()
  const [activeTab, setActiveTab] = useState<'trade' | 'liquidity'>('trade')

  useEffect(() => {
    const market = markets.find((m) => m.id === marketId)
    if (market) {
      setSelectedMarket(market)
    } else {
      // TODO: 从 Supabase 获取市场数据
    }
  }, [marketId, markets, setSelectedMarket])

  if (!selectedMarket) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center text-gray-500 dark:text-gray-400">加载中...</div>
        </div>
      </div>
    )
  }

  const prices = getPrices({
    yesPool: selectedMarket.yes_pool,
    noPool: selectedMarket.no_pool,
    k: selectedMarket.yes_pool * selectedMarket.no_pool,
  })
  const totalLiquidity = selectedMarket.yes_pool + selectedMarket.no_pool

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Market Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {selectedMarket.question}
          </h1>
          {selectedMarket.description && (
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {selectedMarket.description}
            </p>
          )}

          {/* Market Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">YES 价格</div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                ${prices.yesPrice.toFixed(3)}
              </div>
              <div className="text-xs text-gray-500">
                {(prices.yesPrice * 100).toFixed(1)}% 概率
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">NO 价格</div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                ${prices.noPrice.toFixed(3)}
              </div>
              <div className="text-xs text-gray-500">
                {(prices.noPrice * 100).toFixed(1)}% 概率
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">总流动性</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                ${totalLiquidity.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">状态</div>
              <div className="text-2xl font-bold">
                {selectedMarket.is_resolved ? (
                  <span className={selectedMarket.outcome ? 'text-green-600' : 'text-red-600'}>
                    {selectedMarket.outcome ? 'YES' : 'NO'}
                  </span>
                ) : (
                  <span className="text-blue-600">进行中</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column: Chart */}
          <div className="lg:col-span-2 space-y-6">
            {/* Price Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                价格走势
              </h2>
              <PriceChart marketId={marketId} />
            </div>
          </div>

          {/* Right Column: Trading */}
          <div className="space-y-6">
            {/* Tab Selector */}
            <div className="flex gap-2 bg-white dark:bg-gray-800 rounded-lg p-1 border border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setActiveTab('trade')}
                className={`flex-1 px-4 py-2 rounded-md font-medium transition-all ${
                  activeTab === 'trade'
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                交易
              </button>
              <button
                onClick={() => setActiveTab('liquidity')}
                className={`flex-1 px-4 py-2 rounded-md font-medium transition-all ${
                  activeTab === 'liquidity'
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                流动性
              </button>
            </div>

            {/* Trading Panel */}
            {activeTab === 'trade' && (
              <TradingPanel market={selectedMarket} />
            )}

            {/* Liquidity Panel */}
            {activeTab === 'liquidity' && (
              <LiquidityPanel market={selectedMarket} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

