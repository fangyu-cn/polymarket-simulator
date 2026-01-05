import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { addLiquidity, removeLiquidity } from '@/lib/utils/amm'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json()
    const { action, amount } = body
    const { id: marketId } = await params

    const supabase = await createClient()

    // 获取市场数据
    const { data: market, error: marketError } = await supabase
      .from('markets')
      .select('*')
      .eq('id', marketId)
      .single()

    if (marketError || !market) {
      return NextResponse.json(
        { error: 'Market not found' },
        { status: 404 }
      )
    }

    if (market.is_resolved) {
      return NextResponse.json(
        { error: 'Market is already resolved' },
        { status: 400 }
      )
    }

    const marketState = {
      yesPool: market.yes_pool,
      noPool: market.no_pool,
      k: market.yes_pool * market.no_pool,
    }

    let result

    if (action === 'add') {
      result = addLiquidity(marketState, amount, market.liquidity_token_supply)

      // 更新市场
      const { error: updateError } = await supabase
        .from('markets')
        .update({
          yes_pool: result.newYesPool,
          no_pool: result.newNoPool,
          liquidity_token_supply: result.newTotalLPTokens,
        })
        .eq('id', marketId)

      if (updateError) {
        return NextResponse.json(
          { error: 'Failed to update market' },
          { status: 500 }
        )
      }

      // TODO: 更新用户 LP 代币和余额
    } else if (action === 'remove') {
      result = removeLiquidity(marketState, amount, market.liquidity_token_supply)

      // 更新市场
      const { error: updateError } = await supabase
        .from('markets')
        .update({
          yes_pool: result.newYesPool,
          no_pool: result.newNoPool,
          liquidity_token_supply: result.newTotalLPTokens,
        })
        .eq('id', marketId)

      if (updateError) {
        return NextResponse.json(
          { error: 'Failed to update market' },
          { status: 500 }
        )
      }

      // TODO: 更新用户 LP 代币和余额
    } else {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      ...result,
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

