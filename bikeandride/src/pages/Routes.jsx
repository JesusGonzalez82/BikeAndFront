import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Typography,
  Card,
  Row,
  Col,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  message,
  Empty,
  Spin,
  Popconfirm,
  Tag,
  Drawer,
  Tabs,
  Descriptions,
  Space,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, EnvironmentOutlined, PictureOutlined, InfoCircleOutlined, AppstoreOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { useRoutes } from "../context/RouteContext";
import RouteCoverImage from "../components/RouteCoverImage";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;

function Routes() {
  const { routes, loading, fetchRoutes, addRoute, updateRoute, deleteRoute } = useRoutes();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);
  const [form] = Form.useForm();
  const [drawerVisbile, setDrawerVisible] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [displayMode, setDisplayMode] = useState('cards');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchRoutes();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if(params.get('action') === 'create'){
      showAddModal();
      navigate('/routes', {replace: true});
    }
  }, [location.search]);

  const showAddModal = () => {
    setEditingRoute(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const showEditModal = (route) => {
    setEditingRoute(route);
    form.setFieldsValue({
      nombreRuta: route.nombreRuta,
      distancia: route.distancia,
      desnivel: route.desnivel,
      tipoTerreno: route.tipoTerreno,
      descripcionRuta: route.descripcionRuta,
    });
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingRoute(null);
    form.resetFields();
  };

  const handleSave = async (values) => {
    try {
      if (editingRoute) {
        await updateRoute(editingRoute.idRuta, values);
        message.success("Ruta actualizada correctamente");
      } else {
        await addRoute(values);
        message.success("Ruta creada correctamente");
      }
      handleCancel();
      fetchRoutes();
    } catch (error) {
      console.error("Error al guardar la ruta:", error);
      message.error(error.message || "Error al guardar la ruta");
    }
  };

  const handleDelete = async (routeId) => {
    try {
      await deleteRoute(routeId);
      fetchRoutes();
    } catch (error) {
      message.error(error.message || "Error al eliminar la ruta");
    }
  };

  const handleCardClick = (route) => {
    setSelectedRoute(route);
    setDrawerVisible(true);
  };

  const handleDrawerClose = () => {
    setDrawerVisible(false);
    setSelectedRoute(null);
  };

  const getTerrainColor = (tipo) => {
    const colors = {
      asfalto: "blue",
      montaña: "green",
      mixto: "orange",
    };
    return colors[tipo] || "default";
  };

  const getTerrainIcon = (tipo) => {
    const icons = {
      asfalto: "🛣️",
      montaña: "⛰️",
      mixto: "🌄",
    };
    return icons[tipo] || "🗺️";
  };

  return (
    <div style={{ padding: "24px", maxWidth: "100vw", width: '100%'}}>
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
          <EnvironmentOutlined style={{ marginRight: "12px", color: "#52c41a" }} />
          Mis Rutas
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={showAddModal}
          style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
        >
          Añadir Ruta
        </Button>
      </div>

      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'flex-end'}}>
        <Space>
          <Button
            type={displayMode === 'cards' ? 'primary' : 'default'}
            icon={<AppstoreOutlined />}
            onClick={() => setDisplayMode('cards')}
            style={{
              backgroundColor: displayMode === 'cards' ? '#52c41a' : undefined,
              borderColor: displayMode === 'cards' ? '#52c41a' : undefined
            }}
            className="button-hover"
          />
          <Button
            type={displayMode === 'list' ? 'primary' : 'default'}
            icon={<UnorderedListOutlined />}
            onClick={() => setDisplayMode('list')}
            style={{
              backgroundColor: displayMode === 'list' ? '#52c41a' : undefined,
              borderColor: displayMode === 'list' ? '#52c41a' : undefined
            }}
            className="button-hover"
          />
        </Space>
      </div>

      {loading && (
        <div style={{ textAlign: "center", padding: "100px 50px" }}>
          <Spin size="large" />
          <div style={{ marginTop: "16px" }}>
            <Text type="secondary">Cargando tus rutas...</Text>
          </div>
        </div>
      )}

      {!loading && routes.length === 0 && (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <span>
              No tienes ninguna ruta añadida aún!
              <br />
              ¡Añade tu primera ruta!
            </span>
          }
          style={{ padding: "50px" }}
        >
          <Button type="primary" icon={<PlusOutlined />} onClick={showAddModal}>
            Añadir Primera Ruta
          </Button>
        </Empty>
      )}

{!loading && routes.length > 0 && (
  <>
    {displayMode === 'cards' ? (
      <Row gutter={[16, 16]} className="fade-in-fast">
        {routes.map((route) => (
          <Col xs={24} sm={24} md={12} lg={8} key={route.idRuta} className="card-animate">
            <Card
              hoverable
              onClick={() => handleCardClick(route)}
              className="card-hover"
              style={{ height: "100%", width: "100%", minWidth: "280px" }}
              cover={
                <div
                  style={{
                    height: "150px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "80px",
                    background: "linear-gradient(135deg, #52c41a 0%, #73d13d 100%)",
                  }}
                >
                  {getTerrainIcon(route.tipoTerreno)}
                </div>
              }
              actions={[
                <Button
                  key="edit"
                  type="text"
                  icon={<EditOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    showEditModal(route);
                  }}
                >
                  Editar
                </Button>,
                <Popconfirm
                  key="delete"
                  title="¿Eliminar ruta?"
                  description="Esta acción no se puede deshacer"
                  onConfirm={(e) => {
                    e?.stopPropagation();
                    handleDelete(route.idRuta);
                  }}
                  okText="Sí, eliminar"
                  cancelText="Cancelar"
                  okButtonProps={{ danger: true }}
                >
                  <Button 
                    type="text" 
                    danger 
                    icon={<DeleteOutlined />}
                    onClick={(e) => e.stopPropagation()}
                  >
                    Eliminar
                  </Button>
                </Popconfirm>
              ]}
            >
              <Card.Meta
                title={
                  <div style={{ fontSize: "16px", fontWeight: "bold" }}>
                    {route.nombreRuta}
                  </div>
                }
                description={
                  <div>
                    <div style={{ marginBottom: "8px" }}>
                      <Tag color={getTerrainColor(route.tipoTerreno)}>
                        {route.tipoTerreno}
                      </Tag>
                    </div>
                    <div style={{ marginBottom: "6px" }}>
                      <Text strong>Distancia:</Text> {route.distancia} km
                    </div>
                    <div style={{ marginBottom: "6px" }}>
                      <Text strong>Desnivel:</Text> {route.desnivel} m
                    </div>
                    {route.descripcionRuta && (
                      <div style={{ marginTop: "8px", fontSize: "12px", color: "#8c8c8c" }}>
                        {route.descripcionRuta.substring(0, 60)}
                        {route.descripcionRuta.length > 60 ? "..." : ""}
                      </div>
                    )}
                  </div>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>
) : (
  // VISTA DE LISTA
  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} className="fade-in-fast">
    {routes.map((route) => (
      <Card
        key={route.idRuta}
        hoverable
        onClick={() => handleCardClick(route)}
        className="card-hover slide-in-up"
        style={{ cursor: 'pointer', width: '100%' }}
      >
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          padding: '12px',
          gap: '12px',
          flexWrap: 'wrap'
        }}>
          {/* Icono del terreno - siempre visible */}
          <div style={{ 
            minWidth: '60px',
            fontSize: window.innerWidth < 768 ? '32px' : '40px',
            textAlign: 'center'
          }}>
            {getTerrainIcon(route.tipoTerreno)}
          </div>

          {/* Nombre de la ruta - siempre visible */}
          <div style={{ flex: 1, minWidth: '150px' }}>
            <Text strong style={{ fontSize: '16px', display: 'block' }}>
              {route.nombreRuta}
            </Text>
            {/* Descripción solo en desktop */}
            {window.innerWidth >= 768 && route.descripcionRuta && (
              <div style={{ color: '#8c8c8c', fontSize: '12px', marginTop: '4px' }}>
                {route.descripcionRuta.substring(0, 50)}
                {route.descripcionRuta.length > 50 ? "..." : ""}
              </div>
            )}
          </div>

          {/* Tipo de terreno - solo desktop */}
          {window.innerWidth >= 768 && (
            <div style={{ minWidth: '100px', textAlign: 'center' }}>
              <Tag color={getTerrainColor(route.tipoTerreno)}>
                {route.tipoTerreno}
              </Tag>
            </div>
          )}

          {/* Distancia - siempre visible */}
          <div style={{ minWidth: '80px', textAlign: 'center' }}>
            <Text strong>📏 {route.distancia} km</Text>
          </div>

          {/* Desnivel - solo desktop */}
          {window.innerWidth >= 768 && (
            <div style={{ minWidth: '80px', textAlign: 'center' }}>
              <Text strong>📈 {route.desnivel} m</Text>
            </div>
          )}

          {/* Acciones - siempre visible */}
          <div style={{ 
            minWidth: window.innerWidth < 768 ? '100%' : '150px',
            textAlign: 'right',
            display: 'flex',
            justifyContent: window.innerWidth < 768 ? 'space-around' : 'flex-end',
            gap: '8px',
            marginTop: window.innerWidth < 768 ? '8px' : '0'
          }}>
            <Space size="small">
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  showEditModal(route);
                }}
                style={{ 
                  fontSize: window.innerWidth < 768 ? '14px' : '16px',
                  padding: window.innerWidth < 768 ? '4px 8px' : undefined
                }}
              >
                {window.innerWidth >= 768 && "Editar"}
              </Button>
              <Popconfirm
                title="¿Eliminar ruta?"
                description="Esta acción no se puede deshacer"
                onConfirm={(e) => {
                  e?.stopPropagation();
                  handleDelete(route.idRuta);
                }}
                okText="Sí, eliminar"
                cancelText="Cancelar"
                okButtonProps={{ danger: true }}
              >
                <Button 
                  type="text" 
                  danger 
                  icon={<DeleteOutlined />}
                  onClick={(e) => e.stopPropagation()}
                  style={{ 
                    fontSize: window.innerWidth < 768 ? '14px' : '16px',
                    padding: window.innerWidth < 768 ? '4px 8px' : undefined
                  }}
                >
                  {window.innerWidth >= 768 && "Eliminar"}
                </Button>
              </Popconfirm>
            </Space>
          </div>
        </div>
      </Card>
    ))}
  </div>
)}
  </>
)}

      <Modal
        title={
          <span style={{ fontSize: "20px", fontWeight: "bold" }}>
            <EnvironmentOutlined style={{ marginRight: "8px", color: "#52c41a" }} />
            {editingRoute ? "Editar Ruta" : "Añadir Ruta"}
          </span>
        }
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
          style={{ marginTop: "24px" }}
        >
          <Form.Item
            label="Nombre de la Ruta"
            name="nombreRuta"
            rules={[{ required: true, message: "Por favor ingresa el nombre de la ruta" }]}
          >
            <Input placeholder="Ej: Ruta por la Sierra" size="large" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Distancia (km)"
                name="distancia"
                rules={[{ required: true, message: "Ingresa la distancia" }]}
              >
                <InputNumber
                  placeholder="45.5"
                  size="large"
                  style={{ width: "100%" }}
                  min={0}
                  step={0.1}
                  precision={2}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Desnivel (m)"
                name="desnivel"
                rules={[{ required: true, message: "Ingresa el desnivel" }]}
              >
                <InputNumber
                  placeholder="850"
                  size="large"
                  style={{ width: "100%" }}
                  min={0}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Tipo de Terreno"
            name="tipoTerreno"
            rules={[{ required: true, message: "Selecciona el tipo de terreno" }]}
          >
            <Select placeholder="Selecciona el tipo de terreno" size="large">
              <Option value="asfalto">🛣️ Asfalto</Option>
              <Option value="montaña">⛰️ Montaña</Option>
              <Option value="mixto">🌄 Mixto</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Descripción" name="descripcionRuta">
            <TextArea
              placeholder="Describe la ruta, puntos de interés, dificultad..."
              rows={4}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
            <Button onClick={handleCancel} style={{ marginRight: "8px" }}>
              Cancelar
            </Button>
            <Button type="primary" htmlType="submit">
              {editingRoute ? "Guardar Cambios" : "Añadir Ruta"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      {/* Drawer con detalles de la ruta */ }
      <Drawer
        title={selectedRoute ? selectedRoute.nombreRuta : "Detalles de la ruta"}
        placement="right"
        onClose={handleDrawerClose}
        open={drawerVisbile}
        width={600}
      >
        {selectedRoute && (
          <Tabs defaultActiveKey="1">
            {/* Foto de portada */}
            <TabPane
              tab={
                <span>
                  <PictureOutlined /> Foto de portada
                </span>
              }
              key="1"
            >
              <RouteCoverImage routeId={selectedRoute.idRuta} />
            </TabPane>

            <TabPane
              tab={
                <span>
                  <InfoCircleOutlined /> Información
                </span>
              }
              key="2"
            >
              <Descriptions bordered column={1} style={{ marginBottom: "24px" }}>
                <Descriptions.Item label="Nombre">{selectedRoute.nombreRuta}</Descriptions.Item>
                <Descriptions.Item label="Distancia">{selectedRoute.distancia} km</Descriptions.Item>
                <Descriptions.Item label="Desnivel">{selectedRoute.desnivel} m</Descriptions.Item>
                <Descriptions.Item label="Tipo de Terreno">
                  <Tag color={getTerrainColor(selectedRoute.tipoTerreno)}>
                    {getTerrainColor} {selectedRoute.tipoTerreno}
                  </Tag>
                </Descriptions.Item>
                {selectedRoute.descripcionRuta && (
                    <Descriptions.Item label="Descripción">
                      {selectedRoute.descripcionRuta}
                    </Descriptions.Item>
                )}
              </Descriptions>

              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => {
                  handleDrawerClose();
                  showEditModal(selectedRoute);
                }}
                block
              >
                Editar Ruta
              </Button>
            </TabPane>
          </Tabs>
        )}
      </Drawer>
    </div>
  );
}

export default Routes;


