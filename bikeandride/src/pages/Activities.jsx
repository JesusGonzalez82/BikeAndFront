import React, { useState, useEffect, act } from "react";
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
 } from 'antd';
 import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    TrophyOutlined,
    ClockCircleOutlined,
    FireOutlined,
    ThunderboltOutlined,
 } from "@ant-design/icons";
 import { useActivities } from "../context/ActivityContext";
 import { useBikes } from "../context/BikeContext";
 import { useRoutes } from "../context/RouteContext";
 import { formatDateForBackend, formatTimeForBackend } from "../utils/dateUtils";
 import dayjs from "dayjs"; 

const { Title, Text } = Typography;
const { Option } = Select;

function Activities() {

    const { activities, loading, fetchActivities, addActivity, deleteActivity } = useActivities();
    const { bikes, fetchBikes } = useBikes();
    const { routes, fetchRoutes } = useRoutes();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingActivity, setEditingActivity] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchActivities();
        fetchBikes();
        fetchRoutes();
    }, []);

    const showAddModal = () =>{
        setEditingActivity(null);
        form.setFieldsValue({
            fecha: dayjs(),
            duracion: dayjs("01:00:00", "HH:mm:ss"),
        });
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setEditingActivity(null);
        form.resetFields();
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

            await addActivity(activityData);
            handleCancel();
            fetchActivities();
          } catch (error) {
            console.error("Error:", error);
            message.error(error.message || "Error al guardar la actividad");
          }
    };


    const handleDelete = async (activityId) => {
        try{
            await deleteActivity(activityId);
            fetchActivities();
        }catch (error) {
            message.error(error.message || "Error al eliminar la activida");
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
    const getRouteName = (idRuta) =>{
        const route = routes.find((r) => r.idRuta === idRuta);
        return route ? route.nombreRuta : "Sin ruta";
    }

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
        <div style={{ padding: '24px'}}>
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
            <Row gutter={1} style={{ marginBottom: "32px" }}>
                <Col xs={24} sm={24} md={10}>  {/* Móvil: vertical, Desktop: horizontal */}
                    <Card>
                    <Statistic
                        title="Total Actividades"
                        value={totalActivities}
                        prefix={<TrophyOutlined />}
                        valueStyle={{ color: "#fa8c16" }}
                    />
                    </Card>
                </Col>
                <Col xs={24} sm={24} md={10}>
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
                <Col xs={24} sm={24} md={10}>
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
                    <Col xs={24} sm={12} md={8} lg={12} key={activity.idActividad}>
                        <Card
                            hoverable
                            style={{ height: "100%" }}
                            cover={
                                <div style={{
                                    height: "120px",
                                    background: "linear-gradient(135deg, #fa8c16 0%, #faad14 100%)",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    color: "white",
                                }}
                            >
                                <div style={{ fontSize: "36px", fontWeight:"bold"}}>
                                    {parseFloat(activity.distancia).toFixed(2)} km
                                </div>
                                <div style={{ fontSize: "14px", marginTop: "4px"}}>
                                    {dayjs(activity.fecha).format("DD/MM/YYYY")}
                                </div>
                            </div>
                            }
                            actions={[
                                <Button
                                    key="edit"
                                    type="text"
                                    icon={<EditOutlined />}
                                    disabled
                                    title= "Editar no disponible por el momento"
                                >
                                Editar
                                </Button>,
                                <Popconfirm
                                    key="delete"
                                    title="¿Eliminar actividad?"
                                    description="Esta acción no se puede deshacer"
                                    onConfirm={() => handleDelete(activity.idActividad)}
                                    okText="Si, eliminar"
                                    cancelText="Cancelar"
                                    okButtonProps={{ danger: true}}
                                >
                                    <Button type="text" danger icon= {<DeleteOutlined />}>
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

        <Modal
            title={
                <span style={{ fontSize: "20px", fontWeight: "bold" }}>
                    <TrophyOutlined style={{ marginRight: "8px", color: "#fa8c16"}} />
                    Registrar Actividad 
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
                style={{ marginTop: "24px"}}
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Fecha"
                            name="fecha"
                            rules={[
                                { required: true, message:"Selecciona la fecha"},
                            ]}
                        >
                            <DatePicker
                                style={{ width: "100%" }}
                                format="DD/MM/YYYY"
                                placeholder="Seleciona la fecha"
                            />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            label="Duración"
                            name="duracion"
                            rules={[
                                { required: true, message: "Introduce la duración"},
                            ]}
                        >
                            <TimePicker
                                style={{ width: "100%"}}
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
                            rules={[
                                {required: true, message: "Ingresa la distancia"},
                            ]}
                        >
                            <InputNumber
                                placeholder="45.5"
                                style={{ width:"100%" }}
                                min={0}
                                step={0.1}
                                precision={2}
                            />
                        </Form.Item>
                    </Col>

                    <Col spon={12}>
                        <Form.Item
                            label="Calorias"
                            name="calorias"
                        >
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
                    <Select
                        placeholder="Selecciona una bici (opcional)"
                        allowClear
                    >
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
                        style={{ backgroundColor: "#fa8c16", borderColor: "#fa8c16"}}
                    >
                        Registrar Actividad
                    </Button>         
                </Form.Item>            
            </Form>
        </Modal>
        </div>
    );
}

export default Activities;