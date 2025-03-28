'use client'
import { createContext, useContext, useState } from 'react'

interface FilterContextType {
  sortBy: string
  season: string | null
  priceRange: [number, number]
  fabric: string | null
  setSortBy: (value: string) => void
  setSeason: (value: string) => void
  setPriceRange: (value: [number, number]) => void
  setFabric: (value: string) => void
  resetFilters: () => void
}

const FilterContext = createContext<FilterContextType | undefined>(undefined)

export function FilterProvider({ children }: { children: React.ReactNode }) {
  const [sortBy, setSortBy] = useState('')
  const [season, setSeason] = useState<string | null>(null)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000])
  const [fabric, setFabric] = useState<string | null>(null)

  // Modified setter functions to handle 'all' value
  const handleSetSeason = (value: string) => {
    setSeason(value === 'all' ? null : value)
  }

  const handleSetFabric = (value: string) => {
    setFabric(value === 'all' ? null : value)
  }

  const resetFilters = () => {
    setSortBy('')
    setSeason(null)
    setPriceRange([0, 100000])
    setFabric(null)
  }

  return (
    <FilterContext.Provider value={{
      sortBy,
      season,
      priceRange,
      fabric,
      setSortBy,
      setSeason: handleSetSeason,
      setPriceRange,
      setFabric: handleSetFabric,
      resetFilters
    }}>
      {children}
    </FilterContext.Provider>
  )
}

export function useFilter() {
  const context = useContext(FilterContext)
  if (!context) {
    throw new Error('useFilter must be used within a FilterProvider')
  }
  return context
} 