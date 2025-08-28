import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Layout } from "antd"; // solo el componente
import './App.css'; // tus estilos si quieres mantenerlos
import Login from './pages/Login';
import Navbar from './components/Navbar';


const { Header, Content, Footer } = Layout;

function LayoutWrapper() {
  const location = useLocation();
  const isLogin = location.pathname === "/login";

  return (
    <Layout style={{ minHeight: "100vh", height: "100vh", overflow: "hidden" }}>
      <Header>
        <Navbar showMenuItems={!isLogin} />
      </Header>

      <Content
        style={{
          display: "flex",
          justifyContent: isLogin ? "center" : "flex-start",
          alignItems: isLogin ? "center" : "flex-start",
          padding: isLogin ? "0" : "20px",
          flex: 1,
          overflow: "hidden"
        }}
      >
         <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Content>

      <Footer style={{ textAlign: "center" }}>
        Jesús González © 2025 BikeAndRide
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
