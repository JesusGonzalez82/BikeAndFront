import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Layout } from "antd"; // solo el componente
import './App.css'; // tus estilos si quieres mantenerlos
import Login from './pages/Login';
import Home from './pages/home';
import Navbar from './components/Navbar';
import CustomFooter from './components/footer'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfUse from "./pages/TermsOfUse";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ProtectedRoute, PublicRoute } from "./components/ProtectedRoute";


const { Header, Content, Footer } = Layout;

function LayoutWrapper() {
  const location = useLocation();
  const isLogin = location.pathname === "/login";

  return (
    <Layout style={{ minHeight: "100vh", display: "flex", flexDirection: "column"  }}>
      <Header>
        <Navbar showMenuItems={!isLogin} />
      </Header>

      <Content
        style={{
          display: "flex",
          justifyContent: isLogin ? "center" : "flex-start",
          alignItems: isLogin ? "center" : "flex-start",
          padding: isLogin ? "20px" : "20px",
          flex: 1,
          overflow: "auto",
          minHeight: 0
        }}
      >
         <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfUse />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Content>


      <Footer style={{ padding: 0, marginTop: "auto" }}>
        <CustomFooter />
      </Footer>
    </Layout>
  );
}

function App() {
  return (
    <Router>
      <LayoutWrapper />
    </Router>
  );
}

export default App;
