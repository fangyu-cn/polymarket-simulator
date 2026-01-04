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

    // TODO: 获取当前用户 ID
    // const { data: { user } } = await supabase.auth.getUser()
    // if (!user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    // 创建市场
    const { data: market, error } = await supabase
      .from('markets')
      .insert({
        question,
        description,
        creator_id: 'temp_user_id', // TODO: 使用真实用户 ID
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

    return NextResponse.json(market)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

