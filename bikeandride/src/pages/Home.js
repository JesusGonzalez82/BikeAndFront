import React, { use } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Button,
  Typography,
  List,
  Modal,
  Descriptions,
  Spin,
  Empty
} from "antd";
import { useNavigate } from "react-router-dom";
import {
  HomeOutlined,
  TrophyOutlined,
  EnvironmentOutlined,
  RiseOutlined,
  ClockCircleOutlined,
  ThunderboltOutlined,
  FireOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useAuth } from "../context/AuthContext";
import { useStats } from "../context/StatsContext";
import { ChartsCarousel } from "../components/ChartsCarousel"

const { Title, Text } = Typography;

function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isStatsModalOpen, setIsStatsModalOpen] = React.useState(false);
  const { stats, loading: statsLoading, loadStats } = useStats();

  // De momento son estadisticas y rutas de ejemplo

  React.useEffect(() => {
    loadStats();
  }, []);

  const recentActivities = [
    { id: 1, title: "Ruta por la Sierra", date: "05-01-2025", km: 45 },
    { id: 2, title: "Paseo Urbano", date: "07-01-2025", km: 18 },
    { id: 3, title: "Entreno por la mañana", date: "08-01-2025", km: 60 },
  ];

  const showStatsModal = () => {
    setIsStatsModalOpen(true);
  };

  const handleStatsClose = () => {
    setIsStatsModalOpen(false);
  };

  const detailedStats = React.useMemo(() =>{
    console.log("Debug stats.activities: ", stats.activities);
    if (!stats.activities || stats.activities.length === 0){
      return {
    totalKm: 0,
    totalElevation: 0,
    longestActivity: null,
    fastestActivity: null,
    activeDaysThisMonth: 0,
    avgPerActivity: 0,
    timePerActivity: "00:00:00",
    currentStreak: 0,
      };
    }
  
  const activities = stats.activities;

  // Total km y desnivel

  const totalKm = activities.reduce((sum, act) => sum + parseFloat(act.distancia || 0), 0);
  const totalElevation = activities.reduce((sum, act) => {
  const ruta = stats.routes?.find(r => r.idRuta === act.idRuta);
  return sum + parseFloat(ruta?.desnivel || 0);
}, 0);

  // Actividad más larga

  const longestActivity = activities.reduce((max, act) =>  
    parseFloat(act.distancia) > parseFloat(max.distancia) ? act : max);

  // Actividad más rápida

  const fastestActivity = activities.reduce((max, act) => 
    parseFloat(act.velocidadMedia) > parseFloat(max.velocidadMedia) ? act : max);

  // Dias activo en el mes en curso

  const currentMonth = dayjs().month();
  const currentYear = dayjs().year();
  const activeDaysThisMonth = new Set(
    activities.filter(act => {
      const actDate = dayjs(act.fecha);
      return actDate.month() === currentMonth && actDate.year() === currentYear;
    })
    .map(act => dayjs(act.fecha).format('YYYY-MM-DD'))
  ).size;

  // Promedio por actividad
  const avgPerActivity = activities.length > 0 ? totalKm / activities.length : 0;

  // Tiempo promedio por actividad
  const totalSeconds = activities.reduce((sum, act) => {
    if(!act.duracion) return sum;
    const [hours, minutes, seconds] = act.duracion.split(':').map(Number);
    return sum + (hours * 3600) + (minutes * 60) + (seconds || 0);
  }, 0);
  const avgSeconds = activities.length > 0 ? totalSeconds / activities.length : 0;
  const avgHours = Math.floor(avgSeconds / 3600);
  const avgMinutes = Math.floor((avgSeconds % 3600) / 60);
  const avgSecs = Math.floor(avgSeconds % 60);
  const avgTimePerActivity = `${String(avgHours).padStart(2, '0')}:${String(avgMinutes).padStart(2, '0')}:${String(avgSecs).padStart(2, '0')}`;

  // Racha actual (dias consecutivos)
  const sortedActivities = [...activities].sort((a, b) =>
    dayjs(b.fecha).unix() - dayjs(a.fecha).unix());
  let currentStreak = 0;
  let lastDate = null;
  for (const act of sortedActivities) {
    const actDate = dayjs(act.fecha);
    if(!lastDate){
      if (actDate.isSame(dayjs(), 'day') || actDate.isSame(dayjs().subtract(1, 'day'), 'day')) {
        currentStreak = 1;
        lastDate = actDate;
      } else {
        break;
      }
    }
  }
 
  return {
    totalKm: totalKm.toFixed(2),
    totalElevation: totalElevation.toFixed(0),
    longestActivity: {
    fecha: dayjs(longestActivity.fecha).format('DD/MM/YYYY'),
    km: parseFloat(longestActivity.distancia).toFixed(2),
    elevation: (() => {
      const ruta = stats.routes?.find(r => r.idRuta === longestActivity.idRuta);
      return parseFloat(ruta?.desnivel || 0).toFixed(0);
    })(),
},
    fastestActivity: {
      fecha: dayjs(fastestActivity.fecha).format('DD/MM/YYYY'),
      avgSpeed: parseFloat(fastestActivity.velocidadMedia).toFixed(2),
    },
    activeDaysThisMonth,
    avgPerActivity: avgPerActivity.toFixed(2),
    avgTimePerActivity,
    currentStreak,
  };
}, [stats.activities]);

  return (
    <div style={{ padding: "0px", maxWidth: "1200px", margin: "0 auto", width:"100%"}}>
      {/* Bienvenida */}
      <div style={{ marginBottom: "16px" }}>
        <Title level={2}>¡Bienvenido, {user?.name}! 🚴</Title>
        <Text type="secondary">Este es tu resumen de actividad ciclista</Text>
      </div>

      {/* Loading para estadisticas */}
      {statsLoading && (
        <div style={{ textAlign: "center", padding: "50px" }}>
          <Spin size="large" />
          <div style={{ marginTop: "16px" }}>
            <Text type="secondary">Cargando estadisticas...</Text>
          </div>
        </div>
      )}
      {!statsLoading && (
        <>
          {/* Tarjetas de Estadísticas */}
          <Row gutter={[16, 16]} style={{ marginBottom: "32px" }}>
            <Col xs={24} sm={12} md={6}>
              <Card hoverable>
                <Statistic
                  title="Bicicletas"
                  value={stats.totalBikes}
                  prefix={
                    <i
                      className="fa-solid fa-bicycle"
                      style={{ color: "#1890ff" }}
                    ></i>
                  }
                />
              </Card>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <Card hoverable>
                <Statistic
                  title="Rutas"
                  value={stats.totalRoutes}
                  prefix={<EnvironmentOutlined style={{ color: "#52c41a" }} />}
                />
              </Card>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <Card hoverable>
                <Statistic
                  title="Actividades"
                  value={stats.totalActivities}
                  prefix={<TrophyOutlined style={{ color: "#fa8c16" }} />}
                />
              </Card>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <Card
                hoverable
                onClick={showStatsModal}
                style={{ cursor: "pointer" }}
              >
                <Statistic
                  title="Estadísticas"
                  value="Ver más"
                  prefix={<RiseOutlined style={{ color: "#eb2f96" }} />}
                  valueStyle={{ fontSize: "16px", color: "#1890ff" }}
                />
              </Card>
            </Col>
          </Row>

          {/* Accesos Rápidos */}
          <Card
            // title="Accesos Rápidos"
            style={{ marginBottom: "32px" }}
            headStyle={{ backgroundColor: "#fafafa" }}
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={6}>
                <Button
                  type="primary"
                  size="large"
                  block
                  icon={
                    <i
                      className="fa-solid fa-bicycle"
                      style={{ marginRight: "8px" }}
                    ></i>
                  }
                  onClick={() => navigate("/bikes")}
                  style={{ height: "48px", fontSize: "14px" }}
                >
                  Mis Bicicletas
                </Button>
              </Col>

              <Col xs={24} sm={12} md={6}>
                <Button
                  size="large"
                  block
                  icon={<EnvironmentOutlined />}
                  onClick={() => navigate("/routes")}
                  style={{
                    height: "48px",
                    fontSize: "14px",
                    backgroundColor: "#52c41a",
                    color: "white",
                    borderColor: "#52c41a",
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
                  onClick={() => navigate("/activities")}
                  style={{
                    height: "48px",
                    fontSize: "14px",
                    backgroundColor: "#fa8c16",
                    color: "white",
                    borderColor: "#fa8c16",
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
                  onClick={() => navigate("/profile")}
                  style={{
                    height: "48px",
                    fontSize: "14px",
                    backgroundColor: "#722ed1",
                    color: "white",
                    borderColor: "#722ed1",
                  }}
                >
                  Mi Perfil
                </Button>
              </Col>
            </Row>
          </Card>

          {/* Gráfico de Kilómetros */}
          <ChartsCarousel />

          {/* Últimas Actividades */}
          <Card
            title="Últimas Actividades"
            style={{ marginBottom: "32px" }}
            extra={
              <Button type="link" onClick={() => navigate("/activities")}>
                Ver todas
              </Button>
            }
          >
            {stats.activities && stats.activities.length > 0 ? (
              <List
                itemLayout="horizontal"
                dataSource={stats.activities.slice(0, 5)}
                renderItem={(activity) => (
                  <List.Item
                    actions={[
                      <Text strong style={{ color: "#fa8c16" }}>
                        {parseFloat(activity.distancia).toFixed(1)} km
                      </Text>,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={
                        <TrophyOutlined
                          style={{ fontSize: "24px", color: "#fa8c16" }}
                        />
                      }
                      title={dayjs(activity.fecha).format("DD/MM/YYYY")}
                      description={
                        <div>
                          <Text type="secondary">
                            <ClockCircleOutlined />{" "}
                            {activity.duracion
                              ? activity.duracion.substring(0, 5)
                              : "N/A"}{" "}
                            |
                            <ThunderboltOutlined />{" "}
                            {parseFloat(activity.velocidadMedia).toFixed(
                              1
                            )}{" "}
                            km/h
                            {activity.calorias && (
                              <>
                                {" "}
                                | <FireOutlined />{" "}
                                {parseFloat(activity.calorias).toFixed(0)} kcal
                              </>
                            )}
                          </Text>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            ) : (
              <Empty
                description="No tienes actividades registradas"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              >
                <Button type="primary" onClick={() => navigate("/activities")}>
                  Registrar primera actividad
                </Button>
              </Empty>
            )}
          </Card>
        </>
      )}

      {/* Modal de Estadísticas Detalladas */}
      <Modal
        title={
          <span style={{ fontSize: "20px", fontWeight: "bold" }}>
            <RiseOutlined style={{ marginRight: "8px", color: "#eb2f96" }} />
            Estadísticas Detalladas
          </span>
        }
        open={isStatsModalOpen}
        onCancel={handleStatsClose}
        footer={[
          <Button key="close" type="primary" onClick={handleStatsClose}>
            Cerrar
          </Button>,
        ]}
        width={600}
      >
        <Descriptions bordered column={1} style={{ marginTop: "20px" }}>
          <Descriptions.Item
            label={
              <span>
                <RiseOutlined
                  style={{ marginRight: "8px", color: "#1890ff" }}
                />
                Kilómetros Totales
              </span>
            }
          >
            <span
              style={{ fontSize: "18px", fontWeight: "bold", color: "#1890ff" }}
            >
              {detailedStats.totalKm.toLocaleString()} km
            </span>
          </Descriptions.Item>

          <Descriptions.Item label={<span>🏔️ Desnivel Acumulado</span>}>
            <span
              style={{ fontSize: "18px", fontWeight: "bold", color: "#13c2c2" }}
            >
              {detailedStats.totalElevation.toLocaleString()} m
            </span>
          </Descriptions.Item>

          <Descriptions.Item
            label={
              <span>
                <TrophyOutlined
                  style={{ marginRight: "8px", color: "#faad14" }}
                />
                Actividad Más Larga
              </span>
            }
          >
            {detailedStats.longestActivity ? (
              <>
                <span style={{ fontWeight: "500"}}>
                  {detailedStats.longestActivity.fecha}
                </span>
                <br />
                <span style={{ color: "#8c8c8c"}}>
                  {detailedStats.longestActivity.km} km • {detailedStats.longestActivity.elevation}m desnivel
                </span>
              </>
            ) : (
              <span style={{ color: "#8c8c8c8"}}></span>
            )}
          </Descriptions.Item>

          <Descriptions.Item label={<span>⚡ Actividad Más Rápida</span>}>
            {detailedStats.fastestActivity ? (
              <>
                <span style={{ fontWeight: "500" }}>
                  {detailedStats.fastestActivity.name}
                </span>
                <br />
                <span style={{ fontWeight: "500" }}>
                  {detailedStats.fastestActivity.fecha}
                </span>
                <br />
                <span style={{ color: "#8c8c8c" }}>
                  Velocidad promedio: {detailedStats.fastestActivity.avgSpeed} km/h
                </span>
              </>
            ) : (
              <span style={{ color: "#8c8c8c"}}>Sin datos</span>
            )}
          </Descriptions.Item>

          <Descriptions.Item label={<span>📅 Días Activos (Este Mes)</span>}>
            <span
              style={{ fontSize: "16px", fontWeight: "bold", color: "#52c41a" }}
            >
              {detailedStats.activeDaysThisMonth} días
            </span>
          </Descriptions.Item>

          <Descriptions.Item label={<span>🎯 Promedio por Actividad</span>}>
            <span
              style={{ fontSize: "16px", fontWeight: "bold", color: "#722ed1" }}
            >
              {detailedStats.avgPerActivity} km
            </span>
          </Descriptions.Item>

          <Descriptions.Item
            label={<span>⏱️ Tiempo Promedio por Actividad</span>}
          >
            <span
              style={{ fontSize: "16px", fontWeight: "bold", color: "#2f54eb" }}
            >
              {detailedStats.avgTimePerActivity}
            </span>
          </Descriptions.Item>

          <Descriptions.Item label={<span>🔥 Racha Actual</span>}>
            <span
              style={{ fontSize: "16px", fontWeight: "bold", color: "#fa541c" }}
            >
              {detailedStats.currentStreak} días consecutivos
            </span>
          </Descriptions.Item>
        </Descriptions>

        <div
          style={{
            marginTop: "24px",
            padding: "16px",
            background: "#f0f2f5",
            borderRadius: "8px",
            textAlign: "center",
          }}
        >
          <Text type="secondary">
            💡 Estas estadísticas se actualizan en tiempo real con tus
            actividades
          </Text>
        </div>
      </Modal>
    </div>
  );
}

export default Home;
