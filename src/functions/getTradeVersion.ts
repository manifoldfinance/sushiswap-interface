import { Currency, Trade as V2Trade, TradeType, TradeVersion } from '@sushiswap/core-sdk'
import { Trade as V3Trade } from '@sushiswap/trident-sdk'

export function getTradeVersion(
  trade?: V2Trade<Currency, Currency, TradeType> | V3Trade<Currency, Currency, TradeType> // | VXTrade<Currency, Currency, TradeType>
): TradeVersion | undefined {
  if (!trade) return undefined
  if (trade instanceof V2Trade) return TradeVersion.V2TRADE
//  if (trade instanceof VXTrade) return TradeVersion.VXTRADE
  return TradeVersion.V3TRADE
}
