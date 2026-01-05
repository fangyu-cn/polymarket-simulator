import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getPrices } from '@/lib/utils/amm'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { question, description, initialLiquidity, initialYesProbability, endsAt } = body

    // 验证输入
    if (!question || !endsAt || initialLiquidity <= 0) {
      return NextResponse.json(
        { error: 'Invalid input' },
        { status: 400 }
      )
    }

    // 计算初始池分配
    const yesPool = initialLiquidity * initialYesProbability
    const noPool = initialLiquidity * (1 - initialYesProbability)

    const supabase = await createClient()

    // 获取当前用户
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // 检查用户余额
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('wallet_balance, total_markets_created')
      .eq('id', user.id)
      .single()

    if (profileError || !userProfile) {
      console.error('User profile not found:', profileError, 'User ID:', user.id)
      return NextResponse.json(
        { 
          error: '用户资料未找到',
          message: '用户资料未在系统中找到。这可能是因为注册触发器未正常工作。请联系管理员或重新注册账户。'
        },
        { status: 404 }
      )
    }

    if (userProfile.wallet_balance < initialLiquidity) {
      return NextResponse.json(
        { 
          error: '余额不足',
          message: `余额不足，当前余额: ${userProfile.wallet_balance.toFixed(2)} USDC，需要: ${initialLiquidity.toFixed(2)} USDC`
        },
        { status: 400 }
      )
    }

    // 创建市场
    const { data: market, error } = await supabase
      .from('markets')
      .insert({
        question,
        description,
        creator_id: user.id,
        yes_pool: yesPool,
        no_pool: noPool,
        liquidity_token_supply: initialLiquidity,
        ends_at: endsAt,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating market:', error)
      return NextResponse.json(
        { error: 'Failed to create market' },
        { status: 500 }
      )
    }

    // 扣除用户余额
    const { error: balanceError } = await supabase
      .from('users')
      .update({
        wallet_balance: userProfile.wallet_balance - initialLiquidity,
        total_markets_created: (userProfile.total_markets_created || 0) + 1,
      })
      .eq('id', user.id)

    if (balanceError) {
      console.error('Error updating balance:', balanceError)
      // 回滚：删除刚创建的市场
      await supabase.from('markets').delete().eq('id', market.id)
      return NextResponse.json(
        { error: 'Failed to update balance' },
        { status: 500 }
      )
    }

    return NextResponse.json(market)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

