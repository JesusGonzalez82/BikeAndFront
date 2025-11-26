import React, { useState, useEffect, act, use } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Card,
  Row,
  Col,
  Button,
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
  TimePicker,
  message,
  Typography,
  Empty,
  Spin,
  Popconfirm,
  Tag,
  Statistic,
  Modal,
  Space,
  Divider,
  Rate,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  FireOutlined,
  ThunderboltOutlined,
  CloseOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import {
  getActivities,
  createActivity,
  deleteActivity,
  updateActivity,
} from "../services/activityServices";
import { getVotacionesByActividad, agregarVoto } from "../services/votacionService";
import { useActivities } from "../context/ActivityContext";
import { useBikes } from "../context/BikeContext";
import { useRoutes } from "../context/RouteContext";
import { formatDateForBackend, formatDateToSpanish, formatTimeForBackend } from "../utils/dateUtils";
import dayjs from "dayjs";
import CommentSection from "../components/CommentSection";
import ActivityImageCarousel from "../components/ActivityImageCarousel";

const styles = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  /* Móvil y tablets pequeñas - Panel ocupa todo */
  @media (max-width: 1024px) {
    .activities-panel-active {
      display: none !important;
    }
    .details-panel {
      position: fixed !important;
      top: 64px !important;
      left: 0 !important;
      right: 0 !important;
      bottom: 0 !important;
      width: 100% !important;
      z-index: 1000 !important;
      flex: none !important;
    }
  }

  /* Laptops y pantallas medianas - 40/60 */
  @media (min-width: 1025px) and (max-width: 1600px) {
    .activities-panel-active {
      flex: 0 0 40% !important;
    }
    .details-panel {
      flex: 0 0 64% !important;
    }
  }

  /* Pantallas grandes - 30/70 */
  @media (min-width: 1601px) {
    .activities-panel-active {
      flex: 0 0 40% !important;
    }
    .details-panel {
      flex: 0 0 99% !important;
    }
   /* Hacer visibles las cervezas vacías - Mayor contraste */
  .ant-rate .ant-rate-star-zero .ant-rate-star-first,
  .ant-rate .ant-rate-star-zero .ant-rate-star-second {
    color: rgba(250, 140, 22, 0.5) !important;
    opacity: 1 !important;
    filter: grayscale(0.5) !important;
  }
  
  .ant-rate .ant-rate-star {
    font-size: 40px !important;
  }
  
  /* Efecto hover para que se vea que es interactivo */
  .ant-rate .ant-rate-star:hover {
    transform: scale(1.1);
    transition: transform 0.2s ease;
  }
  
  .beer-rating .ant-rate-star-zero .ant-rate-star-first,
  .beer-rating .ant-rate-star-zero .ant-rate-star-second {
    color: rgba(250, 140, 22, 0.25) !important;
  }
}
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

const { Title, Text } = Typography;
const { Option } = Select;


function Activities() {
  const {
    activities,
    loading,
    fetchActivities,
    addActivity,
    deleteActivity: deleteActivityContext,
  } = useActivities();
  const { bikes, fetchBikes } = useBikes();
  const { routes, fetchRoutes } = useRoutes();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [form] = Form.useForm();
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [avgRating, setAvgRating] = useState(0);
  const [totalVotes, setTotalVotes] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();


  useEffect(() => {
    fetchActivities();
    fetchBikes();
    fetchRoutes();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('action') === 'create') {
      showAddModal();
      navigate('/activities', { replace: true });
    }
  }, [location.search]);

  const showAddModal = () => {
    setEditingActivity(null);
    form.setFieldsValue({
      fecha: dayjs(),
      duracion: dayjs("01:00:00", "HH:mm:ss"),
    });
    setIsModalOpen(true);
  };

  const showEditModal = (activity) => {
    setEditingActivity(activity);
    form.setFieldsValue({
      fecha: dayjs(activity.fecha),
      duracion: dayjs(activity.duracion, "HH:mm:ss"),
      distancia: parseFloat(activity.distancia),
      calorias: activity.calorias ? parseFloat(activity.calorias) : null,
      velocidadMedia: parseFloat(activity.velocidadMedia),
      velocidadMax: parseFloat(activity.velocidadMax),
      idBici: activity.idBici,
      idRuta: activity.idRuta,
    });
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingActivity(null);
    form.resetFields();
  };

  const handleActivityClick = async (activity) => {
    setSelectedActivity(activity);

    try {
      const votaciones = await getVotacionesByActividad(activity.idActividad);

      // Calculamos la media de los votos
      if (votaciones && votaciones.length > 0) {
        const total = votaciones.reduce((sum, v) => sum + Number(v.numCervezas), 0);
        const media = total / votaciones.length;
        setAvgRating(media);
        setTotalVotes(votaciones.length);

      // Buscamos el voto del usuario actual
      const user = JSON.parse(localStorage.getItem('user'));
      const miVoto = votaciones.find(v => v.idUsuario === user.idUser);
      setUserRating(miVoto ? Number(miVoto.numCervezas) : 0);
      } else {
        setAvgRating(0);
        setTotalVotes(0);
        setUserRating(0);
      }
    } catch (error) {
      console.error("Error al cargar los votos: ", error);
      setAvgRating(0);
      setTotalVotes(0);
      setUserRating(0);
    }
  };

  const handleDrawerClose = () => {
    setSelectedActivity(null);
  }

  const handleRatingChange = async (value) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));

      const votacionData = {
        idActividad: selectedActivity.idActividad,
        idUsuario: user.idUser,
        numCervezas: value
      };

      await agregarVoto(votacionData);
      setUserRating(value);
      message.success(`¡Valoracion guardada: ${value} 🍺! ¡SALUD!`);

      handleActivityClick(selectedActivity);
    } catch (error) {
      console.error('Error al guardar la valoracion', error);
      message.error('Errora al guardar la valoracion');
    }
  };

  const handleSave = async (values) => {
    console.log("🚀 handleSave llamado con:", values);
    try {
      // Validar que los campos obligatorios existen
      if (!values.fecha) {
        message.error("Debes seleccionar una fecha");
        return;
      }

      if (!values.duracion) {
        message.error("Debes seleccionar una duración");
        return;
      }

      const fecha = formatDateForBackend(values.fecha);
      const duracion = formatTimeForBackend(values.duracion);

      // Validar que el formato sea correcto
      if (!duracion) {
        message.error("Formato de duración inválido");
        return;
      }

      const activityData = {
        fecha,
        duracion,
        distancia: values.distancia,
        velocidadMedia: values.velocidadMedia,
        velocidadMax: values.velocidadMax,
        calorias: values.calorias || null,
        idBici: values.idBici || null,
        idRuta: values.idRuta || null,
      };

      console.log("Datos a enviar:", activityData);

      if (editingActivity) {
        // Modo edición
        await updateActivity(editingActivity.idActividad, activityData);
        message.success("Actividad actualizada con éxito");
      } else {
        // Modo creación
        await addActivity(activityData);
        message.success("Actividad creada con éxito");
      }

      handleCancel();
      fetchActivities();
    } catch (error) {
      console.error("Error:", error);
      message.error(error.message || "Error al guardar la actividad");
    }
  };

  const handleDelete = async (activityId) => {
    try {
      await deleteActivityContext(activityId);
      fetchActivities();
    } catch (error) {
      message.error(error.message || "Error al eliminar la actividad");
    }
  };

  const formatDuration = (timeString) => {
    if (!timeString) return "N/A";
    const parts = timeString.split(":");
    const hours = parseInt(parts[0]);
    const minutes = parseInt(parts[1]);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const calculatePace = (distancia, duracion) => {
    if (!distancia || !duracion) return "N/A";

    const parts = duracion.split(":");
    const hours = parseInt(parts[0]);
    const minutes = parseInt(parts[1]);
    const seconds = parseInt(parts[2]);

    const totalMinutes = hours * 60 + minutes + seconds / 60;
    const pace = totalMinutes / parseFloat(distancia);

    const paceMinutes = Math.floor(pace);
    const paceSeconds = Math.round((pace - paceMinutes) * 60);

    return `${paceMinutes}:${paceSeconds.toString().padStart(2, "0")} min/km`;
  };

  // Obtenemos el nombre de la bici
  const getBikeName = (idBici) => {
    const bike = bikes.find((b) => b.id_bici === idBici);
    return bike ? `${bike.marca} ${bike.modelo}` : "Sin bicis";
  };

  // Obtenemos el nombre de la ruta
  const getRouteName = (idRuta) => {
    const route = routes.find((r) => r.idRuta === idRuta);
    return route ? route.nombreRuta : "Sin ruta";
  };

  // Calculamos las estadisticas generales
  const totalDistance = activities.reduce(
    (sum, act) => sum + (parseFloat(act.distancia) || 0),
    0
  );
  const totalActivities = activities.length;
  const avgSpeed =
    activities.length > 0
      ? (
          activities.reduce(
            (sum, act) => sum + (parseFloat(act.velocidadMedia) || 0),
            0
          ) / activities.length
        ).toFixed(1)
      : 0;

return (
    <div style={{ 
        display: 'flex', 
        width: '100%',
        maxWidth: '100vw',
        minHeight: 'calc(100vh - 64px)', 
        position: 'relative',
        overflow: 'hidden'
    }}>
        {/* COLUMNA IZQUIERDA - Lista de actividades */}
        <div
            className={selectedActivity ? 'activities-panel activities-panel-active' : 'activities-panel'}
            style={{ 
                flex: selectedActivity ? '0 0 40%' : '1',
                transition: 'flex 0.3s ease',
                padding: '24px',
                overflowY: 'auto',
                maxHeight: 'calc(100vh - 64px)',
            }}
        >
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "32px",
                    gap: "24px",
                }}
            >
                <Title level={2}>
                    <TrophyOutlined style={{ marginRight: "12px", color: "#fa8c16"}} />
                    Mis Actividades
                </Title>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    size="large"
                    onClick={showAddModal}
                    style={{ backgroundColor: "#fa8c16", borderColor: "#fa8c16"}}
                >
                    Registrar Actividad
                </Button>
            </div>

            {/* Resumen de estadisticas */}
            {!loading && activities.length > 0 &&(
                <Row gutter={16} style={{ marginBottom: "32px" }}>
                    <Col xs={24} sm={8}>
                        <Card>
                            <Statistic
                                title="Total Actividades"
                                value={totalActivities}
                                prefix={<TrophyOutlined />}
                                valueStyle={{ color: "#fa8c16" }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Card>
                            <Statistic
                                title="Distancia Total"
                                value={totalDistance.toFixed(2)}
                                suffix="km"
                                prefix={<FireOutlined />}
                                valueStyle={{ color: "#52c41a" }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Card>
                            <Statistic
                                title="Velocidad Media"
                                value={avgSpeed}
                                suffix="km/h"
                                prefix={<ThunderboltOutlined />}
                                valueStyle={{ color: "#1890ff" }}
                            />
                        </Card>
                    </Col>
                </Row>
            )}

            {loading && (
                <div style={{ textAlign: "center", padding: "100px 50px" }}>
                    <Spin size="large" />
                    <div style={{ marginTop: "16px"}}>
                        <Text type="secondary">Cargando tus actividades...</Text>
                    </div>
                </div>
            )}

            {!loading && activities.length === 0 && (
                <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={
                        <span>
                            No tienes ninguna Actividad aún!
                            <br />
                            Registra tu primera actividad
                        </span>
                    }
                    style={{ padding: "50px" }}
                >
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={showAddModal}
                        style={{ backgroundColor: "#fa8c16", borderColor: "#fa8c16"}}
                    >
                        Registrar Primera Actividad
                    </Button>
                </Empty>
            )}

            {!loading && activities.length > 0 && (
                <Row gutter={[16, 16]}>
                    {activities.map((activity) => (
                        <Col xs={24} sm={12} lg={selectedActivity ? 24 : 12} key={activity.idActividad}>
                            <Card
                                hoverable
                                style={{ 
                                    height: "100%",
                                    border: selectedActivity?.idActividad === activity.idActividad 
                                        ? '2px solid #fa8c16' 
                                        : '1px solid #f0f0f0'
                                }}
                                cover={
                                    <div 
                                        style={{
                                            cursor: "pointer"
                                        }}
                                        onClick={() => handleActivityClick(activity)}
                                    >
                                        <div style={{
                                            height: "120px",
                                            background: "linear-gradient(135deg, #fa8c16 0%, #faad14 100%)",
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            color: "white",
                                        }}>
                                            <div style={{ fontSize: "24px", fontWeight:"bold"}}>
                                                Actividad del día {dayjs(activity.fecha).format("DD-MM-YYYY")}
                                                
                                            </div>
                                            <div style={{ fontSize: "14px", marginTop: "4px"}}>
                                                {parseFloat(activity.distancia).toFixed(2)} km
                                            </div>
                                        </div>
                                    </div>
                                }
                                actions={[
                                    <Button
                                        key="edit"
                                        type="text"
                                        icon={<EditOutlined />}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            showEditModal(activity);
                                        }}
                                    >
                                        Editar
                                    </Button>,
                                    <Popconfirm
                                        key="delete"
                                        title="¿Eliminar actividad?"
                                        description="Esta acción no se puede deshacer"
                                        onConfirm={(e) => {
                                            e?.stopPropagation();
                                            handleDelete(activity.idActividad);
                                        }}
                                        okText="Si, eliminar"
                                        cancelText="Cancelar"
                                        okButtonProps={{ danger: true}}
                                    >
                                        <Button 
                                            type="text" 
                                            danger 
                                            icon={<DeleteOutlined />}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            Eliminar
                                        </Button>
                                    </Popconfirm>,
                                ]}
                            >
                                <div style={{ marginBottom: "12px"}}>
                                    <ClockCircleOutlined style={{ marginRight: "8px"}} />
                                    <Text strong>Velocidad:</Text>{" "}
                                    {parseFloat(activity.velocidadMedia).toFixed(2)} km/h
                                </div>

                                <div style={{ marginBottom: "12px"}}>
                                    <ThunderboltOutlined style={{ marginRight: "8px"}} />
                                    <Text strong>Duracion: </Text>{" "}
                                    {formatDuration(activity.duracion)}
                                </div>

                                <div style={{ marginBottom: "12px"}}>
                                    <Text strong>Ritmo:</Text>{" "}
                                    {calculatePace(activity.distancia, activity.duracion)}
                                </div>

                                {activity.idBici && (
                                    <div style={{ marginBottom: "8px"}}>
                                        <Tag color="blue">🚴 {getBikeName(activity.idBici)}</Tag>
                                    </div>
                                )}

                                {activity.idRuta && (
                                    <div style={{ marginBottom: "8px"}}>
                                        <Tag color="green">🗺️ {getRouteName(activity.idRuta)}</Tag>
                                    </div>
                                )}

                                {activity.calorias && (
                                    <div style={{ marginTop: "8px", fontSize: "12px"}}>
                                        <FireOutlined style={{ color: "#ff4d4f"}} />{" "}
                                        {parseFloat(activity.calorias).toFixed(0)} kcal
                                    </div>
                                )}
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </div>

        {/* COLUMNA DERECHA - Panel de detalles */}
        {selectedActivity && (
            <div
                className="details-panel"
                style={{
                    flex: '0 0 60%',
                    maxWidth: "60%",
                    borderLeft: '1px solid #e8e8e8',
                    backgroundColor: '#ffffff',
                    overflowY: 'auto',
                    maxHeight: 'calc(100vh - 64px)',
                    animation: 'slideIn 0.3s ease',
                    boxShadow: '-2px 0 8px rgba(0,0,0,0.1)',
                }}
            >
                <div style={{ padding: '16px', borderBottom: '1px solid #f0f0f0', backgroundColor: '#fafafa' }}>
                    <Button 
                        icon={<CloseOutlined />} 
                        onClick={() => setSelectedActivity(null)}
                        style={{ float: 'right' }}
                    >
                        Cerrar
                    </Button>
                    <Title level={4} style={{ margin: 0, paddingTop: '4px' }}>
                        Detalles de la actividad
                    </Title>
                </div>
                {/* Caarousel de imagenes */}
                <ActivityImageCarousel activityId={selectedActivity.idActividad} />
                {/* IInformacíón de la Actividad */}
                <div style={{ padding: "0 24px 24px "}}>
                  <Title level={4}>
                    {selectedActivity.fecha ? formatDateToSpanish (selectedActivity.fecha) : ""}
                  </Title>
                  <Text type="secondary" style={{ fontSize: "18px", display: "block", marginBottom: "24px"}}>
                    {selectedActivity.distancia ? `${parseFloat(selectedActivity.distancia).toFixed(2)} km` : "N/A"} · {formatDuration(selectedActivity.duracion)}
                  </Text>

                  <Row gutter={[16, 16]} style={{ marginBottom: "24px"}}>
                    <Col span={12}>
                      <Card size="small">
                        <Space direction="vertical" size={0}>
                          <Text type="secondary">
                            <ClockCircleOutlined /> Duración
                          </Text>
                          <Text strong style={{ fontSize: "16px"}}>
                            {formatDuration(selectedActivity.duracion)}
                          </Text>
                        </Space>
                      </Card>
                    </Col>

                    <Col span={12}>
                      <Card size="small">
                        <Space direction="vertical" size={0}>
                          <Text type="secondary">
                            <DashboardOutlined /> Velocidad Media
                          </Text>
                          <Text strong style={{ fontSize: "16px" }}>
                            {parseFloat(selectedActivity.velocidadMedia).toFixed(1)} km/h
                          </Text>
                        </Space>
                      </Card>
                    </Col>

                    <Col span={12}>
                      <Card size="small">
                        <Space direction="vertical" size={0}>
                          <Text type="secondary">
                            <ThunderboltOutlined /> Ritmo
                          </Text>
                          <Text strong style={{ fontSize: "16px" }}>
                            {calculatePace(selectedActivity.distancia, selectedActivity.duracion)}
                          </Text>
                        </Space>
                      </Card>
                    </Col>

                    <Col span={12}>
                      <Card size="small">
                        <Space direction="vertical" size={0}>
                          <Text type="secondary">
                            <FireOutlined /> Calorias
                          <Text strong style={{ fontSize: "16px" }}>
                            {selectedActivity.calorias ? parseFloat(selectedActivity.calorias).toFixed(0) : "N/A"} kcal
                          </Text>
                          </Text>
                        </Space>
                      </Card>
                    </Col>
                  </Row>

                  {/* Velocidad Maxima y otros datos */}
                  <Card size="small" style={{ marginBottom: "16px"}}>
                    <div style={{ marginBottom: "8px" }}>
                      <Text type="secondary">⚡ Velocidad Máxima: </Text>
                      <Text strong>{parseFloat(selectedActivity.velocidadMax).toFixed(2)}</Text> km/h
                    </div>
                    {selectedActivity.bike_name && (
                      <div style={{ marginBottom: "8px" }}>
                        <Text type="secondary">🚴 Bici: </Text>
                        <Text strong>{selectedActivity.bike_name}</Text>
                      </div>
                    )}
                    {selectedActivity.route_name && (
                      <div>
                        <Text type="secondary">🗺️ Ruta: </Text>
                        <Text strong>{selectedActivity.route_name}</Text>
                      </div>
                    )}
                  </Card>

                  <Divider />

                  {/* Comentarios */}
                  <CommentSection activityId={selectedActivity.idActividad} />

                  <Divider />

                  {/* Valoración Cervecil */}
                  <Card style={{ marginTop: "16px"}}>
                    <div style={{ textAlign: "center" }}>
                      <title level={4}>¿Como fue la actividad?</title>
                      <Rate
                        allowHalf
                        value={userRating}
                        onChange={handleRatingChange}
                        className="beer-rating"
                        style={{ fontSize: 40 }}
                        character="🍺"
                      />
                      <div style={{ marginTop: "16px "}}>
                        <Text type="secondary">
                          Valora tu actividad con jarras de cerveza 🍺
                        </Text>
                      </div>
                      {totalVotes > 0 && (
                        <div style={{ marginTop: "16px", padding: "12px", backgroundColor: "#fafafa", borderRadius: "8px"}}>
                          <Text strong style={{ fontSize: "16px", color: "#fa8c16" }}>
                            Media: {avgRating.toFixed(1)} 🍺
                          </Text>
                        </div>
                      )}
                    </div>
                  </Card>

                </div>
            </div>
        )}

      <Modal
        title={
          <span style={{ fontSize: "20px", fontWeight: "bold" }}>
            <TrophyOutlined style={{ marginRight: "8px", color: "#fa8c16" }} />
            {editingActivity ? "Editar Actividad" : "Registrar Actividad"}
          </span>
        }
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
          style={{ marginTop: "24px" }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Fecha"
                name="fecha"
                rules={[{ required: true, message: "Selecciona la fecha" }]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  format="DD/MM/YYYY"
                  placeholder="Selecciona la fecha"
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Duración"
                name="duracion"
                rules={[{ required: true, message: "Introduce la duración" }]}
              >
                <TimePicker
                  style={{ width: "100%" }}
                  format="HH:mm:ss"
                  placeholder="HH:MM:SS"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Distancia (km)"
                name="distancia"
                rules={[{ required: true, message: "Ingresa la distancia" }]}
              >
                <InputNumber
                  placeholder="45.5"
                  style={{ width: "100%" }}
                  min={0}
                  step={0.1}
                  precision={2}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Calorias" name="calorias">
                <InputNumber
                  placeholder="850"
                  style={{ width: "100%" }}
                  min={0}
                  step={1}
                  precision={0}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Velocidad Media (km/h)"
                name="velocidadMedia"
                rules={[
                  {
                    required: true,
                    message: "Ingresa la velocidad media",
                  },
                ]}
              >
                <InputNumber
                  placeholder="25.5"
                  style={{ width: "100%" }}
                  min={0}
                  step={0.1}
                  precision={2}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Velocidad Maxima (km/h)"
                name="velocidadMax"
                rules={[
                  {
                    required: true,
                    message: "Ingresa la velocidad máxima",
                  },
                ]}
              >
                <InputNumber
                  placeholder="45.0"
                  style={{ width: "100%" }}
                  min={0}
                  step={0.1}
                  precision={2}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Bicicleta" name="idBici">
            <Select placeholder="Selecciona una bici (opcional)" allowClear>
              {bikes.map((bike) => (
                <Option key={bike.id_bici} value={bike.id_bici}>
                  🚴 {bike.marca} {bike.modelo}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Ruta" name="idRuta">
            <Select placeholder="Selecciona una ruta (opcional)" allowClear>
              {routes.map((route) => (
                <Option key={route.idRuta} value={route.idRuta}>
                  🗺️ {route.nombreRuta} ({route.distancia} km)
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
            <Button onClick={handleCancel} style={{ marginRight: "8px" }}>
              Cancelar
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              style={{ backgroundColor: "#fa8c16", borderColor: "#fa8c16" }}
            >
              {editingActivity ? "Actualizar Actividad" : "Registrar Actividad"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Activities;
