# Polymarket 模拟器

一个功能完整的 Web 版 Polymarket 预测市场模拟器，使用 Next.js 14、TypeScript、Tailwind CSS 和 Supabase 构建。

## 功能特性

- 🎯 **市场创建**：创建自定义预测市场
- 💹 **实时交易**：买入/卖出 YES/NO 份额
- 💧 **流动性提供**：添加/移除流动性，查看无常损失
- 📊 **实时价格**：基于 AMM 算法的动态价格
- 📈 **价格图表**：可视化价格历史
- 💼 **投资组合**：查看持仓和收益
- ⚡ **实时更新**：使用 Supabase Realtime 实时同步

## 技术栈

- **前端**：Next.js 14 (App Router), TypeScript, Tailwind CSS
- **后端**：Supabase (PostgreSQL + Realtime)
- **状态管理**：Zustand
- **图表**：Recharts
- **动画**：Framer Motion
- **图标**：Lucide React

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置 Supabase

1. 在 [Supabase](https://supabase.com) 创建新项目
2. 复制 `.env.local.example` 为 `.env.local`
3. 填入你的 Supabase URL 和 Anon Key：
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### 3. 设置数据库

1. 在 Supabase Dashboard 打开 SQL Editor
2. 运行 `supabase/schema.sql` 中的 SQL 脚本
3. 这将创建所有必要的表和 RLS 策略

### 4. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)

## 功能说明

### 市场创建
- 输入事件描述和详细说明
- 设置初始流动性和 YES 概率
- 系统自动计算初始资金池分配

### 交易系统
- **买入 YES/NO**：根据当前价格计算能获得的份额
- **卖出 YES/NO**：根据当前价格计算能拿回的 USDC
- 自动扣除 2% 手续费
- 实时更新市场价格

### 流动性管理
- **添加流动性**：按当前比例注入资金，获得 LP 代币
- **移除流动性**：按 LP 代币比例取回资金
- 显示无常损失（如果存在）

### 价格机制
- 基于 AMM 恒定乘积公式：`k = YES池 × NO池`
- 价格 = 隐含概率
- YES 价格 = NO池 / 总池
- NO 价格 = YES池 / 总池

## 项目结构

```
polymarket-simulator/
├── app/                    # Next.js App Router
│   ├── markets/           # 市场相关页面
│   ├── portfolio/         # 投资组合页面
│   ├── create-market/     # 创建市场页面
│   └── api/               # API 路由
├── components/            # React 组件
│   ├── market/           # 市场相关组件
│   ├── trading/          # 交易相关组件
│   └── ui/               # UI 组件
├── lib/                   # 工具函数
│   ├── supabase/         # Supabase 客户端
│   ├── utils/            # 工具函数（AMM算法等）
│   └── store/            # 状态管理
└── types/                # TypeScript 类型定义
```

## 已完成功能 ✅

- [x] 项目初始化和配置
- [x] AMM 算法完整实现
- [x] 市场创建页面
- [x] 市场列表页面
- [x] 市场详情页面
- [x] 交易面板（买入/卖出）
- [x] 流动性管理面板
- [x] 价格图表组件
- [x] 投资组合页面
- [x] API 路由（创建市场、交易、流动性）
- [x] 数据库 Schema 和 RLS 策略

## 待完成功能

### Phase 2: 集成 Supabase
- [ ] 用户认证集成
- [ ] 实时数据订阅（Supabase Realtime）
- [ ] 用户余额和持仓管理
- [ ] 交易历史记录

### Phase 3: 高级功能
- [ ] 市场裁决功能
- [ ] 价格历史数据存储
- [ ] 交易统计和分析
- [ ] 模拟交易机器人
- [ ] 移动端响应式优化

## License

MIT
