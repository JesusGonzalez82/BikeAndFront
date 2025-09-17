import React from "react";
import { useAuth } from '../context/AuthContext';
import { useNavigate } from "react-router-dom";
import { Button } from "antd";

function Home(){
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('login');
    };

    return(
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            // justifyContent: 'center',
            alignItems: 'center',
            // height: '100vh',
            textAlign: 'center'
        }}>
            <h1>Bienvenido a Bike And Ride</h1>
            <p>Hola, {user?.fullName || user?.username}</p>
            <Button type="primary" onClick={handleLogout}>
                Cerrar sesión
            </Button>
        </div>
    );
}

export default Home;