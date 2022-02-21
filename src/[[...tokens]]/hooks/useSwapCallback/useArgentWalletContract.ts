import ARGENT_WALLET_ABI from './useArgentWalletContract/argent-wallet.json'
import { Contract } from '@ethersproject/contracts'
import { useActiveWeb3React } from '../../../_app/bootstrap/Fraction/functions/contract/validate/hooks/state/reducer/state-inari-reducer/actions/types/useBentoBoxTrait/hooks/useStakeSushiToBentoStrategy/hooks/useContract/useActiveWeb3React'
import { useContract } from '../../../_app/bootstrap/Fraction/functions/contract/validate/hooks/state/reducer/state-inari-reducer/actions/types/useBentoBoxTrait/hooks/useStakeSushiToBentoStrategy/hooks/useContract'
import useIsArgentWallet from '../../../_app/bootstrap/Fraction/functions/contract/validate/hooks/state/reducer/state-inari-reducer/actions/types/useHasPermitTokenTrait/useERC20Permit/useIsArgentWallet'

export function useArgentWalletContract(): Contract | null {
  const { account } = useActiveWeb3React()
  const isArgentWallet = useIsArgentWallet()
  return useContract(isArgentWallet ? account ?? undefined : undefined, ARGENT_WALLET_ABI, true)
}
