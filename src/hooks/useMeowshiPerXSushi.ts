import { useBentoBoxContract } from '../_app/bootstrap/Fraction/functions/contract/validate/hooks/state/reducer/state-inari-reducer/actions/types/useBentoBoxTrait/hooks/useStakeSushiToBentoStrategy/hooks/useContract'
import { useEffect, useState } from 'react'
import { XSUSHI } from '../_app/bootstrap/Fraction/functions/contract/validate/hooks/state/reducer/state-user-reducer/constants'
import { BigNumber } from 'ethers'

export default function useMeowshiPerXSushi() {
  const bentoboxContract = useBentoBoxContract()
  const [state, setState] = useState<[BigNumber, BigNumber]>([BigNumber.from('0'), BigNumber.from('0')])

  useEffect(() => {
    if (!bentoboxContract) return
    ;(async () => {
      const toShare = await bentoboxContract.toShare(XSUSHI.address, '1'.toBigNumber(XSUSHI.decimals), false)
      const toAmount = await bentoboxContract.toAmount(XSUSHI.address, '1'.toBigNumber(XSUSHI.decimals), false)
      setState([toShare, toAmount])
    })()
  }, [bentoboxContract])

  return state
}
