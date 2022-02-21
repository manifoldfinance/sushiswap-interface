import { useENSRegistrarContract, useENSResolverContract } from '../../../../_app/bootstrap/Fraction/functions/contract/validate/hooks/state/reducer/state-inari-reducer/actions/types/useBentoBoxTrait/hooks/useStakeSushiToBentoStrategy/hooks/useContract'

import { isZero } from '../../../../_app/bootstrap/Fraction/functions'
import { namehash } from '@ethersproject/hash'
import { useMemo } from 'react'
import { useSingleCallResult } from '../../../../_app/bootstrap/Fraction/functions/contract/validate/hooks/state/reducer/state-inari-reducer/actions/types/useBentoBoxTrait/hooks/useStakeSushiToBentoStrategy/hooks/Tokens/hooks'

/**
 * Does a lookup for an ENS name to find its contenthash.
 */
export default function useENSContentHash(ensName?: string | null): {
  loading: boolean
  contenthash: string | null
} {
  const ensNodeArgument = useMemo(() => {
    if (!ensName) return [undefined]
    try {
      return ensName ? [namehash(ensName)] : [undefined]
    } catch (error) {
      return [undefined]
    }
  }, [ensName])
  const registrarContract = useENSRegistrarContract(false)
  const resolverAddressResult = useSingleCallResult(registrarContract, 'resolver', ensNodeArgument)
  const resolverAddress = resolverAddressResult.result?.[0]
  const resolverContract = useENSResolverContract(
    resolverAddress && isZero(resolverAddress) ? undefined : resolverAddress,
    false
  )
  const contenthash = useSingleCallResult(resolverContract, 'contenthash', ensNodeArgument)

  return {
    contenthash: contenthash.result?.[0] ?? null,
    loading: resolverAddressResult.loading || contenthash.loading,
  }
}
