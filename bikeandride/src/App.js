import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { Layout } from "antd"; // solo el componente
import "./App.css"; // tus estilos si quieres mantenerlos
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
  const isHome = location.pathname === "/home";

  return (
    <Layout
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      {!isLogin && (
        <Header>
          <Navbar showMenuItems={!isLogin} />
        </Header>
      )}

      <Content
        style={{
          display: "flex",
          justifyContent: isLogin ? "center" : "flex-start",
          alignItems: isLogin ? "center" : "flex-start",
          padding: isLogin ? "20px" : "20px",
          flex: 1,
          overflow: "auto",
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
