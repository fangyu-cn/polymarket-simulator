import Link from 'next/link'
import { TrendingUp, Plus, BarChart3 } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
            Polymarket 模拟器
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            体验预测市场的核心机制：AMM 算法、实时交易、流动性提供
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/markets"
              className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              浏览市场
            </Link>
            <Link
              href="/create-market"
              className="px-8 py-4 bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 border-2 border-indigo-600 dark:border-indigo-400 rounded-xl font-semibold hover:bg-indigo-50 dark:hover:bg-gray-700 transition-all"
            >
              创建市场
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-700">
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              实时交易
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              基于 AMM 算法的动态定价，实时买入/卖出 YES/NO 份额，体验真实的市场机制
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-700">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-4">
              <Plus className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              流动性提供
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              添加或移除流动性，了解 LP 的收益与风险，包括无常损失的计算
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-700">
            <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/30 rounded-xl flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-pink-600 dark:text-pink-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              数据分析
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              实时价格图表、交易历史、持仓分析，全面了解市场动态
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            工作原理
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                AMM 算法
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                使用恒定乘积公式 <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">k = YES池 × NO池</code> 来确定价格。
                每次交易都会改变池子比例，从而影响价格。
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                价格 = 隐含概率。YES 价格 = NO池 / 总池，反映市场认为事件发生的概率。
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                交易流程
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-400">
                <li>选择市场并查看当前价格</li>
                <li>决定买入或卖出 YES/NO 份额</li>
                <li>输入交易金额或份额数量</li>
                <li>系统根据 AMM 算法计算成交价</li>
                <li>交易执行，价格实时更新</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
