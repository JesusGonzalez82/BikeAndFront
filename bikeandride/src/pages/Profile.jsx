import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { 
  Typography, 
  Card, 
  Row, 
  Col, 
  Divider, 
  Button, 
  message, 
  Spin, 
  Upload,
  Modal,
  Form,
  Input,
  DatePicker,
  Popconfirm,
  Alert
} from "antd";
import { 
  EditOutlined, 
  MailOutlined, 
  CalendarOutlined, 
  UserOutlined, 
  CameraOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  StopOutlined
} from "@ant-design/icons";
import { useAuth } from "../context/AuthContext";
import ImageUpload from "../components/ImageUpload";
import {
  getProfileImage,
  getBannerImage,
  uploadBannerImage,
  base64ToImageUrl,
  validateImageSize,
  validateImageType,
} from "../services/imageService";
import { updateUser, deactivateUser, reactivateUser } from "../services/userService";

const { Title, Text } = Typography;

function Profile() {
  const { user, updateUserContext } = useAuth();
  const [profileImage, setProfileImage] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploadingBackground, setUploadingBackground] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [savingChanges, setSavingChanges] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (user?.idUser) {
      loadImages();
    }
  }, [user]);

  const loadImages = async () => {
    try {
      setLoading(true);

      try {
        const profileData = await getProfileImage(user.idUser);
        if (profileData) {
          const profileUrl = base64ToImageUrl(
            profileData.contenidoBase64,
            profileData.tipoMime
          );
          setProfileImage(profileUrl);
        }
      } catch (err) {
        console.log("No profile image found");
      }

      try {
        const bannerData = await getBannerImage(user.idUser);
        if (bannerData) {
          const bannerUrl = base64ToImageUrl(
            bannerData.contenidoBase64,
            bannerData.tipoMime
          );
          setBackgroundImage(bannerUrl);
        }
      } catch (err) {
        console.log("No background image found");
      }
    } catch (error) {
      console.error("Error loading images:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUploadSuccess = () => {
    message.success("Foto de perfil actualizada");
    setTimeout(() => {
      loadImages();
    }, 500);
  };

  const handleBackgroundUpload = async (file) => {
    try {
      validateImageSize(file);
      validateImageType(file);

      setUploadingBackground(true);

      const reader = new FileReader();
      reader.onload = (e) => {
        setBackgroundImage(e.target.result);
      };
      reader.readAsDataURL(file);

      await uploadBannerImage(user.idUser, file);
      message.success("Imagen de fondo actualizada");

      setTimeout(() => {
        loadImages();
      }, 500);
    } catch (error) {
      console.error("Error uploading background:", error);
      message.error(error.message || "Error al subir la imagen de fondo");
      setBackgroundImage(null);
    } finally {
      setUploadingBackground(false);
    }

    return false;
  };

  const showEditModal = () => {
    form.setFieldsValue({
      name: user?.name,
      email: user?.email,
      birthday: user?.birthday ? dayjs(user.birthday) : null,
    });
    setIsEditModalOpen(true);
  };

  const handleEditCancel = () => {
    setIsEditModalOpen(false);
    form.resetFields();
  };

  const handleEditSave = async (values) => {
    try {
      setSavingChanges(true);

      const updateData = {
        name: values.name,
        birthday: values.birthday.format("YYYY-MM-DD"),
      };

      await updateUser(user.idUser, updateData);
      
      // Actualizar contexto
      const updatedUser = {
        ...user,
        name: values.name,
        birthday: values.birthday.format("YYYY-MM-DD"),
      };
      updateUserContext(updatedUser);

      message.success("Perfil actualizado correctamente");
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      message.error(error.message || "Error al actualizar el perfil");
    } finally {
      setSavingChanges(false);
    }
  };

  const handleDeactivateAccount = async () => {
    try {
      await deactivateUser(user.idUser);
      
      const updatedUser = { ...user, status: "inactivo" };
      updateUserContext(updatedUser);

      message.warning("Cuenta desactivada. Puedes reactivarla en cualquier momento.");
    } catch (error) {
      console.error("Error deactivating account:", error);
      message.error("Error al desactivar la cuenta");
    }
  };

  const handleReactivateAccount = async () => {
    try {
      await reactivateUser(user.idUser);
      
      const updatedUser = { ...user, status: "activo" };
      updateUserContext(updatedUser);

      message.success("¡Cuenta reactivada con éxito!");
    } catch (error) {
      console.error("Error reactivating account:", error);
      message.error("Error al reactivar la cuenta");
    }
  };

  const birthdayFormat = user?.birthday
    ? dayjs(user.birthday).format("DD-MM-YYYY")
    : "";

  const calculateAge = () => {
    if (!user?.birthday) return "";
    const age = dayjs().diff(dayjs(user.birthday), "year");
    return `${age} años`;
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  const isActive = user?.status === "activo";

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Alerta de cuenta desactivada */}
      {!isActive && (
        <Alert
          message="Cuenta Desactivada"
          description="Tu cuenta está desactivada. No podrás acceder a todas las funcionalidades hasta que la reactives."
          type="warning"
          showIcon
          icon={<ExclamationCircleOutlined />}
          action={
            <Button size="small" type="primary" onClick={handleReactivateAccount}>
              Reactivar Cuenta
            </Button>
          }
          style={{ marginBottom: "24px" }}
        />
      )}

      <Card
        style={{
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          overflow: "hidden",
          position: "relative",
        }}
        styles={{
          body: { padding: 0 }
        }}
      >
        {/* Imagen de fondo con overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "200px",
            backgroundImage: backgroundImage
              ? `url(${backgroundImage})`
              : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            zIndex: 0,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(255,255,255,0.95))",
            }}
          />
        </div>

        {/* Contenido */}
        <div style={{ position: "relative", zIndex: 1, padding: "24px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "24px",
              marginTop: "80px",
              marginBottom: "24px",
              flexWrap: "wrap",
            }}
          >
            <div>
              <ImageUpload
                userId={user?.idUser}
                type="profile"
                currentImage={profileImage}
                onUploadSuccess={handleProfileUploadSuccess}
              />
            </div>

            <div style={{ flex: 1, minWidth: "200px" }}>
              <Title level={2} style={{ marginBottom: "8px", marginTop: "0" }}>
                {user?.name || "Usuario"}
              </Title>
              <Text type="secondary" style={{ fontSize: "16px" }}>
                Ciclista | Miembro desde{" "}
                {user?.birthday ? dayjs(user.birthday).format("YYYY") : "N/A"}
              </Text>
              <div style={{ marginTop: "16px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={showEditModal}
                >
                  Editar Perfil
                </Button>

                <Upload
                  beforeUpload={handleBackgroundUpload}
                  showUploadList={false}
                  accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
                >
                  <Button
                    icon={<CameraOutlined />}
                    loading={uploadingBackground}
                  >
                    {backgroundImage ? "Cambiar fondo" : "Añadir fondo"}
                  </Button>
                </Upload>
              </div>
            </div>
          </div>

          <Divider />

          <Row gutter={[24, 24]}>
            <Col xs={24} md={12}>
              <Card
                type="inner"
                title={
                  <span>
                    <UserOutlined style={{ marginRight: "8px", color: "#1890ff" }} />
                    Información Personal
                  </span>
                }
              >
                <div style={{ marginBottom: "16px" }}>
                  <Text type="secondary">Nombre Completo</Text>
                  <br />
                  <Text strong style={{ fontSize: "16px" }}>
                    {user?.name || "No especificado"}
                  </Text>
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <Text type="secondary">
                    <MailOutlined style={{ marginRight: "8px" }} />
                    Email
                  </Text>
                  <br />
                  <Text strong style={{ fontSize: "16px" }}>
                    {user?.email || "No especificado"}
                  </Text>
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <Text type="secondary">
                    <CalendarOutlined style={{ marginRight: "8px" }} />
                    Fecha de Nacimiento
                  </Text>
                  <br />
                  <Text strong style={{ fontSize: "16px" }}>
                    {birthdayFormat} {calculateAge() && `(${calculateAge()})`}
                  </Text>
                </div>

                <div>
                  <Text type="secondary">Estado de la cuenta</Text>
                  <br />
                  <Text
                    strong
                    style={{
                      fontSize: "16px",
                      color: isActive ? "#52c41a" : "#ff4d4f",
                    }}
                  >
                    {isActive ? "✓ Activa" : "✗ Inactiva"}
                  </Text>
                </div>
              </Card>
            </Col>

            <Col xs={24} md={12}>
              <Card
                type="inner"
                title={
                  <span>
                    <i
                      className="fa-solid fa-bicycle"
                      style={{ marginRight: "8px", color: "#52c41a" }}
                    ></i>
                    Estadísticas
                  </span>
                }
              >
                <div style={{ textAlign: "center", padding: "20px" }}>
                  <Text type="secondary">
                    Próximamente verás aquí tus estadísticas de ciclismo:
                    <br />
                    kilómetros totales, actividades, rutas favoritas, etc.
                  </Text>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </Card>

      {/* Modal de edición */}
      <Modal
        title={
          <span style={{ fontSize: "20px", fontWeight: "bold" }}>
            <EditOutlined style={{ marginRight: "8px", color: "#1890ff" }} />
            Editar Perfil
          </span>
        }
        open={isEditModalOpen}
        onCancel={handleEditCancel}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleEditSave}
          style={{ marginTop: "24px" }}
        >
          <Form.Item
            label="Nombre"
            name="name"
            rules={[
              { required: true, message: "El nombre es obligatorio" },
              { min: 2, message: "El nombre debe tener al menos 2 caracteres" }
            ]}
          >
            <Input placeholder="Tu nombre completo" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "El email es obligatorio" },
              { type: "email", message: "Email inválido" }
            ]}
          >
            <Input placeholder="tu@email.com" disabled />
          </Form.Item>

          <Form.Item
            label="Fecha de Nacimiento"
            name="birthday"
            rules={[
              { required: true, message: "La fecha de nacimiento es obligatoria" }
            ]}
          >
            <DatePicker
              style={{ width: "100%" }}
              format="DD-MM-YYYY"
              placeholder="Selecciona tu fecha de nacimiento"
            />
          </Form.Item>

          <Divider />

          {/* Sección de desactivar cuenta */}
          <div style={{ marginBottom: "24px" }}>
            <Text strong style={{ fontSize: "16px", display: "block", marginBottom: "12px" }}>
              Zona de Peligro
            </Text>
            {isActive ? (
              <Popconfirm
                title="¿Desactivar cuenta?"
                description="Tu cuenta será desactivada pero podrás reactivarla cuando quieras. No se eliminarán tus datos."
                onConfirm={handleDeactivateAccount}
                okText="Sí, desactivar"
                cancelText="Cancelar"
                okButtonProps={{ danger: true }}
              >
                <Button danger icon={<StopOutlined />} block>
                  Desactivar Cuenta
                </Button>
              </Popconfirm>
            ) : (
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                onClick={handleReactivateAccount}
                block
                style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
              >
                Reactivar Cuenta
              </Button>
            )}
          </div>

          <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
            <Button onClick={handleEditCancel} style={{ marginRight: "8px" }}>
              Cancelar
            </Button>
            <Button type="primary" htmlType="submit" loading={savingChanges}>
              Guardar Cambios
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Profile;