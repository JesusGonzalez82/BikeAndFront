import React, { useState, useEffect, Children, act } from "react";
import {
    Drawer,
    Tabs,
    Typography,
    Image,
    Empty,
    Rate,
    Card,
    Row,
    Col,
    Space,
    Divider,
    message,
    Spin,
    Upload,
    Button,
} from "antd";
import {
    ClockCircleOutlined,
    DashboardOutlined,
    FireOutlined,
    ThunderboltOutlined,
    PictureOutlined,
    MessageOutlined,
    TrophyFilled,
    TrophyOutlined,
    UploadOutlined,
    DeleteOutlined,
} from "@ant-design/icons";
import CommentSection from "./CommentSection";
import { formatDateToSpanish } from "../utils/dateUtils";
import config from "../config/enviroment";
import {
    getActivityImage,
    uploadActivityImage,
    validateImageSize,
    validateImageType,
} from "../services/activityImageService";

const { Title, Text } = Typography;
const API_BASE_URL = config.API_URL;

function ActivityDrawer({ open, onClose, activity }) {
    const [activeTab, setActiveTab] = useState("1");
    const [statistics, setStatistics] = useState(null);
    const [loadingStats, setLoadingStats] = useState(false);
    const [activityImage, setActivityImage] = useState(null);
    const [loadingImage, setLoadingImage] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);

    useEffect(() => {
        if (open) {
            setActiveTab("1");
            if (activity?.idUsuario) {
                loadStatistics(activity.idUsuario);
            }
            if (activity?.idActividad){
                loadActivityImage(activity.idActividad);
            }
        }
    }, [open, activity]);

    const loadStatistics = async (userId) => {
        try {
            setLoadingStats(true);
            const token = localStorage.getItem('authToken');
            const tokenType = localStorage.getItem('tokenType') || 'Bearer';

            const response = await fetch(`${API_BASE_URL}/actividades/estadisticas/${userId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `${tokenType} ${token}`,
                },
            });

            if (response.ok){
                const data = await response.json();
                setStatistics(data);
            }
        } catch (error) {
            console.error("Error loading statistics: ", error);
            message.error("Error al cargar las estadisticas");
        }finally {
            setLoadingStats(false);
        }
    };

    const loadActivityImage = async (activityId) => {
        try {
            setLoadingImage(true);
            const imageUrl = await getActivityImage(activityId);
            setLoadingImage(imageUrl);
        }catch (error) {
            if (error.message !== "Error al obtener la imagen") {
                console.error("Error loading activity image: ", error);
            }
            setActivityImage(null);
        }finally {
            setLoadingImage(false);
        }
    };

    const handleImageUpload = async (file) => {
        
        if (!activity || !activity.idActividad) {
            message.error("No se pudo identiciar la actividad");
            return false;
        }

        try {
            validateImageSize(file);
            validateImageType(file);

            setUploadingImage(true);

            const reader = new FileReader();
            reader.onload = (e) => {
                setActivityImage(e.target.result);
            };
            reader.readAsDataURL(file);

            await uploadActivityImage(activity.idActividad, file);
            message.success("Imagen cargada con éxito");

            setTimeout(() => {
                loadActivityImage(activity.idActividad);
            }, 500);
        }catch (error) {
            console.error("Error uploading image: ", error);
            message.error(error.message || "Error al subir la imagen");
            setActivityImage(null);
        }finally {
            setUploadingImage(false);
        }
        return false;
    };

    // Función para dar formato a la duración
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

    // Funciona para calcular el ritmo
    const calculatePace = (distancia, duracion) => {
        if (!distancia || !duracion) return "N/A";

        const parts = duracion.split(":");
        const hours = parseInt(parts[0]);
        const minutes = parseInt(parseInt(parts[1]));
        const seconds = parseInt(parseInt(parts[2]));

        const totalMinutes = hours * 60 + minutes + seconds / 60;
        const pace = totalMinutes / parseFloat(distancia);

        const paceMinutes = Math.floor(pace);
        const paceSeconds = Math.round((pace - paceMinutes) * 60);

        return `${paceMinutes}:${paceSeconds.toString().padStart(2, "0")} min/km`;
    };

    if (!activity) return null;

    const items = [
        {
            key: "1",
            label: (
                <span>
                    <MessageOutlined /> Comentarios
                </span>
            ),
            children: <CommentSection activityId={activity.idActividad} />,
        },
        {
            key: "2",
            label: (
                <span>
                    <PictureOutlined /> Fotos
                </span>
            ),
            children: (
                <div style={{ padding: "16px" }}>
                    {loadingImage ? (
                        <div style={{ textAlign: "center", padding: "40px" }}>
                            <Spin size="large" />
                        </div>
                    ) : activityImage ? (
                        <div>
                            <Image
                                src={activityImage}
                                alt="Foto de la actividad"
                                style={{
                                    width: "100%",
                                    borderRadius: "8px",
                                    marginBottom: "16px",
                                }}
                            />
                            <Upload
                                beforeUpload={handleImageUpload}
                                showUploadList={false}
                                accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
                            >
                                <Button
                                    icon={<UploadOutlined />}
                                    loading={uploadingImage}
                                    block
                                >
                                    Cambiar Foto
                                </Button>
                            </Upload>
                        </div>
                    ) : (
                        <div>
                            <Empty
                                description="No hay fotos para esta actividad"
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                            />
                            <Upload
                                beforeUpload={handleImageUpload}
                                showUploadList={false}
                                accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
                            >
                                <Button
                                    type="primary"
                                    icon={<UploadOutlined />}
                                    loading={uploadingImage}
                                    block
                                    style={{ marginTop: "16px"}}
                                >
                                    Subir Foto
                                </Button>
                            </Upload>
                        </div>
                    )}
                </div>
            ),
        },
        {
            key: "3",
            label: (
                <span>
                    🍺 Valoracion
                </span>
            ),
            children: (
                <div style={{ padding: "16px" }}>
                    <Title level={4}>¿Como fue la actividad?</Title>
                    <Rate
                        allowHalf
                        defaultValue={0}
                        style={{ fontSize: 40 }}
                        character="🍺"
                    />
                    <div style={{ marginTop: "16px" }}>
                        <Text type="secondary">
                            Valora tu actividad con jarras de cerveza 🍺
                        </Text>
                    </div>
                </div>
            ),
        },
        {
            key: "4",
            label: (
                <span>
                    <TrophyOutlined /> Estadísticas
                </span>
            ),
            children: (
                <div style={{ padding: "16px" }}>
                    {loadingStats ? (
                        <div style={{ textAlign: "center", padding: "40px" }}>
                            <Spin size="large" />
                        </div>
                    
                    ) : statistics ? (
                        <Row gutter={[16, 16]}>
                            <Col span={12}>
                                <Card>
                                    <div style={{ textAlign: "center"}}>
                                        <Text type="secondary">Total Actividades</Text>
                                        <Title level={3} style={{ margin: "8px 0", color: "#fa8c16"}}>
                                            {statistics.numeroActividades}
                                        </Title>
                                    </div>
                                </Card>
                            </Col>
                            <Col span={12}>
                                <Card>
                                    <div style={{ textAlign: "center" }}>
                                        <Text type="secondary">Distancia Total</Text>
                                        <Title level={3} style={{ margin:"8px 0", color:"#52c41a" }}>
                                            {parseFloat(statistics.totalDistancia).toFixed(2)} km
                                        </Title>
                                    </div>
                                </Card>
                            </Col>
                            <Col span={12}>
                                <Card>
                                    <div style={{ textAlign: "center" }}>
                                        <Text type="secondary">Calorias Totalee</Text>
                                        <Title level={3} style={{ margin: "8px 0", color: "#ff4d4f"}}>
                                            {statistics.totalCalorias ? parseFloat(statistics.totalCalorias).toFixed(0) : 0}
                                        </Title>
                                    </div>
                                </Card>
                            </Col>
                            <Col span={12}>
                                <Card>
                                    <div style={{ textAlign: "center" }}>
                                        <Text type="secondary">Desnivel Total</Text>
                                        <Title level={3} style={{ margin: "8px 0", color: "#1890ff"}}>
                                            {statistics.totalDesnivel || 0} m
                                        </Title>
                                    </div>
                                </Card>
                            </Col>
                        </Row>
                    ) : (
                        <Empty description="No hay estadisticas disponibles" />
                    )}
                </div>
            ),
        },
    ];

    return(
        <Drawer
            title={
                <div>
                    <Title level={4} style={{ margin: 0}}>
                        Actividad del {activity.fecha ? formatDateToSpanish(activity.fecha) : "" }
                    </Title>
                    <Text type="secondary" style={{ fontSize: "16px"}}>
                         {parseFloat(activity.distancia).toFixed(2)} km · {formatDuration(activity.duracion)}
                    </Text>
                </div>
            }
            placement="right"
            onClose={onClose}
            open={open}
            width={600}
            style={{
                body: { padding: 0 }
            }}
        >
         {/* Información rápidad de la actividad */}
            <div style={{ padding: "16px", backgroundColor: "#fafafa"}}>
                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        <Card size="small">
                            <Space direction="vertical" size={0}>
                                <Text type="secondary">
                                    <ClockCircleOutlined /> Duración
                                </Text>
                                <Text strong style={{ fontSize: "16px" }}>
                                    {formatDuration(activity.duracion)}
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
                                    {parseFloat(activity.velocidadMedia).toFixed(1)} km/h
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
                                    {calculatePace(activity.distancia, activity.duracion)}
                                </Text>
                            </Space>
                        </Card>
                    </Col>

                    <Col span={12}>
                        <Card size="small">
                            <Space direction="vertical" size={0}>
                                <Text type="secondary">
                                    <FireOutlined /> Calorias
                                </Text>
                                <Text strong style={{ fontSize: "16px"}}>
                                    {activity.calorias ? parseFloat(activity.calorias).toFixed(0) : "N/A"}
                                </Text>
                            </Space>
                        </Card>
                    </Col>
                </Row>

                {/* Datos de la bici y de la ruta */}
                <div style={{ marginTop: "16px", padding: "12px", backgroundColor: "white", borderRadius: "8px"}}>
                    <div style={{ marginBottom: "8px"}}>
                        <Text type="secondary">⚡ Velocidad Máxima: </Text>
                        <Text strong>{parseFloat(activity.velocidadMax).toFixed(1)} km/h</Text>
                    </div>
                    {activity.bike_name && (
                        <div style={{ marginBottom: "8px" }}>
                            <Text type="secondary">🚴 Bici: </Text>
                            <Text strong>{activity.bike_name}</Text>
                        </div>
                    )}
                    {activity.route_name && (
                        <div>
                            <Text type="secondary">🗺️ Ruta: </Text>
                            <Text strong>{activity.route_name}</Text>
                        </div>
                    )}
                </div>
            </div>   

            <Divider style={{ margin: 0 }} />

            {/* Tabs con comentarios, fotos y valoraciones */}

            <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                items={items}
                style={{ padding: "0 16px" }}
            />
        </Drawer>
    );
}

export default ActivityDrawer;