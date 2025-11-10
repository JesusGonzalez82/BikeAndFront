import React from "react";
import dayjs from "dayjs";
import { Typography, Card } from 'antd';
import { useAuth } from "../context/AuthContext";

const { Title, Text } = Typography;

function Profile() {
    const { user } = useAuth();

    const birthdayFormat = user?.birthday ? dayjs(user.birthday).format('DD-MM-YYYY') : '';

    return (
        <div style={{ padding: '24px'}}>
            <Title level={2}>
                <i className="fa-solid fa-bicycle" style={{ marginRight: '12px', color:'#18990ff'}}></i>
                Mis Perfil
            </Title>
            <Card>
                <p><Text strong>Nombre:</Text>  {user?.name}</p>
                <p><Text strong>Email:</Text>  {user?.email}</p>
                <p><Text strong>Fecha de nacimiento:</Text>  {birthdayFormat}</p>
                {/* Formulario para editar los datos de usuario*/}
            </Card>
        </div>
    );
}

export default Profile;