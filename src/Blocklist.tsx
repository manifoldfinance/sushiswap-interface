import React, { ReactNode, useMemo } from 'react'
import { BLOCKED_ADDRESSES } from './_app/bootstrap/Fraction/functions/contract/validate/hooks/state/reducer/state-user-reducer/constants'
import { useActiveWeb3React } from './_app/bootstrap/Fraction/functions/contract/validate/hooks/state/reducer/state-inari-reducer/actions/types/useBentoBoxTrait/hooks/useStakeSushiToBentoStrategy/hooks/useContract/useActiveWeb3React'

export default function Blocklist({ children }: { children: ReactNode }) {
  const { account } = useActiveWeb3React()
  const blocked: boolean = useMemo(() => Boolean(account && BLOCKED_ADDRESSES.indexOf(account) !== -1), [account])
  if (blocked) {
    return <div>Blocked address</div>
  }
  return <>{children}</>
}
