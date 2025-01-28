export interface CryptoData {
  id: string
  symbol: string
  name: string
  image: string
  price: number
  marketCap: number
  marketCapRank: number
  fullyDilutedValuation: number
  totalVolume: number
  high24h: number
  low24h: number
  priceChange24h: number
  priceChangePercentage24h: number
  marketCapChange24h: number
  marketCapChangePercentage24h: number
  circulatingSupply: number
  totalSupply: number
  maxSupply: number | null
  ath: number
  athChangePercentage: number
  athDate: string
  atl: number
  atlChangePercentage: number
  atlDate: string
  lastUpdated: string
  currency: string
}
