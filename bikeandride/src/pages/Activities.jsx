import React from "react";
import { Typography, Card } from 'antd';

const { Title } = Typography;

function Activities() {
    return (
        <div style={{ padding: '24px'}}>
            <Title level={2}>
                <i className="fa-solid fa-running" style={{ marginRight: '12px', color:'#18990ff'}}></i>
                Mis Actividades
            </Title>
            <Card>
                <p>Gestión de mis Actividades</p>
                {/* Conexión con ActivitiesProvider*/}
            </Card>
        </div>
    );
}

export default Activities;