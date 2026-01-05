import Link from 'next/link'
import { TrendingUp, Plus, BarChart3, ArrowRight, Zap, Shield, Users } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-800 dark:[mask-image:linear-gradient(0deg,transparent,rgba(255,255,255,0.6))]"></div>
        
        <div className="container mx-auto px-4 py-20 md:py-32 max-w-7xl relative">
          <div className="text-center mb-16">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm font-medium mb-8">
              <Zap className="w-4 h-4" />
              <span>体验预测市场的核心机制</span>
            </div>

            {/* Main Title */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold mb-6">
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Polymarket
              </span>
              <br />
              <span className="text-gray-900 dark:text-white">模拟器</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              通过交互式模拟，深入理解 AMM 算法、实时交易和流动性提供的核心原理
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/markets"
                className="group px-8 py-4 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1 flex items-center gap-2"
              >
                浏览市场
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/create-market"
                className="px-8 py-4 bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 border-2 border-indigo-600 dark:border-indigo-400 rounded-xl font-semibold hover:bg-indigo-50 dark:hover:bg-gray-700 transition-all shadow-lg hover:shadow-xl"
              >
                创建市场
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto mt-20">
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">AMM</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">算法引擎</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">实时</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">价格更新</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-pink-600 dark:text-pink-400 mb-2">LP</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">流动性管理</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              核心功能
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              全面模拟预测市场的所有关键机制
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-100 to-transparent dark:from-indigo-900/20 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  实时交易
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                  基于 AMM 算法的动态定价，实时买入/卖出 YES/NO 份额，体验真实的市场机制和价格发现过程
                </p>
                <div className="flex items-center text-indigo-600 dark:text-indigo-400 font-medium">
                  <span>了解更多</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-100 to-transparent dark:from-purple-900/20 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                  <Plus className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  流动性提供
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                  添加或移除流动性，深入了解 LP 的收益与风险，包括无常损失的计算和手续费收益
                </p>
                <div className="flex items-center text-purple-600 dark:text-purple-400 font-medium">
                  <span>了解更多</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all border border-gray-200 dark:border-gray-700 hover:border-pink-300 dark:hover:border-pink-600">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-100 to-transparent dark:from-pink-900/20 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                  <BarChart3 className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  数据分析
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                  实时价格图表、交易历史、持仓分析，全面了解市场动态和你的投资表现
                </p>
                <div className="flex items-center text-pink-600 dark:text-pink-400 font-medium">
                  <span>了解更多</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 md:p-12 shadow-2xl border border-gray-200 dark:border-gray-700">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                工作原理
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                深入了解预测市场的核心机制
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              {/* AMM Algorithm */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
                    <Shield className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    AMM 算法
                  </h3>
                </div>
                <div className="space-y-3 text-gray-600 dark:text-gray-400">
                  <p>
                    使用<strong className="text-gray-900 dark:text-white">恒定乘积公式</strong>
                  </p>
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 font-mono text-sm">
                    <code className="text-indigo-600 dark:text-indigo-400">k = YES池 × NO池</code>
                  </div>
                  <p>
                    来确定价格。每次交易都会改变池子比例，从而影响价格。
                  </p>
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="font-semibold text-gray-900 dark:text-white mb-2">价格 = 隐含概率</p>
                    <ul className="space-y-1 text-sm">
                      <li>• YES 价格 = NO池 / 总池</li>
                      <li>• NO 价格 = YES池 / 总池</li>
                      <li>• 反映市场认为事件发生的概率</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Trading Process */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    交易流程
                  </h3>
                </div>
                <ol className="space-y-4">
                  {[
                    '选择市场并查看当前价格',
                    '决定买入或卖出 YES/NO 份额',
                    '输入交易金额或份额数量',
                    '系统根据 AMM 算法计算成交价',
                    '交易执行，价格实时更新',
                  ].map((step, index) => (
                    <li key={index} className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-lg">
                        {index + 1}
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 pt-1">{step}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-12 shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              准备好开始了吗？
            </h2>
            <p className="text-xl text-indigo-100 mb-8">
              立即创建你的第一个预测市场，体验完整的交易流程
            </p>
            <Link
              href="/create-market"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 rounded-xl font-semibold hover:bg-indigo-50 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              创建市场
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
