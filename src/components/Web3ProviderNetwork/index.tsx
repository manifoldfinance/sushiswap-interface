import { NetworkContextName } from 'app/constants'
import { createWeb3ReactRoot } from 'web3-react-core'

const Web3ReactRoot = createWeb3ReactRoot(NetworkContextName)

// @ts-ignore
// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export function Web3ProviderNetwork({ children, getLibrary }) {
  return <Web3ReactRoot getLibrary={getLibrary}>{children}</Web3ReactRoot>
}
