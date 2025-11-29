import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { Layout, App as AntApp, Button } from "antd";
import "./App.css";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import FooterMinimal from "./components/footerMinimal";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfUse from "./pages/TermsOfUse";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { BikeProvider } from "./context/BikeContext";
import { StatsProvider } from "./context/StatsContext";
import { RouteProvider } from "./context/RouteContext";
import { ActivityProvider } from "./context/ActivityContext";
import { ProtectedRoute, PublicRoute } from "./components/ProtectedRoute";
import Register from "./pages/register";
import Bikes from "./pages/Bikes";
import RoutesPage from "./pages/Routes";
import Activities from "./pages/Activities";
import Profile from "./pages/Profile";
import Statistics from "./pages/Statistics";

//import FloatingAddButton from "./components/FloatingButton";

const { Header, Content, Footer } = Layout;

function UnderConstruction() {
  const navigate = useNavigate();
  
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center', 
      width:"100%",
      height: "100%",
      minHeight: '60vh',
      padding: '40px'
    }}>
      <div style={{ fontSize: '80px', marginBottom: '20px' }}>🚧</div>
      <h1 style={{ fontSize: '32px', marginBottom: '16px', color: '#1890ff' }}>
        En Construcción
      </h1>
      <p style={{ fontSize: '16px', color: '#8c8c8c', marginBottom: '32px', textAlign: 'center' }}>
        Estamos trabajando en esta sección. <br />
        ¡Pronto estará disponible!
      </p>
      <Button type="primary" size="large" onClick={() => navigate('/home')}>
        Volver al Inicio
      </Button>
    </div>
  );
}

function LayoutWrapper() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const isLogin = location.pathname === "/login";
  const isRegister = location.pathname === "/register";
  const isUnderConstruction = location.pathname === "/statistics";

  const hideNavbar = isLogin || isRegister;
  const centerContent = isLogin || isRegister || isUnderConstruction;

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
          justifyContent: centerContent ? "center" : "flex-start",
          alignItems:  centerContent ? "center" : "flex-start",
          padding: centerContent ? "0px" : "20px",
          flex: 1,
          overflow: "auto",
          minHeight: 0,
        }}
      >
        <Routes>
          <Route
            path="/"
            element={
              <Navigate to={isAuthenticated ? "/home" : "/login"} replace />
            }
          />

          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

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
            path="/statistics"
            element={
              <ProtectedRoute>
                <UnderConstruction />
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

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Content>

      {/* {!hideNavbar && <FloatingAddButton />} */}

      {(!isLogin && !isRegister) && (
        <Footer style={{ padding: 0, marginTop: "auto" }}>
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
        <RouteProvider>
          <ActivityProvider>
            <StatsProvider>
              <AntApp>
              <Router>
                <LayoutWrapper />
              </Router>
              </AntApp>
            </StatsProvider>
          </ActivityProvider>
        </RouteProvider>
      </BikeProvider>
    </AuthProvider>
  );
}

export default App;