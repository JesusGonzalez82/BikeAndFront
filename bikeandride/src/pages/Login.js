import React from "react";
import { Form, Input, Button,} from "antd";


// const { Title, Text } = Typography;

function Home() {
  const onFinish = (values) => {
    console.log("Datos enviados:", values);
  };

  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      justifyContent: "center", 
      height: "100vh" 
    }}>
      <img src="/icons/icono.svg" alt="Bike And Ride logo"
      style={{
        width: "180x",
        height: "180px",
        marginBottom: "20px",
        transition: "transform 0.3s ease",
        cursor: "pointer"
      }}
      onMouseEnter={(e) => e.target.style.transform = 'scale(1.5)'}
      onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
      />
      
      {/* <Title level={1}>BIKE AND RIDE</Title>
      <Text type="secondary">@2025. Proyecto Desarrollo Aplicaciones Web</Text> */}

      <Form
        name="login"
        onFinish={onFinish}
        style={{ width: 300, marginTop: 20 }}
        layout="vertical"
      >
        <Form.Item
          label="Usuario"
          name="username"
          rules={[{ required: true, message: "Por favor, introduce tu usuario!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Por favor, introduce tu contraseña!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Sign In
          </Button>
        </Form.Item>
      </Form>

      <div style={{ marginTop: 10 }}>
        <a href="#">¿Olvidaste tu password?</a>
      </div>
      <div>
        <a href="#">¿Eres nuevo? Regístrate aquí!</a>
      </div>
    </div>
  );
}

export default Home;

