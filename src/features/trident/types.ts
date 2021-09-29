import { ConstantProductPoolState } from '../../hooks/useTridentClassicPools'
import { ConstantProductPool, HybridPool } from '@sushiswap/trident-sdk'
import { HybridPoolState } from '../../hooks/useTridentHybridPools'

// TODO add last two pool types
export type AllPools = ConstantProductPool | HybridPool

export enum PoolType {
  ConstantProduct = 'ConstantProduct',
  Weighted = 'Weighted',
  Hybrid = 'Hybrid',
  ConcentratedLiquidity = 'ConcentratedLiquidity',
}

export enum LiquidityMode {
  STANDARD = 'Standard Mode',
  ZAP = 'Zap Mode',
}

// TODO should be all
export type PoolAtomType = [ConstantProductPoolState | HybridPoolState, ConstantProductPool | HybridPool | null]