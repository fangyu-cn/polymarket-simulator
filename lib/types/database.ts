export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          username: string | null
          wallet_balance: number
          created_at: string
        }
        Insert: {
          id: string
          username?: string | null
          wallet_balance?: number
          created_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          wallet_balance?: number
          created_at?: string
        }
      }
      markets: {
        Row: {
          id: string
          question: string
          description: string | null
          creator_id: string
          yes_pool: number
          no_pool: number
          liquidity_token_supply: number
          is_resolved: boolean
          outcome: boolean | null
          resolution_date: string | null
          created_at: string
          ends_at: string
        }
        Insert: {
          id?: string
          question: string
          description?: string | null
          creator_id: string
          yes_pool: number
          no_pool: number
          liquidity_token_supply: number
          is_resolved?: boolean
          outcome?: boolean | null
          resolution_date?: string | null
          created_at?: string
          ends_at: string
        }
        Update: {
          id?: string
          question?: string
          description?: string | null
          creator_id?: string
          yes_pool?: number
          no_pool?: number
          liquidity_token_supply?: number
          is_resolved?: boolean
          outcome?: boolean | null
          resolution_date?: string | null
          created_at?: string
          ends_at?: string
        }
      }
      user_positions: {
        Row: {
          id: string
          user_id: string
          market_id: string
          yes_shares: number
          no_shares: number
          liquidity_tokens: number
        }
        Insert: {
          id?: string
          user_id: string
          market_id: string
          yes_shares?: number
          no_shares?: number
          liquidity_tokens?: number
        }
        Update: {
          id?: string
          user_id?: string
          market_id?: string
          yes_shares?: number
          no_shares?: number
          liquidity_tokens?: number
        }
      }
      trades: {
        Row: {
          id: string
          market_id: string
          user_id: string
          trade_type: string
          amount: number
          shares_change: number | null
          price_at_trade: number | null
          yes_pool_before: number | null
          no_pool_before: number | null
          yes_pool_after: number | null
          no_pool_after: number | null
          created_at: string
        }
        Insert: {
          id?: string
          market_id: string
          user_id: string
          trade_type: string
          amount: number
          shares_change?: number | null
          price_at_trade?: number | null
          yes_pool_before?: number | null
          no_pool_before?: number | null
          yes_pool_after?: number | null
          no_pool_after?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          market_id?: string
          user_id?: string
          trade_type?: string
          amount?: number
          shares_change?: number | null
          price_at_trade?: number | null
          yes_pool_before?: number | null
          no_pool_before?: number | null
          yes_pool_after?: number | null
          no_pool_after?: number | null
          created_at?: string
        }
      }
    }
  }
}

