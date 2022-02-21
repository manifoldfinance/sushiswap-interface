import Banner from './Default/Banner'
import Footer from './Default/Footer'
import Header from './Default/Header'
import Main from './Default/Main'
import Popups from './Default/Popups'

import { useActiveWeb3React } from './bootstrap/Fraction/functions/contract/validate/hooks/state/reducer/state-inari-reducer/actions/types/useBentoBoxTrait/hooks/useStakeSushiToBentoStrategy/hooks-index'
// import { ChainId } from '@sushiswap/sdk'

const Layout = ({ children }) => {
  // const { chainId } = useActiveWeb3React()
  return (
    <div className="z-0 flex flex-col items-center w-full h-screen pb-16 lg:pb-0">
      {/* {chainId === ChainId.MAINNET ? <Banner /> : null} */}
      <Header />
      <Main>{children}</Main>
      <Popups />
      <Footer />
    </div>
  )
}

export default Layout
