import { AppDispatch } from '../bootstrap/Fraction/functions/contract/validate/hooks/state'
import { ChainId } from '@sushiswap/sdk'
import { TokenList } from '@uniswap/token-lists'
import { fetchTokenList } from '../bootstrap/Fraction/functions/contract/validate/hooks/state/reducer/state-lists-reducer/actions'
import { getNetworkLibrary } from '../bootstrap/Fraction/functions/contract/validate/hooks/state/reducer/state-user-reducer/constants/connectors'
import { getTokenList } from '../bootstrap/Fraction/functions/contract/validate/hooks/list'
import { nanoid } from '@reduxjs/toolkit'
import { resolveENSContentHash } from '../bootstrap/Fraction/functions/ens'
import { useActiveWeb3React } from '../bootstrap/Fraction/functions/contract/validate/hooks/state/reducer/state-inari-reducer/actions/types/useBentoBoxTrait/hooks/useStakeSushiToBentoStrategy/hooks/useContract/useActiveWeb3React'
import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

export function useFetchListCallback(): (listUrl: string, sendDispatch?: boolean) => Promise<TokenList> {
  const { chainId, library } = useActiveWeb3React()
  const dispatch = useDispatch<AppDispatch>()

  const ensResolver = useCallback(
    (ensName: string) => {
      if (!library || chainId !== ChainId.MAINNET) {
        if (chainId === ChainId.MAINNET) {
          const networkLibrary = getNetworkLibrary()
          if (networkLibrary) {
            return resolveENSContentHash(ensName, networkLibrary)
          }
        }
        throw new Error('Could not construct mainnet ENS resolver')
      }
      return resolveENSContentHash(ensName, library)
    },
    [chainId, library]
  )

  // note: prevent dispatch if using for list search or unsupported list
  return useCallback(
    async (listUrl: string, sendDispatch = true) => {
      const requestId = nanoid()
      sendDispatch && dispatch(fetchTokenList.pending({ requestId, url: listUrl }))
      return getTokenList(listUrl, ensResolver)
        .then((tokenList) => {
          sendDispatch && dispatch(fetchTokenList.fulfilled({ url: listUrl, tokenList, requestId }))
          return tokenList
        })
        .catch((error) => {
          console.debug(`Failed to get list at url ${listUrl}`, error)
          sendDispatch &&
            dispatch(
              fetchTokenList.rejected({
                url: listUrl,
                requestId,
                errorMessage: error.message,
              })
            )
          throw error
        })
    },
    [dispatch, ensResolver]
  )
}
