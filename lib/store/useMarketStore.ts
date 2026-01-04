import { create } from 'zustand'

export interface Market {
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

interface MarketStore {
  markets: Market[]
  selectedMarket: Market | null
  setMarkets: (markets: Market[]) => void
  setSelectedMarket: (market: Market | null) => void
  updateMarket: (marketId: string, updates: Partial<Market>) => void
}

export const useMarketStore = create<MarketStore>((set) => ({
  markets: [],
  selectedMarket: null,
  setMarkets: (markets) => set({ markets }),
  setSelectedMarket: (selectedMarket) => set({ selectedMarket }),
  updateMarket: (marketId, updates) =>
    set((state) => ({
      markets: state.markets.map((m) =>
        m.id === marketId ? { ...m, ...updates } : m
      ),
      selectedMarket:
        state.selectedMarket?.id === marketId
          ? { ...state.selectedMarket, ...updates }
          : state.selectedMarket,
    })),
}))

