import React, { use } from 'react';
import { Card, Row, Col, Statistic, Button, Typography, List, Modal, Descriptions, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
    HomeOutlined,
    TrophyOutlined,
    EnvironmentOutlined,
    RiseOutlined,
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { useStats } from '../context/StatsContext';
import { KilometersChartGlow } from '../components/KilometersChartGlow';

const { Title, Text } = Typography;

function Home() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [isStatsModalOpen, setIsStatsModalOpen] = React.useState(false);
    const { stats, loading: statsLoading, loadStats} = useStats();


// De momento son estadisticas y rutas de ejemplo

React.useEffect(() => {
  loadStats();
}, []);

const recentActivities = [
    { id: 1, title: 'Ruta por la Sierra', date: '05-01-2025', km: 45},
    { id: 2, title: 'Paseo Urbano', date: '07-01-2025', km: 18},
    { id: 3, title: 'Entreno por la mañana', date: '08-01-2025', km: 60},
];

const showStatsModal = () => {
    setIsStatsModalOpen(true);
};

const handleStatsClose = () => {
    setIsStatsModalOpen(false);
};

const detailedStats = {
    totalKm: 1250,
    totalElevation: 15420,
    longestActivity: { name: 'Ruta por la Sierra', km: 85, elevation: 1850},
    fastestActivity: { name: 'Dia de Sprinter', avgSpeed: 32 },
    activeDaysThisMonth: 18,
    avgPerActivity: 27.8,
    timePerActivity: '02:45:02',
    currentStreak: 5
};

  return (
    <div style={{ padding: "0px", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Bienvenida */}
      <div style={{ marginBottom: "16px" }}>
        <Title level={2}>¡Bienvenido, {user?.name}! 🚴</Title>
        <Text type="secondary">Este es tu resumen de actividad ciclista</Text>
      </div>

      {/* Loading para estadisticas */}
      {statsLoading && (
        <div style={{ textAlign: "center", padding: "50px"}}>
          <Spin size="large" />
          <div style={{ marginTop: "16px" }}>
            <Text type="secondary">Cargando estadisticas...</Text>
          </div>
        </div>
      )}
      {!statsLoading && (
        <>
          {/* Tarjetas de Estadísticas */}
          <Row gutter={[16, 16]} style={{ marginBottom: '32px' }}>
            <Col xs={24} sm={12} md={6}>
              <Card hoverable>
                <Statistic
                  title="Bicicletas"
                  value={stats.totalBikes}
                  prefix={<i className="fa-solid fa-bicycle" style={{ color: '#1890ff' }}></i>}
                />
              </Card>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <Card hoverable>
                <Statistic
                  title="Rutas"
                  value={stats.totalRoutes}
                  prefix={<EnvironmentOutlined style={{ color: '#52c41a' }} />}
                />
              </Card>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <Card hoverable>
                <Statistic
                  title="Actividades"
                  value={stats.totalActivities}
                  prefix={<TrophyOutlined style={{ color: '#fa8c16' }} />}
                />
              </Card>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <Card hoverable onClick={showStatsModal} style={{ cursor: 'pointer' }}>
                <Statistic
                  title="Estadísticas"
                  value="Ver más"
                  prefix={<RiseOutlined style={{ color: '#eb2f96' }} />}
                  valueStyle={{ fontSize: '16px', color: '#1890ff' }}
                />
              </Card>
            </Col>
          </Row>

          {/* Accesos Rápidos */}
          <Card 
            // title="Accesos Rápidos" 
            style={{ marginBottom: '32px' }}
            headStyle={{ backgroundColor: '#fafafa' }}
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={6}>
                <Button
                  type="primary"
                  size="large"
                  block
                  icon={<i className="fa-solid fa-bicycle" style={{ marginRight: '8px' }}></i>}
                  onClick={() => navigate('/bikes')}
                  style={{ height: '48px', fontSize: '14px' }}
                >
                  Mis Bicicletas
                </Button>
              </Col>

              <Col xs={24} sm={12} md={6}>
                <Button
                  size="large"
                  block
                  icon={<EnvironmentOutlined />}
                  onClick={() => navigate('/routes')}
                  style={{ 
                    height: '48px', 
                    fontSize: '14px',
                    backgroundColor: '#52c41a',
                    color: 'white',
                    borderColor: '#52c41a'
                  }}
                >
                  Mis Rutas
                </Button>
              </Col>

              <Col xs={24} sm={12} md={6}>
                <Button
                  size="large"
                  block
                  icon={<TrophyOutlined />}
                  onClick={() => navigate('/activities')}
                  style={{ 
                    height: '48px', 
                    fontSize: '14px',
                    backgroundColor: '#fa8c16',
                    color: 'white',
                    borderColor: '#fa8c16'
                  }}
                >
                  Mis Actividades
                </Button>
              </Col>

              <Col xs={24} sm={12} md={6}>
                <Button
                  size="large"
                  block
                  icon={<HomeOutlined />}
                  onClick={() => navigate('/profile')}
                  style={{ 
                    height: '48px', 
                    fontSize: '14px',
                    backgroundColor: '#722ed1',
                    color: 'white',
                    borderColor: '#722ed1'
                  }}
                >
                  Mi Perfil
                </Button>
              </Col>
            </Row>
          </Card>

          {/* Gráfico de Kilómetros */}
          <KilometersChartGlow />

          {/* Últimas Actividades */}
          <Card 
            title="Últimas Actividades" 
            extra={
              <Button type="link" onClick={() => navigate('/activities')}>
                Ver todas →
              </Button>
            }
            headStyle={{ backgroundColor: '#fafafa' }}
          >
            <List
              itemLayout="horizontal"
              dataSource={recentActivities}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        backgroundColor: '#1890ff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '20px'
                      }}>
                        <i className="fa-solid fa-bicycle"></i>
                      </div>
                    }
                    title={item.title}
                    description={`${item.date} • ${item.km} km`}
                  />
                </List.Item>
              )}
            />
          </Card>
        </>
      )}

      {/* Modal de Estadísticas Detalladas */}
      <Modal
        title={
          <span style={{ fontSize: '20px', fontWeight: 'bold' }}>
            <RiseOutlined style={{ marginRight: '8px', color: '#eb2f96' }} />
            Estadísticas Detalladas
          </span>
        }
        open={isStatsModalOpen}
        onCancel={handleStatsClose}
        footer={[
          <Button key="close" type="primary" onClick={handleStatsClose}>
            Cerrar
          </Button>
        ]}
        width={600}
      >
        <Descriptions bordered column={1} style={{ marginTop: '20px' }}>
          <Descriptions.Item 
            label={
              <span>
                <RiseOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
                Kilómetros Totales
              </span>
            }
          >
            <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#1890ff' }}>
              {detailedStats.totalKm.toLocaleString()} km
            </span>
          </Descriptions.Item>

          <Descriptions.Item 
            label={
              <span>
                🏔️ Desnivel Acumulado
              </span>
            }
          >
            <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#13c2c2' }}>
              {detailedStats.totalElevation.toLocaleString()} m
            </span>
          </Descriptions.Item>

          <Descriptions.Item 
            label={
              <span>
                <TrophyOutlined style={{ marginRight: '8px', color: '#faad14' }} />
                Actividad Más Larga
              </span>
            }
          >
            <span style={{ fontWeight: '500' }}>
              {detailedStats.longestActivity.name}
            </span>
            <br />
            <span style={{ color: '#8c8c8c' }}>
              {detailedStats.longestActivity.km} km • {detailedStats.longestActivity.elevation}m desnivel
            </span>
          </Descriptions.Item>

          <Descriptions.Item 
            label={
              <span>
                ⚡ Actividad Más Rápida
              </span>
            }
          >
            <span style={{ fontWeight: '500' }}>
              {detailedStats.fastestActivity.name}
            </span>
            <br />
            <span style={{ color: '#8c8c8c' }}>
              Velocidad promedio: {detailedStats.fastestActivity.avgSpeed} km/h
            </span>
          </Descriptions.Item>

          <Descriptions.Item 
            label={
              <span>
                📅 Días Activos (Este Mes)
              </span>
            }
          >
            <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#52c41a' }}>
              {detailedStats.activeDaysThisMonth} días
            </span>
          </Descriptions.Item>

          <Descriptions.Item 
            label={
              <span>
                🎯 Promedio por Actividad
              </span>
            }
          >
            <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#722ed1' }}>
              {detailedStats.avgPerActivity} km
            </span>
          </Descriptions.Item>

          <Descriptions.Item 
            label={
              <span>
                ⏱️ Tiempo Promedio por Actividad
              </span>
            }
          >
            <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#2f54eb' }}>
              {detailedStats.timePerActivity}
            </span>
          </Descriptions.Item>

          <Descriptions.Item 
            label={
              <span>
                🔥 Racha Actual
              </span>
            }
          >
            <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#fa541c' }}>
              {detailedStats.currentStreak} días consecutivos
            </span>
          </Descriptions.Item>
        </Descriptions>

        <div style={{ 
          marginTop: '24px', 
          padding: '16px', 
          background: '#f0f2f5', 
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <Text type="secondary">
            💡 Estas estadísticas se actualizan en tiempo real con tus actividades
          </Text>
        </div>
      </Modal>
    </div>
  );
}

export default Home;



