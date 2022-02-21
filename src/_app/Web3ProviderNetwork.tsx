import { NetworkContextName } from './bootstrap/Fraction/functions/contract/validate/hooks/state/reducer/state-user-reducer/constants'
import { createWeb3ReactRoot } from '@web3-react/core'

const Web3ReactRoot = createWeb3ReactRoot(NetworkContextName)

function Web3ProviderNetwork({ children, getLibrary }) {
  return <Web3ReactRoot getLibrary={getLibrary}>{children}</Web3ReactRoot>
}

export default Web3ProviderNetwork
