import { BigNumber } from 'ethers'
import { useMulticall2Contract } from '../../../useBentoBoxTrait/hooks/useStakeSushiToBentoStrategy/hooks/useContract'
import { useSingleCallResult } from '../../../useBentoBoxTrait/hooks/useStakeSushiToBentoStrategy/hooks/Tokens/hooks'

// gets the current timestamp from the blockchain
export default function useCurrentBlockTimestamp(): BigNumber | undefined {
  const multicall = useMulticall2Contract()
  return useSingleCallResult(multicall, 'getCurrentBlockTimestamp')?.result?.[0]
}
