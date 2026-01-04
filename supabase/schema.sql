-- Polymarket 模拟器数据库 Schema
-- 在 Supabase SQL Editor 中运行此脚本

-- 1. 用户表（扩展 Supabase Auth）
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users PRIMARY KEY,
  username TEXT UNIQUE,
  wallet_balance DECIMAL(15,2) DEFAULT 1000.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 市场表
CREATE TABLE IF NOT EXISTS public.markets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  description TEXT,
  creator_id UUID REFERENCES public.users(id) NOT NULL,
  
  -- AMM池状态
  yes_pool DECIMAL(20,2) NOT NULL,
  no_pool DECIMAL(20,2) NOT NULL,
  liquidity_token_supply DECIMAL(20,2) NOT NULL,
  
  -- 元数据
  is_resolved BOOLEAN DEFAULT FALSE,
  outcome BOOLEAN, -- TRUE=YES赢, FALSE=NO赢, NULL=未裁决
  resolution_date TIMESTAMP WITH TIME ZONE,
  
  -- 时间戳
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ends_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_markets_active ON public.markets(created_at, is_resolved);
CREATE INDEX IF NOT EXISTS idx_markets_creator ON public.markets(creator_id);

-- 3. 用户持仓表
CREATE TABLE IF NOT EXISTS public.user_positions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  market_id UUID REFERENCES public.markets(id) NOT NULL,
  yes_shares DECIMAL(20,4) DEFAULT 0,
  no_shares DECIMAL(20,4) DEFAULT 0,
  liquidity_tokens DECIMAL(20,4) DEFAULT 0,
  
  UNIQUE(user_id, market_id)
);

CREATE INDEX IF NOT EXISTS idx_user_positions_user ON public.user_positions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_positions_market ON public.user_positions(market_id);

-- 4. 交易记录表
CREATE TABLE IF NOT EXISTS public.trades (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  market_id UUID REFERENCES public.markets(id) NOT NULL,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  
  -- 交易类型: BUY_YES, SELL_YES, BUY_NO, SELL_NO, ADD_LIQUIDITY, REMOVE_LIQUIDITY
  trade_type TEXT NOT NULL,
  
  -- 交易详情
  amount DECIMAL(20,2) NOT NULL, -- USDC金额
  shares_change DECIMAL(20,4), -- 份额变化
  price_at_trade DECIMAL(10,4), -- 交易时的价格
  
  -- AMM池变化
  yes_pool_before DECIMAL(20,2),
  no_pool_before DECIMAL(20,2),
  yes_pool_after DECIMAL(20,2),
  no_pool_after DECIMAL(20,2),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_trades_market ON public.trades(market_id, created_at);
CREATE INDEX IF NOT EXISTS idx_trades_user ON public.trades(user_id, created_at);

-- 启用 Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.markets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trades ENABLE ROW LEVEL SECURITY;

-- RLS 策略：用户可以查看所有市场
CREATE POLICY "Markets are viewable by everyone" ON public.markets
  FOR SELECT USING (true);

-- RLS 策略：用户可以创建市场
CREATE POLICY "Users can create markets" ON public.markets
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

-- RLS 策略：用户可以查看自己的持仓
CREATE POLICY "Users can view own positions" ON public.user_positions
  FOR SELECT USING (auth.uid() = user_id);

-- RLS 策略：用户可以更新自己的持仓
CREATE POLICY "Users can update own positions" ON public.user_positions
  FOR ALL USING (auth.uid() = user_id);

-- RLS 策略：用户可以查看自己的交易记录
CREATE POLICY "Users can view own trades" ON public.trades
  FOR SELECT USING (auth.uid() = user_id);

-- RLS 策略：用户可以创建交易记录
CREATE POLICY "Users can create trades" ON public.trades
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 函数：自动创建用户记录
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, username, wallet_balance)
  VALUES (NEW.id, NEW.email, 1000.00);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 触发器：新用户注册时自动创建记录
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

