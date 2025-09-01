import React from "react";
import { Typography, Row, Col, Divider } from "antd";
import {
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  InstagramOutlined,
  LinkedinFilled,
  GithubOutlined,
} from "@ant-design/icons";
import {Link as RouterLink} from "react-router-dom";


const { Title, Text } = Typography;

function Footer() {
  const footerStyle = {
    backgroundColor: "#001529",
    padding: "20px 24px 12px 24px",
    marginTop: "auto",
  };

  const socialIconStyle = {
    fontSize: "24px",
    color: "rgba(255, 255, 255, 0.65)",
    marginRight: "16px",
    cursor: "pointer",
    transition: "color 0.3s",
  };

  return (
    <footer style={footerStyle}>
      {/*Datos de Contacto*/}
      <Row justify="center">
        <Col style={{ textAlign: "center" }}>
          <Title
            level={5}
            style={{ color: "white", marginBottom: "12px", fontSize: "16px" }}
          >
            Contacto
          </Title>

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              marginBottom: "6px",
              marginRight: "20px",
            }}
          >
            <MailOutlined
              style={{ marginRight: "6px", color: "rgba(255, 255, 255, 0.65)" }}
            />
            <a
              href="mailto:jgblanco82@yahoo.es"
              style={{
                color: "rgba(255, 255, 255, 0.65)",
                fontSize: "13px",
                textDecoration: "none",
              }}
            >
              jgblanco82@yahoo.es
            </a>
          </div>

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              marginBottom: "6px",
              marginRight: "20px",
            }}
          >
            <PhoneOutlined
              style={{ marginRight: "6px", color: "rgba(255, 255, 255, 0.65)" }}
            />
            <a
              href="tel:+34657761163"
              style={{
                color: "rgba(255, 255, 255, 0.65)",
                fontSize: "13px",
                textDecoration: "none",
              }}
            >
              +34 657761163
            </a>
          </div>

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              marginBottom: "12px",
            }}
          >
            <EnvironmentOutlined
              style={{ marginRight: "6px", color: "rgba(255, 255, 255, 0.65)" }}
            />
            <a
              href="https://www.google.com/maps?q=El+Molar,+Madrid"
              target="_blank"
              rel="noopener, noreferrer"
              style={{ color: "rgba(255, 255, 255, 0.65)", fontSize: "13px" }}
            >
              El Molar, Madrid
            </a>
          </div>

          {/* Redes sociales */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <GithubOutlined
              style={{
                ...socialIconStyle,
                fontSize: "20px",
                marginRight: "12px",
              }}
              onClick={() =>
                window.open("https://github.com/JesusGonzalez82", "_blank")
              }
            />
            <LinkedinFilled
              style={{
                ...socialIconStyle,
                fontSize: "20px",
                marginRight: "12px",
              }}
              onClick={() =>
                window.open(
                  "https://www.linkedin.com/in/jesus-gonzalez-blanco-web/",
                  "_blank"
                )
              }
            />
            {/* <FacebookOutlined style={{ ...socialIconStyle, fontSize: '20px', marginRight: '12px' }} /> */}
            <InstagramOutlined
              style={{ ...socialIconStyle, fontSize: "20px", marginRight: "0" }}
              onClick={() =>
                window.open("https://www.instagram.com/chuso1982mtb/", "_blank")
              }
            />
          </div>
        </Col>
      </Row>

      <Divider
        style={{
          borderColor: "rgba(255, 255, 255, 0.2)",
          margin: "16px 0 8px 0",
        }}
      />

      {/* Copyright y Politicas */}
      <Row justify="space-between" align="middle">
        <Col>
          <Text style={{ color: "rgba(255, 255, 255, 0.45)", fontSize: "14px" }}>
            Jesús González Blanco © 2025 Bike And Ride. Todos los derechos reservados.
          </Text>
        </Col>
        <Col>
          <RouterLink to="/privacy" style={{ color: "rgba(255, 255, 255, 0.45)", marginRight: "16px", fontSize: "14px", textDecoration: "none" }}>
            Política de Privacidad
          </RouterLink>
          <RouterLink to="/terms" style={{ color: "rgba(255, 255, 255, 0.45)", fontSize: "14px", textDecoration: "none" }}>
            Términos de Uso
          </RouterLink>
        </Col>
      </Row>
    </footer>
  );
}

export default Footer;
