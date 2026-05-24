import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CURRENCIES } from '@/constants/currencies'

type CurrencyState = {
  currency: Currency
  setCurrency: (currency: Currency) => void
}

export const useCurrency = create<CurrencyState>()(
  persist(
    (set) => ({
      currency: CURRENCIES[0],
      setCurrency: (currency: Currency) => set({ currency })
    }),
    { name: 'reledger-currency' }
  )
)
