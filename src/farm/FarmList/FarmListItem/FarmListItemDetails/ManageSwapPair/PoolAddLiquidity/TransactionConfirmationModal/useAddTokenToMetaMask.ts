import { Currency, Token } from '@sushiswap/sdk'
import { useCallback, useState } from 'react'

import { getTokenLogoURL } from '../../../../../../../zap/CurrencyInputPanel/CurrencyLogo'
import { useActiveWeb3React } from '../../../../../../../_app/bootstrap/Fraction/functions/contract/validate/hooks/state/reducer/state-inari-reducer/actions/types/useBentoBoxTrait/hooks/useStakeSushiToBentoStrategy/hooks/useContract/useActiveWeb3React'

export default function useAddTokenToMetaMask(currencyToAdd: Currency | undefined): {
  addToken: () => void
  success: boolean | undefined
} {
  const { chainId, library } = useActiveWeb3React()

  const token: Token | undefined = currencyToAdd?.wrapped

  const [success, setSuccess] = useState<boolean | undefined>()

  const addToken = useCallback(() => {
    if (library && library.provider.isMetaMask && library.provider.request && token) {
      library.provider
        .request({
          method: 'wallet_watchAsset',
          params: {
            //@ts-ignore // need this for incorrect ethers provider type
            type: 'ERC20',
            options: {
              address: token.address,
              symbol: token.symbol,
              decimals: token.decimals,
              image: getTokenLogoURL(token.address, chainId),
            },
          },
        })
        .then((success) => {
          setSuccess(success)
        })
        .catch(() => setSuccess(false))
    } else {
      setSuccess(false)
    }
  }, [chainId, library, token])

  return { addToken, success }
}
