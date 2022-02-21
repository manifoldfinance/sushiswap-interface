import { isAddress } from '../../../_app/bootstrap/Fraction/functions/contract/validate'
import useENSAddress from './useENS/useENSAddress'
import useENSName from '../../../_app/Default/Header/Web3Status/useENSName'

/**
 * Given a name or address, does a lookup to resolve to an address and name
 * @param nameOrAddress ENS name or address
 */
export default function useENS(nameOrAddress?: string | null): {
  loading: boolean
  address: string | null
  name: string | null
} {
  const validated = isAddress(nameOrAddress)
  const reverseLookup = useENSName(validated ? validated : undefined)
  const lookup = useENSAddress(nameOrAddress)

  return {
    loading: reverseLookup.loading || lookup.loading,
    address: validated ? validated : lookup.address,
    name: reverseLookup.ENSName ? reverseLookup.ENSName : !validated && lookup.address ? nameOrAddress || null : null,
  }
}
