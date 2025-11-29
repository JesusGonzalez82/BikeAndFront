import React, { useState } from 'react';
import { FloatButton } from 'antd';
import { PlusOutlined, EnvironmentOutlined, TrophyOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

function FloatingAddButton() {
    const navigate = useNavigate();
    const location = useLocation();

    // No tiene que verse en Login ni en registro
    if (location.pathname === '/local' || location.pathname === '/register') {
        return null;
    }

    return (
        <FloatButton.Group
            trigger='click'
            type='primary'
            style={{ right: 24, bottom: 24 }}
            icon={<PlusOutlined />}
        >
            <FloatButton
                icon={<i className="fa-solid fa-bicycle" style={{ fontSize: '18px' }}></i>}
                tooltip="Nueva Bici"
                onClick={() => navigate('/bikes')}
            />

            <FloatButton
                icon={<EnvironmentOutlined />}
                tooltip="Nueva Ruta"
                onClick={() => navigate('/routes')}
            />

            <FloatButton
                icon={<TrophyOutlined />}
                tooltip="Nueva Actividad"
                onClick={() => navigate('/actividades')}
            />
        </FloatButton.Group>
    );
}

export default FloatingAddButton