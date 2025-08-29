import React from "react";
import { Menu, Typography } from "antd";

const { Title } = Typography;

function Navbar({ showMenuItems = true }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', width: "100%", height: "100%"}}>
      
      {/* Icono SIEMPRE a la izquierda */}
      {/* <img 
        src="/icons/icono.svg"
        alt="BikeAndRide Logo" 
        style={{ 
          width: '64px', 
          height: '64px',
          marginRight: '0px',
          opacity: "0.8"
        }} 
      /> */}
      
      {/* Contenedor para título y menú */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        width: '100%',
        justifyContent: showMenuItems ? 'flex-start' : 'center'
      }}>
        
        <Title level={3} style={{ color: 'white', margin: showMenuItems ? '0 24px 0 0' : '0' }}>
          Bike And Ride
        </Title>
        
        {showMenuItems && (
          <Menu mode="horizontal" theme="dark" style={{ flex: 1, border: 'none' }}>
            <Menu.Item key="home">Home</Menu.Item>
            <Menu.Item key="about">About</Menu.Item>
            <Menu.Item key="contact">Contact</Menu.Item>
          </Menu>
        )}
      </div>
    </div>
  );
}

export default Navbar;