import React, { useState, useEffect } from "react";
import { Upload, Button, message, Spin, Empty, Image, Popconfirm } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import {
    getBikeImages,
    uploadBikeImages,
    deleteBikeImageById,
    validateImageSize,
    validateImageType,
} from "../services/bikeImageService";

function BikeImageCarousel({ bikeId }) {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (bikeId) {
            loadImages();
        }
    }, [bikeId]);

    const loadImages = async () => {
        try {
            setLoading(true);
            const imagesData = await getBikeImages(bikeId);
            console.log("Imagenes de bici cargadas: ", imagesData);
            setImages(imagesData);
        }catch (error) {
            console.error("Error loading bike images:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (file) => {
        if (images.length >= 10){
            message.warning("Por ahora el máximo de imagenes serán 10 por bicicleta");
            return false;
        }

        try{
            validateImageSize(file);
            validateImageType(file);

            setUploading(true);
            await uploadBikeImages(bikeId, [file]);
            message.success("Imagen subida correctamente");
            loadImages();
        }catch (error) {
            console.error("Error uploading images: ", error);
            message.error(error.message || "Error al subir la imagen");
        } finally {
            setUploading(false);
        }

        return false;
    };

    const handleDelete = async (imageId) => {
        try {
            await deleteBikeImageById(imageId);
            message.success("Imagen eliminada");
            loadImages();
            if(currentIndex >= images.length -1) {
                setCurrentIndex(Math.max(0, images.length - 2));
            }
        } catch (error) {
            console.error("Error deleting image: ", error);
            message.error("Error al eliminar la imagen");
        }
    };

    if (loading) {
        return (
            <div style={{ textAlign: "center", padding: "40px", color: "#f5f5f5"}}>
                <Spin size="large" />
            </div>
        );
    }

    if (images.length === 0){
        return(
            <div style={{ padding: "24px", backgroundColor: "#f5f5f5"}}>
                <Empty
                    description="No hay fotos de esta bicicleta"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
                <Upload
                    beforeUpload={handleUpload}
                    showUploadList={false}
                    accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
                >
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        loading={uploading}
                        block
                        style={{ marginTop: "16px" }}
                    >
                        Subir Primera foto
                    </Button>
                </Upload>
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: "#f5f5f5"}}>
            {/* Bicicleta Principal */}
            <div style={{
                padding: "16px",
                backgroundColor: "#000",
                minHeight: "300px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}>
                <Image
                    src={images[currentIndex]?.url}
                    alt={images[currentIndex]?.nombreArchivo}
                    style={{
                        maxWidth: "100%",
                        maxHeight: "300px",
                        objectFit: "contain",
                        cursor: "pointer"
                    }}
                    preview={{
                        src: images[currentIndex]?.url,
                        mask: <div style={{ fontSize: "16px"}}>Click para ampliar</div>
                    }}
                />
            </div>

            {/* Controles*/}
            <div style={{
                padding: "8px 16px",
                backgroundColor: "#1a1a1a",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
            }}>
                <Button
                    onClick={() => setCurrentIndex(Math.min(images.length - 1, currentIndex + 1))}
                    disabled={currentIndex === images.length - 1}
                    style={{ color: "white", backgroundColor: "transparent", border: "1px solid white"}}
                >
                    Siguiente →
                </Button>
            </div>

            {/* Thumbnails */}
            <div style={{
                padding: "16px",
                display: "flex",
                gap: "8px",
                overflow: "auto",
                backgroundColor: "#f5f5f5"
            }}>
                {images.map((img, index) => (
                    <div
                        key={img.id}
                        onClick={() => setCurrentIndex(index)}
                        style={{
                            cursor: "pointer",
                            border: currentIndex === index ? "3px solid #fa8c16" : "3px solid transparent",
                            borderRadius: "4px",
                            overflow: "hidden",
                            width: "80px",
                            height: "80px",
                            flexShrink: 0
                        }}
                    >
                        <img
                            src={img.url}
                            alt={`Thumbnail ${index + 1}`}
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover"
                            }}
                        />
                    </div>
                ))}

                {/* Boton para añadir más fotos */}
                {images.length < 10 && (
                    <Upload
                        beforeUpload={handleUpload}
                        showUploadList={false}
                        accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
                    >
                        <div
                            style={{
                                width: "80px",
                                height: "80px",
                                border: "2px dashed #999",
                                borderRadius: "4px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                backgroundColor: "#fff",
                                flexShrink: 0
                            }}
                        >
                            {uploading ? (
                                <Spin size="small" />
                            ) : (
                                <PlusOutlined style={{ fontSize: "24px", color: "#999"}} />
                            )}
                        </div>
                    </Upload>
                )}
            </div>

            {/* Boton eliminar */}
            <div style={{ padding: "16px", textAlign: "center" }}>
                <Popconfirm
                    title="¿Eliminar esta imagen?"
                    description="Esta acción no se puede deshacer"
                    onConfirm={() => handleDelete(images[currentIndex].id)}
                    okText="Eliminar"
                    cancelText= "Cancelar"
                    okButtonProps={{ danger: true }}
                >
                    <Button danger icon={<DeleteOutlined />}>
                        Eliminar imagen
                    </Button>
                </Popconfirm>
            </div>
        </div>
    );
}

export default BikeImageCarousel;