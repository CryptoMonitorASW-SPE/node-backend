export interface CryptoData {
  id: string
  symbol: string
  name: string
  image: string
  prices: {
    values: {
      usd: number
      eur: number
    }
  }
  marketCap: {
    values: {
      usd: number
      eur: number
    }
  }
  marketCapRank: number
  fullyDilutedValuation: {
    values: {
      usd: number
      eur: number
    }
  }
  totalVolume: {
    values: {
      usd: number
      eur: number
    }
  }
  high24h: {
    values: {
      usd: number
      eur: number
    }
  }
  low24h: {
    values: {
      usd: number
      eur: number
    }
  }
  priceChange24h: {
    values: {
      usd: number
      eur: number
    }
  }
  priceChangePercentage24h: number
  marketCapChange24h: {
    values: {
      usd: number
      eur: number
    }
  }
  marketCapChangePercentage24h: number
  circulatingSupply: number
  totalSupply: number
  maxSupply: number
  ath: {
    values: {
      usd: number
      eur: number
    }
  }
  athChangePercentage: number
  athDate: string
  atl: {
    values: {
      usd: number
      eur: number
    }
  }
  atlChangePercentage: number
  atlDate: string
  lastUpdated: string
}
