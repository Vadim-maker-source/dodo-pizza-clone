import { Outlet } from 'react-router-dom'
import Topbar from '../components/Topbar'

const RootLayout = () => {
  return (
    <div className='w-full'>
        <Topbar cart={[]} />
        <Outlet />
    </div>
  )
}

export default RootLayout