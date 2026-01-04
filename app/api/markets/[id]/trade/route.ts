import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { buyYes, buyNo, sellYes, sellNo } from '@/lib/utils/amm'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { tradeType, amount } = body
    const marketId = params.id

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

    // TODO: 获取当前用户 ID 和余额
    // const { data: { user } } = await supabase.auth.getUser()
    // if (!user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    // 执行 AMM 交易
    let result
    const marketState = {
      yesPool: market.yes_pool,
      noPool: market.no_pool,
      k: market.yes_pool * market.no_pool,
    }

    switch (tradeType) {
      case 'BUY_YES':
        result = buyYes(marketState, amount)
        break
      case 'BUY_NO':
        result = buyNo(marketState, amount)
        break
      case 'SELL_YES':
        result = sellYes(marketState, amount)
        break
      case 'SELL_NO':
        result = sellNo(marketState, amount)
        break
      default:
        return NextResponse.json(
          { error: 'Invalid trade type' },
          { status: 400 }
        )
    }

    // 更新市场状态
    const { error: updateError } = await supabase
      .from('markets')
      .update({
        yes_pool: result.newYesPool,
        no_pool: result.newNoPool,
      })
      .eq('id', marketId)

    if (updateError) {
      console.error('Error updating market:', updateError)
      return NextResponse.json(
        { error: 'Failed to update market' },
        { status: 500 }
      )
    }

    // 记录交易
    // TODO: 更新用户余额和持仓
    // TODO: 记录交易历史

    return NextResponse.json({
      success: true,
      newYesPrice: result.newYesPrice,
      newNoPrice: result.newNoPrice,
      sharesReceived: result.sharesReceived,
      amountReceived: result.amountReceived,
      fee: result.fee,
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

