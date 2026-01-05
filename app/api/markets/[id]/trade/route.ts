import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { buyYes, buyNo, sellYes, sellNo, getPrices } from '@/lib/utils/amm'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json()
    const { tradeType, amount } = body
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

    // 获取当前用户
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // 获取用户信息和持仓
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('wallet_balance, total_trades')
      .eq('id', user.id)
      .maybeSingle() // 使用 maybeSingle 而不是 single，避免找不到记录时报错

    if (profileError) {
      console.error('Error fetching user profile:', {
        error: profileError,
        code: profileError.code,
        message: profileError.message,
        details: profileError.details,
        hint: profileError.hint,
        user_id: user.id
      })
      
      // 如果是 RLS 策略问题，提供更明确的错误信息
      if (profileError.code === 'PGRST116' || profileError.message?.includes('0 rows')) {
        return NextResponse.json(
          { 
            error: '用户资料查询失败',
            message: `无法查询用户资料。这可能是 RLS 策略问题。请检查：1) users 表中是否存在用户 ID ${user.id} 的记录；2) RLS 策略是否正确配置。`
          },
          { status: 403 }
        )
      }
      
      return NextResponse.json(
        { 
          error: '查询用户资料失败',
          message: `查询用户资料时出错: ${profileError.message || '未知错误'}`
        },
        { status: 500 }
      )
    }

    if (!userProfile) {
      console.error('User profile not found. User ID:', user.id)
      return NextResponse.json(
        { 
          error: '用户资料未找到',
          message: `用户资料未在系统中找到。用户 ID: ${user.id}。这可能是因为：1) 注册触发器未正常工作；2) RLS 策略阻止了查询。请在 Supabase Table Editor 中检查 users 表是否有该用户的记录。`
        },
        { status: 404 }
      )
    }

    // 获取用户持仓
    const { data: position } = await supabase
      .from('user_positions')
      .select('*')
      .eq('user_id', user.id)
      .eq('market_id', marketId)
      .single()

    const currentPosition = position || {
      user_id: user.id,
      market_id: marketId,
      yes_shares: 0,
      no_shares: 0,
      liquidity_tokens: 0,
    }

    // 执行 AMM 交易
    let result
    const marketState = {
      yesPool: market.yes_pool,
      noPool: market.no_pool,
      k: market.yes_pool * market.no_pool,
    }

    const prices = getPrices(marketState)

    // 验证交易
    if (tradeType === 'BUY_YES' || tradeType === 'BUY_NO') {
      // 买入：检查余额
      if (userProfile.wallet_balance < amount) {
        return NextResponse.json(
          { 
            error: '余额不足',
            message: `余额不足，当前余额: ${userProfile.wallet_balance.toFixed(2)} USDC，需要: ${amount.toFixed(2)} USDC`
          },
          { status: 400 }
        )
      }
    } else if (tradeType === 'SELL_YES') {
      // 卖出 YES：检查持仓
      if (!currentPosition.yes_shares || currentPosition.yes_shares < amount) {
        return NextResponse.json(
          { 
            error: 'YES 份额不足',
            message: `YES 份额不足，当前持仓: ${(currentPosition.yes_shares || 0).toFixed(4)} 份，需要: ${amount.toFixed(4)} 份`
          },
          { status: 400 }
        )
      }
    } else if (tradeType === 'SELL_NO') {
      // 卖出 NO：检查持仓
      if (!currentPosition.no_shares || currentPosition.no_shares < amount) {
        return NextResponse.json(
          { 
            error: 'NO 份额不足',
            message: `NO 份额不足，当前持仓: ${(currentPosition.no_shares || 0).toFixed(4)} 份，需要: ${amount.toFixed(4)} 份`
          },
          { status: 400 }
        )
      }
    }

    // 执行交易计算
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

    // 使用事务更新所有数据
    const newYesShares = tradeType === 'BUY_YES'
      ? (currentPosition.yes_shares || 0) + result.sharesReceived
      : tradeType === 'SELL_YES'
      ? (currentPosition.yes_shares || 0) - amount
      : currentPosition.yes_shares || 0

    const newNoShares = tradeType === 'BUY_NO'
      ? (currentPosition.no_shares || 0) + result.sharesReceived
      : tradeType === 'SELL_NO'
      ? (currentPosition.no_shares || 0) - amount
      : currentPosition.no_shares || 0

    const balanceChange = tradeType.startsWith('BUY')
      ? -amount // 买入扣除余额
      : result.amountReceived || 0 // 卖出增加余额

    const newBalance = userProfile.wallet_balance + balanceChange

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

    // 更新用户余额
    console.log('Updating balance:', {
      user_id: user.id,
      old_balance: userProfile.wallet_balance,
      new_balance: newBalance,
      balance_change: balanceChange
    })

    // 先更新余额（不读取返回数据，避免 RLS 策略问题）
    const { error: balanceError } = await supabase
      .from('users')
      .update({
        wallet_balance: newBalance,
        total_trades: (userProfile.total_trades || 0) + 1,
      })
      .eq('id', user.id)

    if (balanceError) {
      console.error('Error updating balance:', balanceError)
      return NextResponse.json(
        { 
          error: '更新余额失败',
          message: `无法更新用户余额: ${balanceError.message || '未知错误'}`
        },
        { status: 500 }
      )
    }

    // 验证更新是否成功：重新查询用户余额
    const { data: updatedProfile, error: verifyError } = await supabase
      .from('users')
      .select('wallet_balance')
      .eq('id', user.id)
      .maybeSingle()

    if (verifyError) {
      console.error('Error verifying balance update:', verifyError)
      // 验证失败不应该阻止交易，但记录警告
    } else if (!updatedProfile || Math.abs(updatedProfile.wallet_balance - newBalance) > 0.01) {
      console.error('Balance update verification failed:', {
        expected: newBalance,
        actual: updatedProfile?.wallet_balance,
        user_id: user.id
      })
      return NextResponse.json(
        { 
          error: '余额更新验证失败',
          message: `余额更新可能未成功。期望: ${newBalance.toFixed(2)}, 实际: ${updatedProfile?.wallet_balance?.toFixed(2) || '未知'}`
        },
        { status: 500 }
      )
    } else {
      console.log('Balance updated and verified successfully:', {
        expected: newBalance,
        actual: updatedProfile.wallet_balance
      })
    }

    // 更新或创建持仓
    if (position) {
      const { error: positionError } = await supabase
        .from('user_positions')
        .update({
          yes_shares: newYesShares,
          no_shares: newNoShares,
        })
        .eq('id', position.id)

      if (positionError) {
        console.error('Error updating position:', positionError)
        // 持仓更新失败不应该阻止交易，但记录错误
      }
    } else {
      const { error: positionError } = await supabase
        .from('user_positions')
        .insert({
          user_id: user.id,
          market_id: marketId,
          yes_shares: newYesShares,
          no_shares: newNoShares,
        })

      if (positionError) {
        console.error('Error creating position:', positionError)
        // 持仓创建失败不应该阻止交易，但记录错误
      }
    }

    // 记录交易历史
    const { error: tradeError } = await supabase
      .from('trades')
      .insert({
        market_id: marketId,
        user_id: user.id,
        trade_type: tradeType,
        amount: tradeType.startsWith('BUY') ? amount : result.amountReceived || 0,
        shares_change: tradeType.startsWith('BUY') ? result.sharesReceived : -amount,
        price_at_trade: tradeType.includes('YES') ? prices.yesPrice : prices.noPrice,
        yes_pool_before: market.yes_pool,
        no_pool_before: market.no_pool,
        yes_pool_after: result.newYesPool,
        no_pool_after: result.newNoPool,
      })

    if (tradeError) {
      console.error('Error recording trade:', tradeError)
      // 交易记录失败不应该阻止交易，但记录错误
    }


    return NextResponse.json({
      success: true,
      newYesPrice: result.newYesPrice,
      newNoPrice: result.newNoPrice,
      sharesReceived: result.sharesReceived,
      amountReceived: result.amountReceived,
      fee: result.fee,
      newBalance,
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
