import BSC from './tokens/bsc'
import { ChainId } from '@sushiswap/sdk'
import HECO from './tokens/heco'
import KOVAN from './tokens/kovan'
import MAINNET from './tokens/mainnet'
import MATIC from './tokens/matic'

export type ChainlinkToken = {
  symbol: string
  name: string
  address: string
  decimals: number
}

export const CHAINLINK_TOKENS: { [chainId in ChainId]?: ChainlinkToken[] } = {
  [ChainId.MAINNET]: MAINNET,
  [ChainId.KOVAN]: KOVAN,
  [ChainId.BSC]: BSC,
  [ChainId.HECO]: HECO,
  [ChainId.MATIC]: MATIC,
}
