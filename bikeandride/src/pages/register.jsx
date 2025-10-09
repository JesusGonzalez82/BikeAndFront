import React, { useState } from "react";
import { Form, message, DatePicker } from "antd";
import { useNavigate } from "react-router-dom";
import { createtUser } from "../services/userService";
import dayjs from "dayjs";

message.config({
    top: 100,
    duration: 5,
    maxCount: 3,
});

function Register(){
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const onFinish = async(values) =>{
        setLoading(true);

        try{
            const userData = {
                name: values.username,
                password: values.password,
                birthday: values.birthday.format("DD-MM-YYYY"),
                status: "activo",
            };

            await createtUser(userData);

            message.success("¡Usuario creado con exito! Ahora puedes iniciar sesión.");

            setTimeout(() =>{
                navigate("/login");
            }, 1500);
        }catch(error){
            console.error("Error al crear el usuario: ", error);
            message.error("Error al crear el usuario, intentelo de nuevo.");
        }finally{
            setLoading(false);
        }
    };
    const handleLoginClick = () =>{
        navigate("/login");
    };
      return (
    <>
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

        .register-page-container {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100%;
          min-height: 100vh;
          background: #25252b;
          font-family: "Poppins", sans-serif;
          padding: 20px;
        }

        .animated-box-register {
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

        .animated-box-register::before {
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

        .animated-box-register::after {
          content: "";
          position: absolute;
          inset: 4px;
          background: #2d2d39;
          border-radius: 15px;
          border: 8px solid #25252b;
        }

        .animated-box-register:hover {
          width: 500px;
          height: 650px;
        }

        .animated-box-register:hover .register-area {
          inset: 40px;
        }

        .animated-box-register:hover .register-content {
          transform: translateY(0px);
        }

        .register-area {
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

        .register-content {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          gap: 5px;
          width: 90%;
          transform: translateY(185px);
          transition: 0.5s;
          padding: 10px 0;
        }

        .logo-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          margin-bottom: 5px;
        }

        .app-title {
          text-transform: uppercase;
          font-weight: 600;
          letter-spacing: 0.2em;
          font-size: 1.1rem;
          text-align: center;
          margin: 0;
          color: #fff;
        }

        .app-title i {
          color: #48e;
          text-shadow: 0 0 5px #fca311, 0 0 20px #fca311;
          margin-right: 8px;
        }

        .subtitle {
          font-size: 0.85rem;
          color: #fff;
          text-align: center;
          margin-bottom: 5px;
        }

        .bike-form {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .bike-input {
          width: 100%;
          padding: 10px 30px;
          outline: none;
          border: 2px solid #fff;
          border-radius: 30px;
          font-size: 0.95em;
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

        .ant-picker {
          width: 100%;
          padding: 8px 30px;
          border: 2px solid #fff;
          border-radius: 30px;
          background: #0000001a;
          transition: all 0.3s ease;
        }

        .ant-picker:hover,
        .ant-picker-focused {
          border-color: #48e !important;
          box-shadow: 0 0 10px rgba(69, 243, 255, 0.3) !important;
          background: #fff !important;
        }

        .ant-picker-input > input {
          color: #000;
          font-family: "Poppins", sans-serif;
        }

        .ant-picker-input > input::placeholder {
          color: #666;
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
          margin-top: 5px;
        }

        .bike-submit:hover {
          box-shadow: 0 0 10px #48e, 0 0 60px #48e;
          transform: translateY(-2px);
        }

        .bike-submit:active {
          transform: translateY(0);
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

        .link-group {
          width: 100%;
          display: flex;
          justify-content: center;
          gap: 5px;
          margin-top: 8px;
        }

        .link-btn {
          background: none;
          border: none;
          color: #48e;
          font-size: 0.85rem;
          cursor: pointer;
          font-family: "Poppins", sans-serif;
          padding: 0;
          transition: all 0.1s ease;
          text-decoration: none;
          font-weight: 600;
        }

        .link-btn:hover {
          text-shadow: 0 0 5px #48e, 0 0 15px #48e;
        }

        .link-text {
          color: #fff;
          font-size: 0.85rem;
        }

        .ant-form-item {
          margin-bottom: 0 !important;
        }

        .ant-form-item-explain-error {
          color: #ff4d4f !important;
          font-size: 0.75rem !important;
          margin-top: 3px !important;
          text-align: center !important;
          background: rgba(255, 255, 255, 0.9);
          padding: 2px 8px;
          border-radius: 10px;
        }

        .ant-message {
          z-index: 10000 !important;
          position: fixed !important;
          top: 100px !important;
        }

        @media (max-width: 480px) {
          .animated-box-register {
            width: 350px;
            height: 180px;
          }
          
          .animated-box-register:hover {
            width: 380px;
            height: 600px;
          }
          
          .register-content {
            width: 95%;
          }
          
          .app-title {
            font-size: 1rem;
          }
        }
      `}</style>

      <div className="register-page-container">
        <div className="animated-box-register">
          <div className="register-area">
            <div className="register-content">
              <div className="logo-section">
                <h2 className="app-title">
                  <i className="fa-solid fa-bicycle"></i>
                  BIKE AND RIDE
                </h2>
                <p className="subtitle">Crea tu cuenta</p>
              </div>

              <Form
                form={form}
                name="register"
                onFinish={onFinish}
                className="bike-form"
              >
                <Form.Item
                  name="username"
                  rules={[
                    {
                      required: true,
                      message: "El nombre es requerido",
                    },
                    {
                      min: 3,
                      message: "Mínimo 3 caracteres",
                    },
                  ]}
                >
                  <input
                    className="bike-input"
                    placeholder="Nombre de usuario"
                    autoComplete="username"
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "La contraseña es requerida",
                    },
                    {
                      min: 6,
                      message: "Mínimo 6 caracteres",
                    },
                  ]}
                >
                  <input
                    className="bike-input"
                    type="password"
                    placeholder="Contraseña"
                    autoComplete="new-password"
                  />
                </Form.Item>

                <Form.Item
                  name="confirmPassword"
                  dependencies={["password"]}
                  rules={[
                    {
                      required: true,
                      message: "Confirma tu contraseña",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error("Las contraseñas no coinciden")
                        );
                      },
                    }),
                  ]}
                >
                  <input
                    className="bike-input"
                    type="password"
                    placeholder="Confirmar contraseña"
                    autoComplete="new-password"
                  />
                </Form.Item>

                <Form.Item
                  name="birthday"
                  rules={[
                    {
                      required: true,
                      message: "La fecha es requerida",
                    },
                    () => ({
                      validator(_, value) {
                        if (!value) return Promise.resolve();

                        const age = dayjs().diff(value, "year");
                        if (age < 18) {
                          return Promise.reject(
                            new Error("Debes ser mayor de 18 años")
                          );
                        }
                        return Promise.resolve();
                      },
                    }),
                  ]}
                >
                  <DatePicker
                    placeholder="Fecha de nacimiento"
                    format="DD/MM/YYYY"
                    disabledDate={(current) =>
                      current && current > dayjs().endOf("day")
                    }
                  />
                </Form.Item>

                <Form.Item>
                  <button
                    type="submit"
                    className="bike-submit"
                    disabled={loading}
                  >
                    {loading ? "Creando cuenta..." : "Crear Cuenta"}
                  </button>
                </Form.Item>
              </Form>

              <div className="link-group">
                <span className="link-text">¿Ya tienes cuenta?</span>
                <button
                  className="link-btn"
                  type="button"
                  onClick={handleLoginClick}
                >
                  Inicia sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Register;