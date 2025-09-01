import React from "react";
import { Form } from "antd";

function Login() {
  const onFinish = (values) => {
    console.log("Datos enviados:", values);
  };

  return (
    <>
      {/* CSS incorporado directamente para evitar problemas de carga */}
      <style>{`
        @import url("https://fonts.googleapis.com/css?family=Poppins:200,300,400,500,600,700,800,900&display=swap");
        @import url("https://use.fontawesome.com/releases/v6.5.1/css/all.css");

        * {
          font-family: "Poppins", sans-serif;
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }


        @property --a {
          syntax: "<angle>";
          inherits: false;
          initial-value: 0deg;
        }

         .login-page-container {
           display: flex;
           justify-content: center;
           align-items: center;
           width: 100%,
           height: 100%,
           background: #25252b;
           font-family: "Poppins", sans-serif;
         }

        .animated-box {
          position: relative;
          width: 400px;
          height: 200px;
          background: repeating-conic-gradient(
            from var(--a),
            #fca311 0%,
            #fca311 5%,
            transparent 5%,
            transparent 40%,
            #fca311 50%
          );
          filter: drop-shadow(0 15px 50px #000);
          border-radius: 20px;
          animation: rotating 4s linear infinite;
          display: flex;
          justify-content: center;
          align-items: center;
          transition: 0.5s;
        }

        @keyframes rotating {
          0% { --a: 0deg; }
          100% { --a: 360deg; }
        }

        .animated-box::before {
          content: "";
          position: absolute;
          width: 100%;
          height: 100%;
          background: repeating-conic-gradient(
            from var(--a),
            #48e 0%,
            #48e 5%,
            transparent 5%,
            transparent 40%,
            #48e 50%
          );
          filter: drop-shadow(0 15px 50px #000);
          border-radius: 20px;
          animation: rotating 4s linear infinite;
          animation-delay: -1s;
        }

        .animated-box::after {
          content: "";
          position: absolute;
          inset: 4px;
          background: #2d2d39;
          border-radius: 15px;
          border: 8px solid #25252b;
        }

        .animated-box:hover {
          width: 450px;
          height: 550px;
        }

        .animated-box:hover .login-area {
          inset: 40px;
        }

        .animated-box:hover .login-content {
          transform: translateY(0px);
        }

        .login-area {
          position: absolute;
          inset: 60px;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          border-radius: 10px;
          background: #fca311;
          color: #fff;
          z-index: 1000;
          box-shadow: inset 0 10px 20px #00000080;
          border-bottom: 2px solid #ffffff80;
          transition: 0.5s;
          overflow: hidden;
        }

        .login-content {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          gap: 20px;
          width: 90%;
          transform: translateY(126px);
          transition: 0.5s;
        }

        .logo-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 15px;
          margin-bottom: 10px;
        }

        .app-logo {
          width: 60px;
          height: 60px;
          filter: drop-shadow(0 4px 8px rgba(255, 39, 112, 0.3));
          transition: all 0.3s ease;
        }

        .app-logo:hover {
          transform: scale(1.1);
          filter: drop-shadow(0 4px 12px rgba(255, 39, 112, 0.5));
        }

        .app-title {
          text-transform: uppercase;
          font-weight: 600;
          letter-spacing: 0.2em;
          font-size: 1.2rem;
          text-align: center;
          margin: 0;
          color: #fff;
        }

        .app-title i {
          color: #48e;
          text-shadow: 0 0 5px #fca311, 0 0 20px #fca311;
          margin-right: 8px;
        }

        .bike-form {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .bike-input {
          width: 100%;
          padding: 10px 20px;
          outline: none;
          border: 2px solid #fff;
          border-radius: 30px;
          font-size: 1em;
          color: #48e;
          background: #0000001a;
          transition: all 0.3s ease;
          font-family: "Poppins", sans-serif;
        }

        .bike-input::placeholder {
          color: #000;
        }

        .bike-input:focus,
        .bike-input:hover {
          border-color: #48e;
          box-shadow: 0 0 10px rgba(69, 243, 255, 0.3);
          background: #00000033;
        }

        .bike-submit {
          width: 100%;
          padding: 12px 20px;
          background: #48e;
          border: none;
          border-radius: 30px;
          font-weight: 500;
          color: #111;
          cursor: pointer;
          transition: 0.1s;
          font-size: 1em;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-family: "Poppins", sans-serif;
        }

        .bike-submit:hover {
          box-shadow: 0 0 10px #48e, 0 0 60px #48e;
          transform: translateY(-2px);
        }

        .bike-submit:active {
          transform: translateY(0);
        }

        .link-group {
          width: 100%;
          display: flex;
          justify-content: space-between;
          gap: 10px;
          margin-top: 10px;
        }

        .link-btn {
          background: none;
          border: none;
          color: #fff;
          font-size: 0.85rem;
          cursor: pointer;
          font-family: "Poppins", sans-serif;
          padding: 0;
          transition: all 0.1s ease;
          text-decoration: none;
        }

        .link-btn:hover {
          text-shadow: 0 0 5px rgba(255, 255, 255, 0.8);
        }

        .link-btn.register {
          color: #48e;
          font-weight: 600;
        }

        .link-btn.register:hover {
          text-shadow: 0 0 5px #48e, 0 0 15px #48e;
        }

        /* Override para Ant Design */
        .ant-form-item {
          margin-bottom: 0 !important;
        }

        .ant-form-item-explain-error {
          color: #fca311 !important;
          font-size: 0.8rem !important;
          margin-top: 5px !important;
          text-align: center !important;
        }

        /* Responsive */
        @media (max-width: 480px) {
          .animated-box {
            width: 350px;
            height: 180px;
          }
          
          .animated-box:hover {
            width: 380px;
            height: 500px;
          }
          
          .login-content {
            width: 95%;
          }
          
          .app-title {
            font-size: 1rem;
          }
          
          .app-logo {
            width: 50px;
            height: 50px;
          }
          
          .link-group {
            flex-direction: column;
            align-items: center;
            gap: 8px;
          }
        }
      `}</style>

      <div className="login-page-container">
        <div className="animated-box">
          <div className="login-area">
            <div className="login-content">
              
              {/* Sección del logo */}
              <div className="logo-section">
                {/* <img 
                  src="/icons/icono.svg" 
                  alt="Bike And Ride logo"
                  className="app-logo"
                /> */}
                <h2 className="app-title">
                  <i className="fa-solid fa-bicycle"></i>
                  BIKE AND RIDE
                </h2>
              </div>

              {/* Formulario */}
              <Form
                name="login"
                onFinish={onFinish}
                className="bike-form"
              >
                <Form.Item
                  name="username"
                  rules={[
                    { required: true, message: "Por favor, introduce tu usuario!" }
                  ]}
                >
                  <input 
                    className="bike-input"
                    placeholder="Usuario"
                    autoComplete="username"
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  rules={[
                    { required: true, message: "Por favor, introduce tu contraseña!" }
                  ]}
                >
                  <input 
                    className="bike-input"
                    type="password"
                    placeholder="Contraseña"
                    autoComplete="current-password"
                  />
                </Form.Item>

                <Form.Item>
                  <button 
                    type="submit" 
                    className="bike-submit"
                  >
                    Sign In
                  </button>
                </Form.Item>
              </Form>

              {/* Links */}
              <div className="link-group">
                <button 
                  className="link-btn"
                  type="button" 
                  onClick={() => console.log("Forgot password clicked")}
                >
                  ¿Olvidaste tu password?
                </button>
                <button 
                  className="link-btn register"
                  type="button" 
                  onClick={() => console.log("Register clicked")}
                >
                  ¡Regístrate aquí!
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;