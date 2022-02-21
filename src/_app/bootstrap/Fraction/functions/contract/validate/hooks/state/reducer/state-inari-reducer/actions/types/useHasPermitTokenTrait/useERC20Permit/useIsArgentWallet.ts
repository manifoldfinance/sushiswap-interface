import { NEVER_RELOAD, useSingleCallResult } from '../../useBentoBoxTrait/hooks/useStakeSushiToBentoStrategy/hooks/Tokens/hooks'

import { useActiveWeb3React } from '../../useBentoBoxTrait/hooks/useStakeSushiToBentoStrategy/hooks/useContract/useActiveWeb3React'
import { useArgentWalletDetectorContract } from '../../useBentoBoxTrait/hooks/useStakeSushiToBentoStrategy/hooks/useContract'
import { useMemo } from 'react'

export default function useIsArgentWallet(): boolean {
  const { account } = useActiveWeb3React()
  const argentWalletDetector = useArgentWalletDetectorContract()
  const inputs = useMemo(() => [account ?? undefined], [account])
  const call = useSingleCallResult(argentWalletDetector, 'isArgentWallet', inputs, NEVER_RELOAD)
  return call?.result?.[0] ?? false
}
