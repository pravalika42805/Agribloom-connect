import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Order from "./Order";
import MyOrders from "./MyOrders";
import Login from "./Login";
import Register from "./Register";
import Home from "./Home";
import Profile from "./Profile";
import BrowseCrops from "./BrowseCrops";
import Swap from "./Swap";
import SellCrop from "./SellCrop";
import Layout from "./Layout";
import SellerProfile from "./pages/SellerProfile";
import Messages from "./Messages";   // ✅ ONLY THIS
import About from "./About";
function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Redirect root */}
        <Route path="/" element={<Navigate to="/home" />} />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Layout Wrapper */}
        <Route path="/" element={<Layout />}>

          <Route path="home" element={<Home />} />
          <Route path="browse" element={<BrowseCrops />} />
         <Route path="order/:id" element={<Order />} />
<Route path="my-orders" element={<MyOrders />} /><Route path="sell" element={<SellCrop />} />
          <Route path="profile" element={<Profile />} />
       <Route path="swap/:cropId/:receiverId" element={<Swap />} />
<Route path="about" element={<About />} />
<Route path="swap" element={<Swap />} />
<Route path="swap/:cropId/:receiverId" element={<Swap />} />

          {/* ✅ Clean Messages Routing */}
          <Route path="messages" element={<Messages />} />
          <Route path="messages/:id" element={<Messages />} />

          <Route path="seller/:id" element={<SellerProfile />} />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
