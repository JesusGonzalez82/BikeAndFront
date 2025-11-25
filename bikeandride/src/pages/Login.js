import React, { useEffect, useState } from "react";
import { Form, message } from "antd";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/userService";

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
  const [isExpanded, setIsExpanded] = useState(false);
  const [showReactivate, setShowReactivate] = useState(false);
  const [inactiveEmail, setInactiveEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Cargar datos guardados
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    const savedRememberMe = localStorage.getItem("rememberMe") === "true";
    if (savedEmail && savedRememberMe) {
      form.setFieldsValue({ email: savedEmail, remember: true });
      setRememberMe(true);
    }
  }, [form]);

  // FUNCIÓN SIMPLIFICADA - DETECTA DIRECTAMENTE EL 403
  const authenticatedWithAPI = async (email, password) => {
    setLoading(true);
    setShowReactivate(false);
    setErrorMessage(''); // Limpiar error anterior

    try {
      const userData = await loginUser(email, password);
      const mockToken = `token-${userData.idUser}-${Date.now()}`;
      login(userData, mockToken);
      message.success(`¡Bienvenido, ${userData.name}!`);
      navigate("/Home");
      return true;
      
    } catch (error) {
      console.error("=== ERROR COMPLETO ===", error);
      
      const errorStatus = error.response?.status;
      const errorData = error.response?.data || {};
      const backendMessage = errorData.error || error.message || "Error desconocido";

      console.log("errorStatus: ", errorStatus);
      console.log("error.response: ", error.response);

      // ==== DETECCIÓN DIRECTA - SIN COMPLICACIONES ====
      if (errorStatus === 403) {
        // **CUENTA INACTIVA**
        setInactiveEmail(email);
        setShowReactivate(true);
        setErrorMessage("⚠️ Cuenta suspendida. Usa el botón de abajo para reactivarla.");
      } else if (errorStatus === 401) {
        // **CREDENCIALES INCORRECTAS**
        setErrorMessage("❌ Email o contraseña incorrectos");
      } else {
        // **OTRO ERROR**
        setErrorMessage(`❌ ${backendMessage}`);
      }
      
      return false;
    } finally {
      setLoading(false);
    }
  };

const handleReactivate = async () => {
  console.log("=== INICIANDO REACTIVACIÓN ===");
  
  const userId = localStorage.getItem('deactivatedUserId');
  console.log("userId recuperado de localStorage:", userId);
  
  if (!userId) {
    console.log("❌ NO SE ENCONTRÓ userId en localStorage");
    message.error("No se pudo recuperar tu ID de usuario. Por favor, contacta con soporte.");
    return;
  }
  
  setLoading(true);
  try {
    const API_BASE_URL = process.env.REACT_APP_API_URL || "https://bikeback.yustaspace.es";
    console.log("API_BASE_URL:", API_BASE_URL);
    console.log("Llamando a:", `${API_BASE_URL}/users/${userId}/reactivate`);
    
    const response = await fetch(`${API_BASE_URL}/users/${userId}/reactivate`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' }
    });
    
    console.log("Response status:", response.status);
    console.log("Response ok:", response.ok);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.log("Error data:", errorData);
      throw new Error(errorData.error || 'Error al reactivar la cuenta');
    }
    
    const responseData = await response.json();
    console.log("✅ Reactivación exitosa:", responseData);
    
    message.success("✅ Cuenta reactivada con éxito!");
    localStorage.removeItem('deactivatedUserId');
    setShowReactivate(false);
    setInactiveEmail('');
    setErrorMessage('');
    
    // Auto-login después de reactivar
    const password = form.getFieldValue('password');
    console.log("Password para auto-login:", password ? "existe" : "NO existe");
    
    if (password) {
      await authenticatedWithAPI(inactiveEmail, password);
    }
  } catch (error) {
    console.error("❌ ERROR en reactivación:", error);
    message.error(`❌ ${error.message}`);
  } finally {
    setLoading(false);
  }
};

  const onFinish = async (values) => {
    console.log("Datos enviados:", values);
    
    if (values.remember) {
      localStorage.setItem("rememberedEmail", values.email);
      localStorage.setItem("rememberMe", "true");
    } else {
      localStorage.removeItem("rememberedEmail");
      localStorage.removeItem("rememberMe");
    }

    await authenticatedWithAPI(values.email, values.password);
  };

  const handleRememberChange = (e) => {
    setRememberMe(e.target.checked);
  };

  // **CORRECCIÓN DEL ERROR DE CHECKBOX**
  useEffect(() => {
    form.setFieldsValue({ remember: rememberMe });
  }, [rememberMe, form]);

  return (
    <>
      <style>{`
        /* === CSS COMPLETO CON MENSAJES VISIBLES === */
        @import url("https://fonts.googleapis.com/css?family=Poppins:200,300,400,500,600,700,800,900&display=swap");
        @import url("https://use.fontawesome.com/releases/v6.5.1/css/all.css");
        * { font-family: "Poppins", sans-serif; margin: 0; padding: 0; box-sizing: border-box; }
        @property --a { syntax: "<angle>"; inherits: false; initial-value: 0deg; }
        .login-page-container { display: flex; justify-content: center; align-items: center; width: 100%; height: 100vh; background: white; }
        .animated-box { position: relative; width: 400px; height: 200px; background: repeating-conic-gradient(from var(--a), #fca311 0%, #fca311 5%, transparent 5%, transparent 40%, #fca311 50%); filter: drop-shadow(0 15px 50px #000); border-radius: 20px; animation: rotating 4s linear infinite; display: flex; justify-content: center; align-items: center; transition: width 0.5s ease, height 0.5s ease; }
        @keyframes rotating { 0% { --a: 0deg; } 100% { --a: 360deg; } }
        .animated-box::before { content: ""; position: absolute; width: 100%; height: 100%; background: repeating-conic-gradient(from var(--a), #48e 0%, #48e 5%, transparent 5%, transparent 40%, #48e 50%); filter: drop-shadow(0 15px 50px #000); border-radius: 20px; animation: rotating 4s linear infinite; animation-delay: -1s; }
        .animated-box::after { content: ""; position: absolute; inset: 4px; background: #2d2d39; border-radius: 15px; border: 8px solid #25252b; }
        .animated-box.expanded { width: 450px; height: 550px; }
        .animated-box.expanded .login-area { inset: 40px; }
        .animated-box.expanded .login-content { transform: translateY(0px); }
        .animated-box:not(.expanded):hover { width: 450px; height: 550px; }
        .animated-box:not(.expanded):hover .login-area { inset: 40px; }
        .animated-box:not(.expanded):hover .login-content { transform: translateY(0); }
        .login-area { position: absolute; inset: 60px; display: flex; justify-content: center; align-items: center; flex-direction: column; border-radius: 10px; background: #fca311; color: #fff; z-index: 100; box-shadow: inset 0 10px 20px #00000080; border-bottom: 2px solid #ffffff80; transition: inset 0.5s ease; overflow: hidden; }
        .login-content { position: relative; display: flex; justify-content: center; align-items: center; flex-direction: column; gap: 5px; width: 90%; transform: translateY(126px); transition: transform 0.5s ease; }
        .logo-section { display: flex; flex-direction: column; align-items: center; gap: 15px; margin-bottom: 10px; }
        .app-logo { width: 60px; height: 60px; filter: drop-shadow(0 4px 8px rgba(255, 39, 112, 0.3)); transition: all 0.3s ease; }
        .app-logo:hover { transform: scale(1.1); filter: drop-shadow(0 4px 12px rgba(255, 39, 112, 0.5)); }
        .app-title { text-transform: uppercase; font-weight: 600; letter-spacing: 0.2em; font-size: 1.2rem; text-align: center; margin: 0; color: #fff; }
        .app-title i { color: #48e; text-shadow: 0 0 5px #fca311, 0 0 20px #fca311; margin-right: 8px; }
        .bike-form { width: 100%; display: flex; flex-direction: column; gap: 10px; }
        .bike-input { width: 100%; padding: 0 30px; outline: none; border: 2px solid #fff; border-radius: 30px; font-size: 1em; color: #000; background: #0000001a; transition: all 0.3s ease; }
        .bike-input::placeholder { color: #000; }
        .bike-input:focus, .bike-input:hover { border-color: #48e; box-shadow: 0 0 10px rgba(69, 243, 255, 0.3); background: #fff; }
        .bike-submit { width: 100%; padding: 12px 20px; background: #48e; border: none; border-radius: 30px; font-weight: 500; color: #111; cursor: pointer; transition: 0.1s; font-size: 1em; text-transform: uppercase; letter-spacing: 1px; }
        .bike-submit:hover { box-shadow: 0 0 10px #48e, 0 0 60px #48e; transform: translateY(-2px); }
        .bike-submit:active { transform: translateY(0); }
        .bike-submit:disabled { background: #666; cursor: not-allowed; opacity: 0.6; }
        .bike-submit:disabled:hover { transform: none; box-shadow: none; }
        .link-group { width: 100%; display: flex; justify-content: space-between; gap: 10px; margin-top: 10px; }
        .link-btn { background: none; border: none; color: #fff; font-size: 0.85rem; cursor: pointer; font-family: "Poppins", sans-serif; padding: 0; transition: all 0.1s ease; text-decoration: none; }
        .link-btn:hover { text-shadow: 0 0 5px rgba(255, 255, 255, 0.8); }
        .link-btn.register { color: #48e; font-weight: 600; }
        .link-btn.register:hover { text-shadow: 0 0 5px #48e, 0 0 15px #48e; }
        .remember-me-container { width: 100%; display: flex; align-items: center; gap: 8px; margin: 5px 0; justify-content: center; }
        .custom-checkbox { position: relative; display: inline-block; width: 18px; height: 18px; }
        .custom-checkbox input[type="checkbox"] { opacity: 0; width: 100%; height: 100%; position: absolute; cursor: pointer; z-index: 1; }
        .checkmark { position: absolute; top: 0; left: 0; height: 18px; width: 18px; background-color: transparent; border: 2px solid #fff; border-radius: 3px; transition: all 0.3s ease; }
        .custom-checkbox input[type="checkbox"]:checked ~ .checkmark { background-color: #48e; border-color: #48e; }
        .checkmark:after { content: ""; position: absolute; display: none; left: 4px; top: 1px; width: 3px; height: 8px; border: solid white; border-width: 0 2px 2px 0; transform: rotate(45deg); }
        .custom-checkbox input[type="checkbox"]:checked ~ .checkmark:after { display: block; }
        .remember-label { color: #fff; font-size: 0.85rem; cursor: pointer; }
        
        /* === ESTILO DEL MENSAJE DE ERROR SIEMPRE VISIBLE === */
        .error-message {
          background: #ff4d4f !important;
          color: white !important;
          padding: 12px;
          border-radius: 10px;
          margin-bottom: 15px;
          text-align: center;
          font-weight: 600;
          font-size: 0.9rem;
          animation: fadeIn 0.3s ease;
          width: 100%;
        }
        
        /* === ESTILO DEL BANNER DE REACTIVACIÓN === */
        .reactivate-banner { 
        background: #fca311 !important; 
        padding: 2px; 
        border-radius: 10px; 
        margin-top: 1px; 
        text-align: center; 
        border: 3px solid #48e; 
        box-shadow: 0 0 20px rgba(72, 136, 238, 0.5); 
        animation: fadeIn 0.5s ease; width: 100%; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } 
        }

        .reactivate-banner p { 
        color: #000 !important; 
        margin-bottom: 15px; 
        font-weight: 600; 
        font-size: 1rem; 
        }

        .reactivate-btn { 
        background: #48e !important; 
        color: #fff !important; 
        padding: 12px 25px; 
        font-size: 1em; 
        font-weight: 600; 
        border-radius: 30px; 
        border: none; 
        cursor: pointer; 
        transition: all 0.3s ease;
         width: auto; 
         }

        .reactivate-btn:hover { box-shadow: 0 0 15px #48e; transform: translateY(-2px); }
        .reactivate-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        
        .ant-form-item { margin-bottom: 0 !important; }
        .ant-form-item-explain-error { color: #fca311 !important; font-size: 0.8rem !important; margin-top: 5px !important; text-align: center !important; }
        .ant-message { z-index: 10000 !important; position: fixed !important; top: 100px !important; }
        .ant-message-notice { z-index: 10000 !important; }
        .ant-message-notice-wrapper { z-index: 10000 !important; }
        
        @media (max-width: 480px) { .login-page-container { padding: 20px; } .animated-box { width: 350px; height: 180px; } .animated-box:hover { width: 380px; height: 500px; } .login-content { width: 95%; } .app-title { font-size: 1rem; } .app-logo { width: 50px; height: 50px; } .link-group { flex-direction: column; align-items: center; gap: 8px; } .reactivate-banner { padding: 15px !important; } }
      `}</style>

      <div className="login-page-container">
        <div className={`animated-box ${isExpanded ? "expanded" : ""}`}>
          <div className="login-area">
            <div className="login-content">
              
              {/* ==== MENSAJE DE ERROR SIEMPRE VISIBLE ==== */}
              {errorMessage && (
                <div className="error-message">
                  {errorMessage}
                </div>
              )}

              <div className="logo-section">
                <h2 className="app-title">
                  <i className="fa-solid fa-bicycle"></i>
                  BIKE AND RIDE
                </h2>
              </div>

              <Form
                form={form}
                name="login"
                onFinish={onFinish}
                className="bike-form"
                initialValues={{ remember: false }}
                onFocus={() => setIsExpanded(true)}
              >
                <Form.Item
                  name="email"
                  rules={[
                    { required: true, message: "Por favor, introduce tu email!" },
                    { type: "email", message: "Email no válido." },
                  ]}
                >
                  <input className="bike-input" type="email" placeholder="Email" autoComplete="email" />
                </Form.Item>

                <Form.Item
                  name="password"
                  rules={[{ required: true, message: "Por favor, introduce tu contraseña!" }]}
                >
                  {/* <input className="bike-input" type="password" placeholder="Contraseña" autoComplete="current-password" /> */}
                  <div style={{ position: 'relative' }}>
                    <input
                      className="bike-input"
                      type={showPassword ? "text" : "password"}
                      placeholder="Contraseña"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: "absolute",
                        right: "24px",
                        top: "0%",
                        transform: "tranlateY(-50%)",
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                        fontSize: "18px",
                        color: "#999",
                        padding: "0",
                        width: "24px",
                        height: "24px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        // opacity: 0.6,
                        transition: "opacity 0.2s",
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                      onMouseLeave={(e) => e.currentTarget.style.opacity = '0.6'}
                    >
                      {showPassword ? '👁️' : '🔒'}
                    </button>
                  </div>
                </Form.Item>

                <Form.Item name="remember" valuePropName="checked">
                  <div className="remember-me-container">
                    <label className="custom-checkbox">
                      <input type="checkbox" checked={rememberMe} onChange={handleRememberChange} />
                      <span className="checkmark"></span>
                    </label>
                    <label className="remember-label" onClick={() => setRememberMe(!rememberMe)}>
                      Recordarme
                    </label>
                  </div>
                </Form.Item>

                <Form.Item>
                  <button type="submit" className="bike-submit" disabled={loading}>
                    {loading ? "Iniciando sesión..." : "Sign In"}
                  </button>
                </Form.Item>
              </Form>

              {/* ==== BANNER DE REACTIVACIÓN (solo si showReactivate=true) ==== */}
              {showReactivate && (
                <div className="reactivate-banner">
                  <p>¿Quieres reactivar tu cuenta suspendida?</p>
                  <button 
                    type="button" 
                    className="reactivate-btn"
                    onClick={handleReactivate}
                    disabled={loading}
                  >
                    {loading ? 'Reactivando...' : 'Reactivar Cuenta'}
                  </button>
                </div>
              )}

              <div className="link-group">
                <button 
                  className="link-btn" 
                  type="button" 
                  // onClick={() => 
                  // console.log("Forgot password clicked")}
                  style={{
                    opacity: 0.5,
                    cursor: 'not-allowed',
                    pointerEvents: 'none'
                  }}
                  title="Funcionalidad en desarrollo"
                >
                  ¿Olvidaste tu password?
                </button>
                <button className="link-btn register" type="button" onClick={() => navigate("/register")}>
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