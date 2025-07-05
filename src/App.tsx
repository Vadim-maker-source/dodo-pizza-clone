import { Route, Routes } from "react-router-dom"
import AuthLayout from "./_auth/AuthLayout"
import SignIn from "./_auth/forms/SignIn"
import SignUp from "./_auth/forms/SignUp"
import RootLayout from "./_root/RootLayout"
import Home from "./_root/pages/Home"
import CreateOrder from "./_root/pages/CreateOrder"
import OrderSuccess from "./_root/pages/OrderSuccess"


function App() {

  return (
    <main className="flex h-screen">
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
        </Route>

        <Route element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="/create-order" element={<CreateOrder />} />
          <Route path="/order-success" element={<OrderSuccess />} />
        </Route>
      </Routes>
    </main>
  )
}

export default App
