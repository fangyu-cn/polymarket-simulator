import { createClient } from '@/lib/supabase/server'

/**
 * 获取当前认证用户
 */
export async function getCurrentUser() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    return null
  }
  
  return user
}

/**
 * 获取用户完整信息（包括 users 表中的数据）
 */
export async function getUserProfile(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error || !data) {
    return null
  }
  
  return data
}

/**
 * 检查用户余额是否充足
 */
export async function checkUserBalance(userId: string, requiredAmount: number): Promise<boolean> {
  const profile = await getUserProfile(userId)
  if (!profile) return false
  
  return profile.wallet_balance >= requiredAmount
}

/**
 * 更新用户余额
 */
export async function updateUserBalance(
  userId: string,
  amount: number,
  operation: 'add' | 'subtract'
) {
  const supabase = await createClient()
  
  // 先获取当前余额
  const profile = await getUserProfile(userId)
  if (!profile) {
    throw new Error('User not found')
  }
  
  const newBalance = operation === 'add'
    ? profile.wallet_balance + amount
    : profile.wallet_balance - amount
  
  if (newBalance < 0) {
    throw new Error('Insufficient balance')
  }
  
  const { error } = await supabase
    .from('users')
    .update({ wallet_balance: newBalance })
    .eq('id', userId)
  
  if (error) {
    throw new Error('Failed to update balance')
  }
  
  return newBalance
}

