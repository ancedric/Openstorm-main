import ReactDOM from "react-dom/client";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import App from "./App";
import Home from "./Components/RootComponents/Home";
import "./index.css";
import LandingPage from "./LandingPage";
import ProductView from './Components/view/productView';
import Auth from "./Authentication/auth";
import AuthProvider from "./Authentication/Context/authProvider";
import Profile from "./Authentication/profile/Profile";
import SetProfile from "./Authentication/setProfile";
import RootLayout from "./Root/RootLayout";
import Pricing from "./Components/RootComponents/pricing/pricing";
import ViewShop from "./Components/view/viewShop/ViewShop";
import AdminDashboard from "./Components/view/Admin/AdminDashboard";

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
      <Router>
        <Routes>
          {/*public Routes*/}
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth/" element={<Auth />} />
          <Route path="/auth/:plan" element={<Auth />} />
          <Route path="/plan" element={<Pricing />} />
          <Route path="*" element={<h1>404: page not found</h1>} />

          {/*private Routes*/}
          <Route path="/view-shop/:shopId" element={<ViewShop />} />
          <Route path="/view-product/:productId" element={<ProductView />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/edit-profile/:userRef" element={<SetProfile />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route element={<RootLayout />}>
            <Route index path="/home" element={<Home />} />
          </Route>
        </Routes>
      </Router>
  </AuthProvider>
);
