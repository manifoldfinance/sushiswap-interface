import { contenthashToUri, uriToHttp } from '../../../_app/bootstrap/Fraction/functions/convert'

import { parseENSAddress } from '../../../_app/bootstrap/Fraction/functions/ens'
import useENSContentHash from './useHttpLocations/useENSContentHash'
import { useMemo } from 'react'

export default function useHttpLocations(uri: string | undefined): string[] {
  const ens = useMemo(() => (uri ? parseENSAddress(uri) : undefined), [uri])
  const resolvedContentHash = useENSContentHash(ens?.ensName)
  return useMemo(() => {
    if (ens) {
      return resolvedContentHash.contenthash ? uriToHttp(contenthashToUri(resolvedContentHash.contenthash)) : []
    } else {
      return uri ? uriToHttp(uri) : []
    }
  }, [ens, resolvedContentHash.contenthash, uri])
}
