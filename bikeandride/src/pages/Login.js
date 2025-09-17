import React, { useEffect, useState } from "react";
import { Form, message, Modal } from "antd";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

message.config({
  top: 100,
  duration: 5,
  maxCount: 3,
});

function Login() {
  const [form] = Form.useForm();
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();


  // Datos de conexion a la API

  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:";
  const LOGIN_ENDPOINT = "/api/auth/login";

  // Cargar los datos guardado al montar el componente
  useEffect(() => {
    const savedUserName = localStorage.getItem("rememberedUsername");
    const savedRememberMe = localStorage.getItem("rememberMe") === "true";

    if (savedUserName && savedRememberMe) {
      form.setFieldsValue({
        username: savedUserName,
        remember: true,
      });
      setRememberMe(true);
    }
  }, [form]);

  // Simulación de Autenticacion mientras no tenga la API real

  const simulateAuth = async (username, password) => {
  setLoading(true);

  await new Promise((resolve) => setTimeout(resolve, 1500));

  if (username === "admin" && password === "admin") {
    const mockUser = {
      id: 1,
      username: "admin",
      fullName: "El gran Admin",
      email: "emailDelAdmin@superAdmin.com",
    };
    
    const mockToken = "mock-jwt-token-12345";
    login(mockUser, mockToken);

    navigate("/Home")
    
    setLoading(false);
    return true;
  } else {
    console.log('Credenciales incorrectas - mostrando error');
    
    // Usar alert nativo para el error
    setTimeout(() => {
      window.alert('❌ Credenciales incorrectas\n\nPara esta versión de prueba usa:\nUsuario: admin\nContraseña: admin');
    }, 100);
    
    setLoading(false);
    return false;
  }
};

  // Funcion para autenticar cuando tenga opeativo el backend
  /*
  const authenticatedWithAPI = async(username, password) =>{
    setLoading(true);

    try{
      const response = await fetch('${API_BASE_URL}${LOGIN_ENDPOINT}',{
        method: 'POST',
        headers:{
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });
      if(!response.ok){
        let errorMessage = 'Error al iniciar sesión';

        if(response.status === 401){
          errorMessage = 'Usuario o contraseña incorrectos';
        }else if (response.status === 404){
          errorMessage = 'EndPoint no encontrado. Verifica que la aplicacion este inicializada'
        }else if (response.status === 500){
          errorMessage = 'Error interno en el servidor';
        }
      try{
          const errorData = await response.json();
          if (errorData.message){
            errorMessage = errorData.message;
          }
        }catch(e){}

        throw new Error(errorMessage);
      }

      const data = await response.json();

      // Usamos el contexto para hacer login
      login(data.user, data.token);

      message.success('Bienvenido, ${data.user?.fullname || data.user?.username');
      navigate('/Home');

      return true;
    }catch (error){
      console.error('Error de autenticación:', error);
      message.error(error.message || 'Error al iniciar sesión');
      return false;
    }finally{
      setLoading(false);
    }
  }
*/
  const onFinish = async (values) => {
    console.log("Datos enviados:", values);

    // Manejamos el boton "Recuerdame"

    if (values.remember) {
      localStorage.setItem("rememberedUsername", values.username); // Consistente
      localStorage.setItem("rememberMe", "true");
    } else {
      localStorage.removeItem("rememberedUsername"); // Mismo nombre
      localStorage.removeItem("rememberMe");
    }

    // Usar simulateAuth, cambiar por authenticatedWithAPI cuando este el back terminado

    await simulateAuth(values.username, values.password);
    // await authenticatedWithAPI(values.usernamo, values.password);
  };

  const handleRememberChange = (e) => {
    setRememberMe(e.target.checked);
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
          z-index: 100;
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
          gap: 5px;
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
          padding: 0vh 30px;
          outline: none;
          border: 2px solid #fff;
          border-radius: 30px;
          font-size: 1em;
          color: #000;
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
          background: #fff;
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
          .bike-submit:disabled {
            background: #666;
            cursor: not-allowed;
            opacity: 0.6;
        }

        .bike-submit:disabled:hover {
          transform: none;
          box-shadow: none;
        }

        .remember-me-container {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 5px 0;
  justify-content: center;
}

.custom-checkbox {
  position: relative;
  display: inline-block;
  width: 18px;
  height: 18px;
}

.custom-checkbox input[type="checkbox"] {
  opacity: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  cursor: pointer;
  z-index: 1;
}

.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 18px;
  width: 18px;
  background-color: transparent;
  border: 2px solid #fff;
  border-radius: 3px;
  transition: all 0.3s ease;
}

.custom-checkbox input[type="checkbox"]:checked ~ .checkmark {
  background-color: #48e;
  border-color: #48e;
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
  left: 4px;
  top: 1px;
  width: 3px;
  height: 8px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.custom-checkbox input[type="checkbox"]:checked ~ .checkmark:after {
  display: block;
}

.remember-label {
  color: #fff;
  font-size: 0.85rem;
  cursor: pointer;
}

.ant-message {
  z-index: 10000 !important;
}

.ant-message {
  z-index: 10000 !important;
  position: fixed !important;
  top: 100px !important;
}

.ant-message-notice {
  z-index: 10000 !important;
}

.ant-message-notice-wrapper {
  z-index: 10000 !important;
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
                form={form}
                name="login"
                onFinish={onFinish}
                className="bike-form"
                initialValues={{ remember: false }}
              >
                <Form.Item
                  name="username"
                  rules={[
                    {
                      required: true,
                      message: "Por favor, introduce tu usuario!",
                    },
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
                    {
                      required: true,
                      message: "Por favor, introduce tu contraseña!",
                    },
                  ]}
                >
                  <input
                    className="bike-input"
                    type="password"
                    placeholder="Contraseña"
                    autoComplete="current-password"
                  />
                </Form.Item>

                <Form.Item name="remember" valuePropName="checked">
                  <div className="remember-me-container">
                    <label className="custom-checkbox">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={handleRememberChange}
                      />
                      <span className="checkmark"></span>
                    </label>
                    <label
                      className="remember-label"
                      onClick={() => setRememberMe(!rememberMe)}
                    >
                      Recordarme
                    </label>
                  </div>
                </Form.Item>

                <Form.Item>
                  <button
                    type="submit"
                    className="bike-submit"
                    disabled={loading} // Agregar disabled
                  >
                    {loading ? "Iniciando sesión..." : "Sign In"}{" "}
                    {/* Agregar texto de loading */}
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
