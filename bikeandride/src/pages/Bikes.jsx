import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Card,
  Row,
  Col,
  Button,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  message,
  Typography,
  Empty,
  Spin,
  Tag,
  Drawer,
  Tabs,
  Descriptions,
  Space,
  Popconfirm,
  Switch,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, PictureOutlined, InfoCircleOutlined, ToolOutlined, AppstoreOutlined, UnorderedListOutlined, EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { useBikes } from "../context/BikeContext";
import BikeImageCarousel from "../components/BikeImageCarousel";
import '../styles/animation.css';

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

function Bikes() {
  const { bikes, loading, fetchBikes, addBike, updateBike, deleteBike } = useBikes();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBike, setEditingBike] = useState(null);
  const [displayMode, setDisplayMode] = useState('cards');
  const [showSoldBikes, setShowSoldBikes] = useState(() => {
    const saved = localStorage.getItem('showSoldBikes');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [form] = Form.useForm();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedBike, setSelectedBike] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchBikes();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('action') === 'create') {
      showAddModal();
      navigate('/bikes', {replace: true});
    }
  }, [location.search]);

  useEffect(() => {
    if (bikes.length > 0) {
      console.log("bicis cargadas: ", bikes);
    }
  }, [bikes]);

  const showAddModal = () => {
    setEditingBike(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const showEditModal = (bike) => {
    setEditingBike(bike);
    form.setFieldsValue({
      type: bike.tipo_bici,
      birthday: bike.anio ? Number(bike.anio) : null,
      weight: bike.peso ? Number(bike.peso) : null,
      status: bike.status,
    });
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingBike(null);
    form.resetFields();
  };

  const handleToggleSoldBikes = (checked) => {
    setShowSoldBikes(checked);
    localStorage.setItem('showSoldBikes', JSON.stringify(checked));
  };

const handleSave = async (values) => {
  try {
    if (editingBike) {
  // Solo enviar campos que realmente cambiaron
  const updateData = {};
  
  if (values.type && values.type !== editingBike.tipo_bici) {
    updateData.type = values.type;
  }
  if (values.birthday && values.birthday !== parseInt(editingBike.anio)) {
    updateData.birthday = values.birthday;
  }
  if (values.weight && values.weight !== parseFloat(editingBike.peso)) {
    updateData.weight = parseFloat(values.weight);
  }
  if (values.status && values.status !== editingBike.status) {
    updateData.status = values.status;
  }
  
  // Verificar que hay algo que actualizar
  if (Object.keys(updateData).length === 0) {
    message.info("No hay cambios que guardar");
    handleCancel();
    return;
  }
      
      console.log("Actualizando bici con:", updateData);
      await updateBike(editingBike.id_bici, updateData);
      message.success("Bicicleta actualizada correctamente");
      
    } else {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.idUser) {
        message.error("Usuario no autenticado");
        return;
      }

      const createData = {
        type: values.type,
        bike_brand: values.bike_brand,
        model: values.model,
        birthday: values.birthday.toString(),
        weight: values.peso ? parseFloat(values.peso) : null,
        bike_material: values.bike_material || null,
        status: values.status,
        user: { idUser: user.idUser }
      };

      console.log("Creando bici con:", createData);
      await addBike(createData);
      message.success("Bicicleta añadida correctamente");
    }

    handleCancel();
    fetchBikes();
  } catch (error) {
    console.error("Error:", error);
    message.error(error.message || "Error al guardar la bicicleta");
  }
};

const handleCardClick = (bike) => {
  setSelectedBike(bike);
  setDrawerVisible(true);
};

const handleDrawerClose = () => {
  setDrawerVisible(false);
  setSelectedBike(null);
};

  const handleDelete = async (bikeId) => {
      try {
          await updateBike(bikeId, { status: 'vendida' });
          message.success('Bicicleta marcada como vendida');
          fetchBikes();
      } catch (error) {
          message.error(error.message || 'Error al marcar como vendida');
      }
  };

  const getBikeIcon = (type) => {
    const icons = {
      mtb: "🚵",
      road: "🚴",
      gravel: "🏞️",
      "e-mtb": "⚡🚵",
      "e-road": "⚡🚴",
      "e-gravel": "⚡🏞️",
    };
    return icons[type] || "🚴";
  };

  const getStatusColor = (status) => {
    const colors = {
      "en uso": "green",
      vendida: "red",
      "en mantenimiento": "orange",
    };
    return colors[status] || "default";
  };

  return (
    <div style={{ padding: "40px 24px", minHeight: "calc(100vh - 200vh)", maxWidth: "100vw", width: "100%" }}>
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
          <i
            className="fa-solid fa-bicycle"
            style={{ marginRight: "12px", color: "#1890ff" }}
          ></i>
          Mis Bicis
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={showAddModal}
        >
          Añadir Bicicletas
        </Button>
      </div>
      <div style={{ marginBottom: "24px", display: "flex", justifyContent: "flex-end", gap: "16px", alignItems: "center" }}>
  
  <Space>
    <Text style={{ marginRight: "8px" }}>Mostrar vendidas:</Text>
    <Switch
      checked={showSoldBikes}
      onChange={handleToggleSoldBikes}
      checkedChildren={<EyeOutlined />}
      unCheckedChildren={<EyeInvisibleOutlined />}
    />
  </Space>
  
  {/* Space existente con botones Cards/Lista */}
  <Space>
    <Button
      type={displayMode === 'cards' ? 'primary' : 'default'}
      icon={<AppstoreOutlined />}
      onClick={() => setDisplayMode('cards')}
      className="button-hover"
    >
    </Button>
    <Button
      type={displayMode === 'list' ? 'primary' : 'default'}
      icon={<UnorderedListOutlined />}
      onClick={() => setDisplayMode('list')}
      className="button-hover"
    >
    </Button>
  </Space>
</div>
      {loading && (
        <div style={{ textAlign: "center", padding: "100px 50px " }}>
          <Spin size="large" />
          <div style={{ marginTop: "16px" }}>
            <Text type="secondary">Cargando tus bicis...</Text>
          </div>
        </div>
      )}
      {!loading && bikes.length === 0 && (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <span>
              No tienes ninguna bicicleta añadida aún!!
              <br />
              ¡A que esperas para añadir una!
            </span>
          }
          style={{ padding: "50px" }}
        >
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={showAddModal}
          ></Button>
        </Empty>
      )}

{!loading && bikes.length > 0 && (
  <>
    {(() => {
      const filteredBikes = showSoldBikes
        ? bikes
        : bikes.filter(bike => bike.status !== 'vendida');
      
      return (
        <>
          {displayMode === 'cards' ? (
            <Row gutter={[16, 16]} className="fade-in-fast">
              {filteredBikes.map((bike) => (
                <Col xs={24} sm={12} md={12} lg={12} xl={8} key={bike.id_bici} className="card-animate">
                  <Card
                    hoverable
                    onClick={() => handleCardClick(bike)}
                    className="card-hover"
                    style={{ height: "100%" ,width: "100%", minWidth: '280px'}}
                    cover={
                      <div
                        style={{
                          height: "100px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "60px",
                          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        }}
                      >
                        {getBikeIcon(bike.tipo_bici)}
                      </div>
                    }
                    actions={[
                      <Button
                        type="text"
                        icon={<EditOutlined />}
                        disabled={bike.status === "vendida"}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (bike.status !== "vendida"){
                            showEditModal(bike);
                          }
                        }}
                      >
                        {bike.status === "vendida" ? "vendida" : "Editar"}
                      </Button>,
                      <Popconfirm
                        key="delete"
                        title="¿Eliminar bicicleta?"
                        description={bike.status === 'vendida' ? "No puedes eliminar una bici vendida" : "Esta acción no se puede deshacer"}
                        onConfirm={(e) => {
                          e?.stopPropagation();
                          handleDelete(bike.id_bici);
                        }}
                        okText="Sí, eliminar"
                        cancelText="Cancelar"
                        okButtonProps={{ danger: true }}
                      >
                        <Button 
                          type="text" 
                          danger 
                          icon={<DeleteOutlined />}
                          disabled={bike.status === 'vendida'}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {bike.status === 'vendida' ? 'Vendida' : 'Eliminar'}
                        </Button>
                      </Popconfirm>,
                    ]}
                  >
                    <Card.Meta
                      title={
                        <div style={{ fontSize: "18px", fontWeight: "bold" }}>
                          {bike.marca} {bike.modelo}
                        </div>
                      }
                      description={
                        <div>
                          <div style={{ marginBottom: "8px" }}>
                            <Tag color={getStatusColor(bike.status)}>
                              {bike.status}
                            </Tag>
                          </div>
                          <div style={{ marginBottom: "8px" }}>
                            <Text strong>Año:</Text> {bike.anio}
                          </div>
                          <div style={{ marginBottom: "8px" }}>
                            <Text strong>Tipo:</Text> {bike.tipo_bici}
                          </div>
                          {bike.peso && (
                            <div style={{ marginBottom: "8px" }}>
                              <Text strong>Peso:</Text> {parseFloat(bike.peso).toFixed(2)} kg
                            </div>
                          )}
                          {bike.material && (
                            <div>
                              <Text strong>Material:</Text> {bike.material}
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
  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }} className="fade-in-fast">
    {filteredBikes.map((bike) => (
      <Card
        key={bike.id_bici}
        hoverable
        onClick={() => handleCardClick(bike)}
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
          {/* Icono - siempre visible */}
          <div style={{ minWidth: '60px', display: 'flex', justifyContent: 'center' }}>
            {bike.image_url ? (
              <img 
                src={bike.image_url} 
                alt={bike.modelo}
                style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }}
              />
            ) : (
              <div style={{ 
                width: '50px', 
                height: '50px', 
                backgroundColor: '#f0f0f0', 
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px'
              }}>
                🚴
              </div>
            )}
          </div>

          {/* Marca y Modelo - siempre visible */}
          <div style={{ flex: 1, minWidth: '150px' }}>
            <Text strong style={{ fontSize: '16px', display: 'block' }}>
              {bike.marca}
            </Text>
            <div style={{ color: '#666', fontSize: '14px' }}>{bike.modelo}</div>
          </div>

          {/* Tipo - solo desktop */}
          <div style={{ 
            minWidth: '100px', 
            textAlign: 'center',
            display: window.innerWidth < 768 ? 'none' : 'block'
          }}>
            <Tag color="blue">{bike.tipo_bici}</Tag>
          </div>

          {/* Año - solo desktop */}
          <div style={{ 
            minWidth: '80px', 
            textAlign: 'center',
            display: window.innerWidth < 768 ? 'none' : 'block'
          }}>
            📅 {bike.anio}
          </div>

          {/* Peso - móvil y desktop */}
          <div style={{ minWidth: '80px', textAlign: 'center', marginRight: window.innerWidth < 768 ? '8px' : '0'  }}>
            <Text strong>⚖️ {bike.peso} kg</Text>
          </div>

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
                disabled={bike.status === "vendida"}
                onClick={(e) => {
                  e.stopPropagation();
                  if (bike.status !== "vendida") {
                    showEditModal(bike);
                  }
                }}
                style={{ 
                  fontSize: window.innerWidth < 768 ? '14px' : '16px',
                  padding: window.innerWidth < 768 ? '4px 8px' : undefined
                }}
              >
                {window.innerWidth >= 768 && (bike.status === "vendida" ? "Vendida" : "Editar")}
              </Button>
              <Popconfirm
                title="¿Eliminar bicicleta?"
                description={bike.status === 'vendida' ? "No puedes eliminar una bici vendida" : "Esta acción no se puede deshacer"}
                onConfirm={(e) => {
                  e?.stopPropagation();
                  handleDelete(bike.id_bici);
                }}
                okText="Sí, eliminar"
                cancelText="Cancelar"
                okButtonProps={{ danger: true }}
              >
                <Button 
                  type="text" 
                  danger 
                  icon={<DeleteOutlined />}
                  disabled={bike.status === 'vendida'}
                  onClick={(e) => e.stopPropagation()}
                  style={{ 
                    fontSize: window.innerWidth < 768 ? '14px' : '16px',
                    padding: window.innerWidth < 768 ? '4px 8px' : undefined
                  }}
                >
                  {window.innerWidth >= 768 && (bike.status === 'vendida' ? 'Vendida' : 'Eliminar')}
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
      );
    })()}
  </>
)}

      <Modal
        title={
          <span style={{ fontSize: "20px", fontWeight: "bold" }}>
            <i
              className="fa-solid fa-bicycle"
              style={{ marginRight: "8px", color: "#1890ff" }}
            ></i>
            {editingBike ? "Editar Bicicleta" : "Añadir Bicicleta"}
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
          {!editingBike && (
            <>
              <Form.Item
                label="Tipo de Bicicleta"
                name="type" // Campo backend: type
                rules={[
                  {
                    required: true,
                    message: "Selecciona el tipo de bicicleta",
                  },
                ]}
              >
                <Select placeholder="Selecciona el tipo de bici" size="large">
                  <Option value="road">🚴 Carretera</Option>
                  <Option value="mtb">🚵 Montaña (MTB)</Option>
                  <Option value="gravel">🏞️ Gravel</Option>
                  <Option value="e-road">⚡🚴 E-Carretera</Option>
                  <Option value="e-mtb">⚡🚵 E-Montaña</Option>
                  <Option value="e-gravel">⚡🏞️ E-Gravel</Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="Marca"
                name="bike_brand" // Campo backend: bike_brand
                rules={[
                  {
                    required: true,
                    message: "Por favor introduce, la marca de la bicicleta",
                  },
                ]}
              >
                <Input
                  placeholder="Ej. Trek, Orbea, MMR, Megano..."
                  size="large"
                />
              </Form.Item>
              <Form.Item
                label="Modelo"
                name="model" // Campo backend: model
                rules={[
                  {
                    required: true,
                    message: "Por favor, introduce el modelo de la bicicleta",
                  },
                ]}
              >
                <Input
                  placeholder="Orca, Alma, Madonne, Forest..."
                  size="large"
                />
              </Form.Item>
              <Form.Item
                label="Año"
                name="birthday" // Campo backend: birthday
                rules={[
                  { required: true, message: "Ingresa el año de tu bicicleta" },
                ]}
              >
                <InputNumber
                  placeholder="2023"
                  size="large"
                  style={{ width: "100%" }}
                  min={1900}
                  max={new Date().getFullYear() + 1}
                />
              </Form.Item>
              <Form.Item
                label="Peso (kg)"
                name="weight" // Campo backend: weight
                rules={[
                  {
                    required: true,
                    message: "Por favor, introduce el peso de la bicicleta",
                  },
                ]}
              >
                <InputNumber
                  placeholder="12.5"
                  size="large"
                  style={{ width: "100%" }}
                  min={0}
                  step={0.1}
                  precision={2}
                />
              </Form.Item>
              <Form.Item
                label="Material"
                name="bike_material" // Campo backend: bike_material
              >
                <Input
                  placeholder="Ej: Aluminio, Carbono, Acero..."
                  size="large"
                />
              </Form.Item>
                
              <Form.Item
                label="Estado"
                name="status" // Campo backend: status
                rules={[
                  {
                    required: true,
                    message: "Selecciona el estado de tu bicicleta",
                  },
                ]}
                initialValue="en uso"
              >
                <Select size="large">
                  <Option value="en uso">✅ En uso</Option>
                  <Option value="en mantenimiento">🔧 En mantenimiento</Option>
                  <Option value="vendida">💰 Vendida</Option>
                </Select>
              </Form.Item>
            </>
          )}
          {editingBike && (
            <>
              <div
                style={{
                  marginBottom: "24px",
                  padding: "16px",
                  background: "#f0f2f5",
                  borderRadius: "8px",
                }}
              >
                <Text strong style={{ fontSize: "16px" }}>
                  {editingBike.marca} {editingBike.modelo}
                </Text>
                <div style={{ marginTop: "8px", color: "#8c8c8c" }}>
                  Solo puedes editar: Tipo, peso Año y Estado
                </div>
              </div>

              <Form.Item
                label="Tipo de Bicicleta"
                name="type"
                rules={[
                  {
                    message: "Selecciona el tipo de bicicleta",
                  },
                ]}
              >
                <Select placeholder="Selecciona el tipo de bici" size="large">
                  <Option value="road">🚴 Carretera</Option>
                  <Option value="mtb">🚵 Montaña (MTB)</Option>
                  <Option value="gravel">🏞️ Gravel</Option>
                  <Option value="e-road">⚡🚴 E-Carretera</Option>
                  <Option value="e-mtb">⚡🚵 E-Montaña</Option>
                  <Option value="e-gravel">⚡🏞️ E-Gravel</Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Año"
                name="birthday"
                
              >
                <InputNumber
                  placeholder="2023"
                  size="large"
                  style={{ width: "100%" }}
                  min={1900}
                  max={new Date().getFullYear() + 1}
                />
              </Form.Item>

              <Form.Item
                label="Peso (kg)"
                name="weight"
                
                >
                  <InputNumber
                    placeholder="12.5"
                    size="large"
                    style={{ width: "100%" }}
                    min={0}
                    step={0.1}
                    precision={2}
                  />
                </Form.Item>

              <Form.Item
                label="Estado"
                name="status"
                
              >
                <Select size="large">
                  <Option value="en uso">✅ En uso</Option>
                  <Option value="en mantenimiento">🔧 En mantenimiento</Option>
                  <Option value="vendida">💰 Vendida</Option>
                </Select>
              </Form.Item>
            </>
          )}
          <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
            <Button onClick={handleCancel} style={{ marginRight: "8px" }}>
              Cancelar
            </Button>
            <Button type="primary" htmlType="submit">
              {editingBike ? "Guardar Cambios" : "Añadir Bicicleta"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Drawer con detalles de la bicicleta */}
      <Drawer
        title={selectedBike ? `${selectedBike.marca} ${selectedBike.modelo}` : "Detalles"}
        placement="right"
        onClose={handleDrawerClose}
        open={drawerVisible}
        width={600}
      >
        {selectedBike && (
          <Tabs defaultActiveKey="1">
            {/* Pestaña de fotos */ }
            <TabPane
              tab={
                <span>
                  <PictureOutlined /> Fotos
                </span>
              }
              key="1"
            >
              <BikeImageCarousel bikeId={selectedBike.id_bici} />
            </TabPane>

            {/* Pestaña de información de la bici */}
            <TabPane
              tab={
                <span>
                  <InfoCircleOutlined /> Información
                </span>
              }
              key="2"
            >
              <Descriptions bordered column={1} style={{ marginBottom: '24px' }}>
                <Descriptions.Item label="Marca">{selectedBike.marca}</Descriptions.Item>
                <Descriptions.Item label="Modelo">{selectedBike.modelo}</Descriptions.Item>
                <Descriptions.Item label="tipo">{selectedBike.tipo_bici}</Descriptions.Item>
                <Descriptions.Item label="Año">{selectedBike.anio}</Descriptions.Item>
                <Descriptions.Item label="Estado">
                  <Tag color={getStatusColor(selectedBike.status)}>
                    {selectedBike.status}
                  </Tag>
                </Descriptions.Item>
                {selectedBike.peso && (
                  <Descriptions.Item label="Peso">
                    {parseFloat(selectedBike.peso).toFixed(2)} kg
                  </Descriptions.Item>
                )}
                {selectedBike.material && (
                  <Descriptions.Item label="Material">
                    {selectedBike.material}
                  </Descriptions.Item>
                )}
              </Descriptions>

              {selectedBike.status !== "vendida" ? (
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => {
                  handleDrawerClose();
                  showEditModal(selectedBike);
                }}
                block
              >
                Editar Bici
              </Button>
            ) : (
              <Button
                disabled
                block
              >
                ❌ Bicicleta vendida - No editable
              </Button>
            )}
            </TabPane>

            {/* Pestaña mantenimiento **Proximamente** */}
            <TabPane
              tab={
                <span>
                  <ToolOutlined /> Mantenimiento
                </span>
              }
              key="3"
            >
              <Empty description="Historial de mantenimiento. - PROXIMAMENTE -" />
            </TabPane>
          </Tabs>
        )}
      </Drawer>
    </div>
  );
}

export default Bikes;
