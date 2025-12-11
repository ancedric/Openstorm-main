import RightHiddenbar from '../Components/RootComponents/Dashboard/RightHiddenbar'
import Topbar from '../Components/RootComponents/Topbar'
//import LeftSidebar from '../Components/RootComponents/LeftSidebar'
//import Bottombar from '../Components/RootComponents/Bottombar'
//import { Outlet } from 'react-router-dom'

const RootLayout = () => {
  return (
    <div className=" root-layout ">
      {/*<LeftSidebar />*/}
      <Topbar />

      {/*<section className="main-app-content">
        <Outlet />
      </section>*/}

      {/*<Bottombar />*/}
      <div className='dashboard-container'>
        <RightHiddenbar />
      </div>
    </div>
  )
}

export default RootLayout