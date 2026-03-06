import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // On change Router en MemoryRouter
//import App from "./App";
import Dashboard from "./Components/RootComponents/Dashboard/RightHiddenbar";
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

  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(
    <AuthProvider>
      <Router>  
          <Routes>
            <Route path="/:userRef" element={<LandingPage />} />
            <Route path="/auth/" element={<Auth />} />
            <Route path="/auth/:plan" element={<Auth />} />
            <Route path="/plan" element={<Pricing />} />
            <Route index path="/dashboard" element={<Dashboard />} />
            <Route path="/view-shop/:shopId" element={<ViewShop />} />
            <Route path="/view-product/:productId" element={<ProductView />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/edit-profile/:userRef" element={<SetProfile />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route element={<RootLayout />}>
            </Route>
            <Route path="*" element={<h1>404: page not found</h1>} />
          </Routes>
      </Router>
          
    </AuthProvider>
  );
