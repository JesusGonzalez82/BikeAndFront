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
import CustomFooter from "./components/footer";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfUse from "./pages/TermsOfUse";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ProtectedRoute, PublicRoute } from "./components/ProtectedRoute";

const { Header, Content, Footer } = Layout;

function LayoutWrapper() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const isLogin = location.pathname === "/login";
  const isRegister = location.pathname === "/register";
  const isHome = location.pathname === "/home";

  // No muestro el navbar ni en el Login ni en el registro

  const hideNavbar = isLogin || isRegister;

  // Centro contenido en login, registro y home;

  const centerContent = isLogin || isRegister || isHome;

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

          {/*Ruta 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Content>

      {/*Footer - Se muestra excepto en Home*/}
      {!isHome && (
        <Footer style={{ padding: 0, marginTop: "auto" }}>
          <CustomFooter />
        </Footer>
      )}
    </Layout>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <LayoutWrapper />
      </Router>
    </AuthProvider>
  );
}

export default App;
