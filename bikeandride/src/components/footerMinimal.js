import React from "react";
import { Typography, Row, Col } from "antd";
import { Link as RouterLink } from "react-router-dom";
import {
  InstagramOutlined,
  LinkedinFilled,
  GithubOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

function FooterMinimal() {
  const footerStyle = {
    backgroundColor: "#001529",
    padding: "20px 50px",
    marginTop: "auto",
    width: "100%"
  };

  const socialIconStyle = {
    fontSize: "20px",
    color: "rgba(255, 255, 255, .65)",
    marginLeft: "16px",
    cursor: "pointer",
    transition: "color 0.3s",
  };

  const handleSocialHover = (e) => {
    e.currentTarget.style.color = "#1890ff";
  };

  const handleSocialLeave = (e) => {
    e.currentTarget.style.color = "rgba(255, 255, 255, .65)";
  };

  return (
    <footer style={footerStyle}>
      <Row justify="space-between" align="middle">
        <Col
          xs={24}
          sm={24}
          md={8}
          style={{ textAlign: "center", marginBottom: "8px" }}
        >
          <Text
            style={{ color: "rgba(255, 255, 255, 0.45)", fontSize: "13px" }}
          >
            &copy; 2025 Bike&Ride. Todos los derechos reservados.
          </Text>
        </Col>
        {/* Redes Sociales */}
        <Col xs={24} sm={24} md={8} style={{ textAlign: "center" }}>
          <GithubOutlined
            style={socialIconStyle}
            onClick={() =>
              window.open("https://github.com/JesusGonzalez82", "_blank")
            }
            onMouseEnter={handleSocialHover}
            onMouseLeave={handleSocialLeave}
          />
          <LinkedinFilled
            style={socialIconStyle}
            onClick={() =>
              window.open(
                "https://www.linkedin.com/in/jesus-gonzalez-blanco-web/",
                "_blank"
              )
            }
            onMouseEnter={handleSocialHover}
            onMouseLeave={handleSocialLeave}
          />
          <InstagramOutlined
            style={socialIconStyle}
            onClick={() =>
              window.open("https://www.instagram.com/chuso1982mtb/", "_blank")
            }
            onMouseEnter={handleSocialHover}
            onMouseLeave={handleSocialLeave}
          />
        </Col>

        {/* Enlaces a pagínas legales */}
        <Col xs={24} sm={24} md={8} style={{ textAlign: "center" }}>
          <RouterLink
            to="/privacy"
            style={{
              color: "rgba(255, 255, 255, 0.45)",
              marginRight: "16px",
              fontSize: "13px",
              textDecoration: "none",
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = "#1890ff"}
            onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255, 255, 255, 0.65)"}
          >
            Política de Privacidad
          </RouterLink>
          <RouterLink
            to="/terms"
            style={{
              color: "rgba(255, 255, 255, 0.45)",
              fontSize: "13px",
              textDecoration: "none",
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = "#1890ff"}
            onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255, 255, 255, 0.65)"}
          >
            Terminos de Uso
          </RouterLink>
        </Col>
      </Row>
    </footer>
  );
}

export default FooterMinimal;
