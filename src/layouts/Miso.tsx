import Banner from '../_app/Default/Banner'
import Footer from '../_app/Default/Footer'
import Header from '../_app/Default/Header'
import Main from '../_app/Default/Main'
import Popups from '../_app/Default/Popups'

const Layout = ({ children }) => {
  return (
    <div className="z-0 flex flex-col items-center w-full h-screen overflow-x-hidden overflow-y-auto">
      {/* <Banner /> */}
      <Header />
      <main
        className="flex flex-col items-center justify-start flex-grow w-full h-full"
        style={{ height: 'max-content' }}
      >
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default Layout
