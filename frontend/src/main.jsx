import ReactDOM from "react-dom/client";
import { Route, MemoryRouter, Routes } from "react-router-dom"; // On change Router en MemoryRouter
//import App from "./App";
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

// Cette fonction sera appelée par l'ERP Vue
const mount = (el) => {
  const root = ReactDOM.createRoot(el);
  root.render(
    <AuthProvider>
        {/* MemoryRouter permet au module d'avoir sa propre navigation interne 
            sans toucher à l'URL principale de l'ERP */}
        <MemoryRouter initialEntries={["/home"]}> 
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth/" element={<Auth />} />
            <Route path="/auth/:plan" element={<Auth />} />
            <Route path="/plan" element={<Pricing />} />
            <Route path="/view-shop/:shopId" element={<ViewShop />} />
            <Route path="/view-product/:productId" element={<ProductView />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/edit-profile/:userRef" element={<SetProfile />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route element={<RootLayout />}>
              <Route index path="/home" element={<Home />} />
            </Route>
            <Route path="*" element={<h1>404: page not found</h1>} />
          </Routes>
        </MemoryRouter>
    </AuthProvider>
  );
};

// Mode développement local (pour continuer à bosser sur le projet React seul)
// eslint-disable-next-line no-undef
if (process.env.NODE_ENV === "development") {
  const devRoot = document.getElementById("root");
  if (devRoot) mount(devRoot);
}

// Export pour le Module Federation
export { mount };