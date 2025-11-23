import React, { useState, useEffect } from "react";
import { Upload, Button, message, Spin, Image, Popconfirm, Empty } from "antd";
import { PlusOutlined, DeleteOutlined, CameraOutlined } from "@ant-design/icons";
import {
    getRouteCoverImage,
    uploadRouteCoverImage,
    deleteRouteCoverImage,
    validateImageSize,
    validateImageType,
} from "../services/routeImageService";

function RouteCoverImage({ routeId }) {
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if(routeId) {
            loadImage();
        }
    }, [routeId]);

    const loadImage = async () => {
        try {
            setLoading(true);
            const imageData = await getRouteCoverImage(routeId);
            console.log("Imagen de portada cargada: ", imageData);
            setImage(imageData);
        }catch (error) {
            console.error("Error loading cover image: ", error);
        }finally {
            setLoading(false);
        }
    };

    const handleUpload = async (file) => {
        try {
            validateImageSize(file);
            validateImageType(file);

            setUploading(true);
            await uploadRouteCoverImage(routeId, file);
            message.success("Foto de portada actualizada");
            loadImage();
        }catch (error){
            console.error("Error uploading image: ", error);
            message.error(error.message || "Error al subir la imagen");
        }finally {
            setUploading(false);
        }
        return false;
    };

    const handleDelete = async () => {
        try {
            await deleteRouteCoverImage(image.id);
            message.success("Foto eliminada");
            setImage(null);
        }catch (error){
            console.error("Error deleting image: ", error);
            message.success("Error al eliminar la image");
        }
    };

    if (loading) {
        return (
            <div style={{ textAlign: "center", padding:"40px", backgroundColor: "#f5f5f5" }}>
                <Spin size="large" />
            </div>
        );
    }

    if (!image) {
        return (
            <div style={{ padding: "24px", backgroundColor: "#f5f5f5", textAlign: "center" }}>
                <Empty
                    description="No hay foto de portada"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
                <Upload
                    beforeUpload={handleUpload}
                    showUploadList={false}
                    accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
                >
                    <Button
                        type="primary"
                        icon={<CameraOutlined />}
                        loading={uploading}
                        style={{ marginTop: "16px" }}
                    >
                        Subir foto de portada
                    </Button>
                </Upload>
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: "#f5f5f5" }}>
            {/* Imagen de Portada */}
            <div style={{
                padding: "16px",
                backgroundColor: "#000",
                minHeight: "300px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}>
                <Image
                    src={image.url}
                    alt={image.nombreArchivo}
                    style={{
                        maxWidth: "100%",
                        maxHeight: "400px",
                        objectFit: "contain",
                        cursor: "pointer"
                    }}
                    preview={{
                        src: image.url,
                        mask: <div style={{ fontSize: '16px' }}>Click para ampliar</div>
                    }}
                />
            </div>
            {/* Botones */}
            <div style={{ padding: "16px", display: "flex", gap: "8px", justifyContent: "center" }}>
                <Upload
                    beforeUpload={handleUpload}
                    showUploadList={false}
                    accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
                >
                    <Button icon={<CameraOutlined />} loading={uploading}>
                        Cambiar Foto
                    </Button>
                </Upload>

                <Popconfirm
                    title="¿Eliminar foto de portada?"
                    description="Esta acción no se puede deshacer"
                    onConfirm={handleDelete}
                    okText="Eliminar"
                    cancelText="Cancelar"
                    okButtonProps={{ danger: true }}
                >
                    <Button danger icon={<DeleteOutlined />}>
                        Eliminar
                    </Button>
                </Popconfirm>
            </div>
        </div>
    );
}

export default RouteCoverImage;