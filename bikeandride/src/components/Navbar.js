import React, { useState, useEffect } from "react";
import { Menu, Avatar, Dropdown, Space, Modal, FloatButton } from "antd"; 
import { Link, useLocation, useNavigate } from "react-router-dom"; 
import {
  UserOutlined,
  LogoutOutlined,
  HomeOutlined,
  DashboardFilled,
  EnvironmentOutlined,
  TrophyOutlined,
  MailOutlined,
  PhoneOutlined,
  GithubOutlined,
  LinkedinFilled,
  InstagramOutlined,
  RiseOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useAuth } from "../context/AuthContext";
import { getProfileImage } from "../services/imageService";

function Navbar({ showMenuItems = true }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isContactModalOpen, setIsContactModalOpen] = React.useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const isHome = location.pathname === '/home';

  const addMenuItems = [
    {
      key: "add-bike",
      icon: <i className="fa-solid fa-bicycle" style={{ fontSize: '14px' }}></i>,
      label: "Bici nueva",
      onClick: () => navigate('/bikes?action=create'),
    },
    {
      key: "add-route",
      icon: <EnvironmentOutlined />,
      label: "Nueva Ruta",
      onClick: () => navigate('/routes?action=create'),
    },
    {
      key: "add-activity",
      icon: <TrophyOutlined />,
      label: "Nueva Actividad",
      onClick: () => navigate("/activities?action=create"),
    },
  ];

  useEffect(() => {
    const loadProfileImage =async () => {
      if (user && user.idUser) {
        console.log("=== CARGANDO IMAGEN DE PERFIL EN NAVBAR ===");
        console.log("User ID: ", user.idUser);
        try{
          const imageUrl = await getProfileImage(user.idUser);
          // console.log("Imagen cargada en navbar: ", imageUrl);
          setProfileImageUrl(imageUrl);
        }catch (error){
          console.log("No se pudo cargar la foto de perfil en navbar: ", error);
          setProfileImageUrl(null);
        }
      }
    };
    loadProfileImage();
  }, [user]);

  const userMenuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Mi Perfil",
      onClick: () => navigate('/profile'),
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Cerrar Sesión",
      onClick: logout,
      danger: true,
    },
  ];

  const showContactModal = () => {
    setIsContactModalOpen(true);
  };

  const handleContactClose = () => {
    setIsContactModalOpen(false);
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        padding: "0 24px",
      }}
    >
      <Link to="/home" style={{ textDecoration: "none" }}>
        <Space align="center">
          <i
            className="fa-solid fa-bicycle"
            style={{
              fontSize: "28px",
              color: "#48e", // ← Mismo azul del login
              textShadow: "0 0 10px rgba(68, 136, 238, 0.5)", // ← Brillo sutil
            }}
          />
          <span
            style={{
              color: "white",
              fontSize: "20px",
              fontWeight: "bold",
            }}
          >
            Bike & Ride
          </span>
        </Space>
      </Link>

      {showMenuItems && (
        <Menu
          mode="horizontal"
          theme="dark"
          selectedKeys={[location.pathname]} // ← Marca la página actual
          style={{
            flex: 1,
            border: "none",
            marginLeft: "50px",
            minWidth: 0,
          }}
        >
          {isHome ? (
            <Menu.Item key="contact" icon={<MailOutlined />} onClick={showContactModal}>
              Contacto
            </Menu.Item>
          ) : (
            <>
          <Menu.Item key="/home" icon={<HomeOutlined />}>
            <Link to="/home">Home</Link>
          </Menu.Item>

          <Menu.Item key="/bikes" icon={<i className="fa-solid fa-bicycle" style={{ fontSize: '14px' }}></i>}>
            <Link to="/bikes">Bicicletas</Link>
          </Menu.Item>

          <Menu.Item key="/routes" icon={<EnvironmentOutlined/>}>
            <Link to="/routes">Rutas</Link>
          </Menu.Item>

          <Menu.Item key="/activities" icon={<TrophyOutlined />}>
            <Link to="/activities">Actividades</Link>
          </Menu.Item>

          <Menu.Item key="/statistics" icon={<RiseOutlined />}>
            <Link to="/statistics">Estadísticas</Link>
          </Menu.Item>

          <Menu.Item key="contact" icon={<MailOutlined />} onClick={showContactModal}>
            Contacto
          </Menu.Item>
          </>
          )}
        </Menu>
      )}

      {showMenuItems && user && (
        <Dropdown
          menu={{ items: addMenuItems }}
          placement="bottomRight"
          trigger={["click"]}
        >
          <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              // background: 'linear-gradient(135deg, #fa8c16 0%, #faad14 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              marginRight: '16px',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 8px rgba(250, 140, 22, 0,3)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(250, 140, 22, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(250, 140, 22, 0.3)';
          }}
          >
            <PlusOutlined style={{ fontSize: '20px', color: '#fff'}} />
          </div>
        </Dropdown>
      )}



      {showMenuItems && user && (
        <Dropdown
          menu={{ items: userMenuItems }}
          placement="bottomRight"
          trigger={["click"]}
        >
          <Space style={{ cursor: "pointer", paddingLeft: "16px" }}>
            <Avatar
              style={{ 
                backgroundColor: profileImageUrl ? "transparent" : "#1890ff",
                border: profileImageUrl ? "2px solid #fff" : "none"
              }}
              icon={!profileImageUrl ? <UserOutlined /> : null}
              src={profileImageUrl}
            >
              {!profileImageUrl && user.name ? user.name.charAt(0).toUpperCase() : null}
            </Avatar>
            <span style={{ color: "#fff" }}>{user.name || "Usuario"}</span>
          </Space>
        </Dropdown>
      )}
<Modal
  title={
    <span style={{ fontSize: '18px', fontWeight: 'bold', textAlign: 'center',
      display:'block'}}>
      <MailOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
      
      Contacto
    </span>
  }
  open={isContactModalOpen}
  onCancel={handleContactClose}
  footer={null}
  width={500}
>
  <div style={{ padding: '20px 0' }}>

<div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
  <MailOutlined style={{ fontSize: '20px', color: '#1890ff', marginRight: '12px' }} />
  <div>
    <div style={{ fontWeight: '500', marginBottom: '4px' }}>Email</div>
    <a
      href="mailto:jgblanco82@yahoo.es"
      style={{ color: '#595959', textDecoration: 'none' }}
    >
      jgblanco82@yahoo.es
    </a>
  </div>
</div>

<div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
  <PhoneOutlined style={{ fontSize: '20px', color: '#52c41a', marginRight: '12px' }} />
  <div>
    <div style={{ fontWeight: '500', marginBottom: '4px' }}>Teléfono</div>
    <a
      href="tel:+34657761163"
      style={{ color: '#595959', textDecoration: 'none' }}
    >
      +34 657 76 11 63
    </a>
  </div>
</div>

<div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center' }}>
  <EnvironmentOutlined style={{ fontSize: '20px', color: '#fa8c16', marginRight: '12px' }} />
  <div>
    <div style={{ fontWeight: '500', marginBottom: '4px' }}>Ubicación</div>
    <a
      href="https://www.google.com/maps?q=El+Molar ,+Madrid"
      target="_blank"
      rel="noopener noreferrer"
      style={{ color: '#595959', textDecoration: 'none' }}
    >
      El Molar, Madrid
    </a>
  </div>
</div>

    {/* Redes Sociales */}
    <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '20px', textAlign: 'center' }}>
    <div style={{ fontWeight: '500', marginBottom: '12px' }}>Sígueme en:</div>
    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
        <GithubOutlined
          style={{ fontSize: '28px', color: '#595959', cursor: 'pointer', transition: 'color 0.3s' }}
          onClick={() => window.open("https://github.com/JesusGonzalez82", "_blank")}
          onMouseEnter={(e) => e.currentTarget.style.color = '#1890ff'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#595959'}
        />
        <LinkedinFilled
          style={{ fontSize: '28px', color: '#595959', cursor: 'pointer', transition: 'color 0.3s' }}
          onClick={() => window.open("https://www.linkedin.com/in/jesus-gonzalez-blanco-web/", "_blank")}
          onMouseEnter={(e) => e.currentTarget.style.color = '#0077b5'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#595959'}
        />
        <InstagramOutlined
          style={{ fontSize: '28px', color: '#595959', cursor: 'pointer', transition: 'color 0.3s' }}
          onClick={() => window.open("https://www.instagram.com/chuso1982mtb/", "_blank")}
          onMouseEnter={(e) => e.currentTarget.style.color = '#E4405F'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#595959'}
        />
      </div>
    </div>
  </div>
</Modal>
    </div>
  );
}

export default Navbar;
