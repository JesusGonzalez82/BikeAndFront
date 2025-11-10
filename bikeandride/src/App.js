import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { Layout } from "antd"; // solo el componente
import "./App.css";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
//import CustomFooter from "./components/footer";
import FooterMinimal from "./components/footerMinimal";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfUse from "./pages/TermsOfUse";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { BikeProvider } from "./context/BikeContext";
import { StatsProvider } from "./context/StatsContext";
import { RouteProvider } from "./context/RouteContext";
import { ProtectedRoute, PublicRoute } from "./components/ProtectedRoute";
import Register from "./pages/register";
import Bikes from "./pages/Bikes";
import RoutesPage from "./pages/Routes";
import Activities from "./pages/Activities";
import Profile from "./pages/Profile";


const { Header, Content, Footer } = Layout;

function LayoutWrapper() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const isLogin = location.pathname === "/login";
  const isRegister = location.pathname === "/register";
  //const isHome = location.pathname === "/home";

  // No muestro el navbar ni en el Login ni en el registro

  const hideNavbar = isLogin || isRegister;

  // Centro contenido en login, registro y home;

  const centerContent = isLogin || isRegister;

  return (
    <Layout
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      {!hideNavbar && (
        <Header>
          <Navbar showMenuItems={true} />
        </Header>
      )}

      <Content
        style={{
          display: "flex",
          justifyContent: centerContent  ? "center" : "flex-start",
          alignItems: centerContent  ? "center" : "flex-start",
          padding: centerContent  ? "0px" : "20px",
          flex: 1,
          overflow: centerContent ? "hidden" : "auto",
          minHeight: 0,
        }}
      >
        {/*Ruta por defecto*/}
        <Routes>
          <Route
            path="/"
            element={
              <Navigate to={isAuthenticated ? "/home" : "/login"} replace />
            }
          />

          {/*Ruta Pública*/}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          {/*Ruta a registro*/}
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfUse />} />

          {/* Ruta Protegida */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          <Route
            path="/bikes"
            element={
              <ProtectedRoute>
                <Bikes />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/routes"
            element={
              <ProtectedRoute>
                <RoutesPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/activities"
            element={
              <ProtectedRoute>
                <Activities />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/*Ruta 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Content>

      {/* Footer - Se muestra excepto en Home
      {(!isLogin || !isRegister) && (
        <Footer style={{ padding: 0, marginTop: "auto" }}>
          <CustomFooter />
        </Footer>
      )} */}

      {(!isLogin && !isRegister) && (
        <Footer style={{ padding: 0, marginTop: "auto"}}>
          <FooterMinimal />
        </Footer>
      )}
    </Layout>
  );
}

function App() {
  return (
    <AuthProvider>
      <BikeProvider>
        <StatsProvider>
          <RouteProvider>
        <Router>
          <LayoutWrapper />
        </Router>
          </RouteProvider>
        </StatsProvider>
      </BikeProvider>
    </AuthProvider>
  );
}

export default App;
