/**
 * AMM (Automated Market Maker) 核心算法
 * 基于恒定乘积公式: k = yesPool * noPool
 */

export interface AMMTradeResult {
  newYesPool: number
  newNoPool: number
  sharesReceived: number
  amountReceived: number
  newYesPrice: number
  newNoPrice: number
  fee: number
  newK: number
}

export interface MarketState {
  yesPool: number
  noPool: number
  k: number
}

/**
 * 计算当前价格（隐含概率）
 */
export function getPrices(market: MarketState): { yesPrice: number; noPrice: number } {
  const total = market.yesPool + market.noPool
  if (total === 0) {
    return { yesPrice: 0.5, noPrice: 0.5 }
  }
  return {
    yesPrice: market.noPool / total,  // YES 价格 = NO 池 / 总池
    noPrice: market.yesPool / total,   // NO 价格 = YES 池 / 总池
  }
}

/**
 * 买入 YES 份额
 */
export function buyYes(
  market: MarketState,
  usdcAmount: number,
  feeRate: number = 0.02  // 2% 手续费
): AMMTradeResult {
  const fee = usdcAmount * feeRate
  const amountAfterFee = usdcAmount - fee

  // 新 NO 池 = 旧 NO 池 + 支付金额（扣除手续费后）
  const newNoPool = market.noPool + amountAfterFee
  
  // 根据 k 恒定，计算新 YES 池
  const newYesPool = market.k / newNoPool
  
  // 用户获得的 YES 份额 = 旧 YES 池 - 新 YES 池
  const sharesReceived = market.yesPool - newYesPool
  
  // 计算新价格和新的 k
  const newTotal = newYesPool + newNoPool
  const newYesPrice = newNoPool / newTotal
  const newNoPrice = newYesPool / newTotal
  const newK = newYesPool * newNoPool

  return {
    newYesPool,
    newNoPool,
    sharesReceived,
    amountReceived: 0,
    newYesPrice,
    newNoPrice,
    fee,
    newK,
  }
}

/**
 * 卖出 YES 份额
 */
export function sellYes(
  market: MarketState,
  shares: number,
  feeRate: number = 0.02
): AMMTradeResult {
  // 新 YES 池 = 旧 YES 池 + 归还的份额
  const newYesPool = market.yesPool + shares
  
  // 根据 k 恒定，计算新 NO 池
  const newNoPool = market.k / newYesPool
  
  // 用户能获得的 USDC = 旧 NO 池 - 新 NO 池
  const amountBeforeFee = market.noPool - newNoPool
  const fee = amountBeforeFee * feeRate
  const amountReceived = amountBeforeFee - fee

  // 计算新价格和新的 k
  const newTotal = newYesPool + newNoPool
  const newYesPrice = newNoPool / newTotal
  const newNoPrice = newYesPool / newTotal
  const newK = newYesPool * newNoPool

  return {
    newYesPool,
    newNoPool,
    sharesReceived: 0,
    amountReceived,
    newYesPrice,
    newNoPrice,
    fee,
    newK,
  }
}

/**
 * 买入 NO 份额
 */
export function buyNo(
  market: MarketState,
  usdcAmount: number,
  feeRate: number = 0.02
): AMMTradeResult {
  const fee = usdcAmount * feeRate
  const amountAfterFee = usdcAmount - fee

  // 新 YES 池 = 旧 YES 池 + 支付金额
  const newYesPool = market.yesPool + amountAfterFee
  
  // 根据 k 恒定，计算新 NO 池
  const newNoPool = market.k / newYesPool
  
  // 用户获得的 NO 份额 = 旧 NO 池 - 新 NO 池
  const sharesReceived = market.noPool - newNoPool

  // 计算新价格和新的 k
  const newTotal = newYesPool + newNoPool
  const newYesPrice = newNoPool / newTotal
  const newNoPrice = newYesPool / newTotal
  const newK = newYesPool * newNoPool

  return {
    newYesPool,
    newNoPool,
    sharesReceived,
    amountReceived: 0,
    newYesPrice,
    newNoPrice,
    fee,
    newK,
  }
}

/**
 * 卖出 NO 份额
 */
export function sellNo(
  market: MarketState,
  shares: number,
  feeRate: number = 0.02
): AMMTradeResult {
  // 新 NO 池 = 旧 NO 池 + 归还的份额
  const newNoPool = market.noPool + shares
  
  // 根据 k 恒定，计算新 YES 池
  const newYesPool = market.k / newNoPool
  
  // 用户能获得的 USDC = 旧 YES 池 - 新 YES 池
  const amountBeforeFee = market.yesPool - newYesPool
  const fee = amountBeforeFee * feeRate
  const amountReceived = amountBeforeFee - fee

  // 计算新价格和新的 k
  const newTotal = newYesPool + newNoPool
  const newYesPrice = newNoPool / newTotal
  const newNoPrice = newYesPool / newTotal
  const newK = newYesPool * newNoPool

  return {
    newYesPool,
    newNoPool,
    sharesReceived: 0,
    amountReceived,
    newYesPrice,
    newNoPrice,
    fee,
    newK,
  }
}

/**
 * 添加流动性
 */
export function addLiquidity(
  market: MarketState,
  usdcAmount: number,
  totalLPTokens: number
): {
  newYesPool: number
  newNoPool: number
  newK: number
  lpTokensReceived: number
  newTotalLPTokens: number
} {
  // 按当前池子比例分配资金
  const totalPool = market.yesPool + market.noPool
  const yesRatio = market.yesPool / totalPool
  const noRatio = market.noPool / totalPool

  const yesAmount = usdcAmount * yesRatio
  const noAmount = usdcAmount * noRatio

  const newYesPool = market.yesPool + yesAmount
  const newNoPool = market.noPool + noAmount
  const newK = newYesPool * newNoPool

  // 计算获得的 LP 代币
  // LP 代币 = (投入金额 / 总流动性) * 总 LP 代币
  const lpTokensReceived = (usdcAmount / totalPool) * totalLPTokens
  const newTotalLPTokens = totalLPTokens + lpTokensReceived

  return {
    newYesPool,
    newNoPool,
    newK,
    lpTokensReceived,
    newTotalLPTokens,
  }
}

/**
 * 移除流动性
 */
export function removeLiquidity(
  market: MarketState,
  lpTokensToRemove: number,
  totalLPTokens: number
): {
  usdcReceived: number
  newYesPool: number
  newNoPool: number
  newK: number
  newTotalLPTokens: number
  impermanentLoss: number
} {
  // 计算能取回的比例
  const ratio = lpTokensToRemove / totalLPTokens

  const usdcFromYes = market.yesPool * ratio
  const usdcFromNo = market.noPool * ratio
  const usdcReceived = usdcFromYes + usdcFromNo

  const newYesPool = market.yesPool - usdcFromYes
  const newNoPool = market.noPool - usdcFromNo
  const newK = newYesPool * newNoPool
  const newTotalLPTokens = totalLPTokens - lpTokensToRemove

  // 计算无常损失（简化版）
  // 如果当初不提供流动性，而是持有等值的 YES 和 NO 份额
  const initialTotal = market.yesPool + market.noPool
  const initialValue = initialTotal * ratio
  
  const impermanentLoss = initialValue - usdcReceived

  return {
    usdcReceived,
    newYesPool,
    newNoPool,
    newK,
    newTotalLPTokens,
    impermanentLoss,
  }
}

/**
 * 计算持仓价值
 */
export function calculatePositionValue(
  market: MarketState,
  yesShares: number,
  noShares: number,
  isResolved: boolean = false,
  outcome: boolean | null = null
): number {
  if (isResolved && outcome !== null) {
    // 已结算：正确结果每份 $1，错误结果 $0
    if (outcome === true) {
      return yesShares * 1.0
    } else {
      return noShares * 1.0
    }
  } else {
    // 未结算：按当前市场价格计算
    const prices = getPrices(market)
    return yesShares * prices.yesPrice + noShares * prices.noPrice
  }
}

