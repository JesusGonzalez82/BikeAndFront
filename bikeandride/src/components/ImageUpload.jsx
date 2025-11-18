import React, { useState } from "react";
import { Upload, message, Avatar } from "antd";
import { CameraOutlined, UserOutlined } from "@ant-design/icons";
import {
  uploadProfileImage,
  uploadBannerImage,
  validateImageSize,
  validateImageType,
} from "../services/imageService";

function ImageUpload({ userId, type = "profile", currentImage, onUploadSuccess }) {
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(currentImage);

  // Actualizar preview cuando cambie currentImage
  React.useEffect(() => {
    setPreviewImage(currentImage);
  }, [currentImage]);

  const handleUpload = async (file) => {
    try {
      // Validaciones
      validateImageSize(file);
      validateImageType(file);

      setLoading(true);

      // Crear preview local inmediatamente
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(file);

      // Subir según el tipo
      let response;
      if (type === "profile") {
        response = await uploadProfileImage(userId, file);
      } else if (type === "banner") {
        response = await uploadBannerImage(userId, file);
      }

      // Callback para actualizar el padre
      if (onUploadSuccess) {
        onUploadSuccess(response);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      message.error(error.message || "Error al subir la imagen");
      // Restaurar imagen anterior en caso de error
      setPreviewImage(currentImage);
    } finally {
      setLoading(false);
    }

    return false; // Prevenir upload automático de antd
  };

  const uploadProps = {
    beforeUpload: handleUpload,
    showUploadList: false,
    accept: "image/jpeg,image/png,image/jpg,image/gif,image/webp",
  };

  if (type === "profile") {
    return (
      <Upload {...uploadProps}>
        <div style={{ 
          position: "relative", 
          cursor: "pointer",
          display: "inline-block"
        }}>
          <Avatar
            size={140}
            src={previewImage}
            icon={!previewImage && <UserOutlined />}
            style={{ 
              border: "5px solid white", 
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              backgroundColor: previewImage ? "transparent" : "#1890ff"
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "5px",
              right: "5px",
              backgroundColor: "#1890ff",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "3px solid white",
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#40a9ff";
              e.currentTarget.style.transform = "scale(1.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#1890ff";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <CameraOutlined style={{ color: "white", fontSize: "18px" }} />
          </div>
          {loading && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0,0,0,0.5)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "12px",
              }}
            >
              Subiendo...
            </div>
          )}
        </div>
      </Upload>
    );
  }

  // Banner upload
  return (
    <Upload {...uploadProps}>
      <div
        style={{
          width: "100%",
          height: "280px",
          backgroundImage: previewImage 
            ? `url(${previewImage})` 
            : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          position: "relative",
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.filter = "brightness(0.9)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.filter = "brightness(1)";
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(0,0,0,0.6)",
            padding: "16px 32px",
            borderRadius: "8px",
            color: "white",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            fontSize: "16px",
            fontWeight: "500",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          }}
        >
          <CameraOutlined style={{ fontSize: "20px" }} />
          <span>{loading ? "Subiendo..." : previewImage ? "Cambiar banner" : "Subir banner"}</span>
        </div>
      </div>
    </Upload>
  );
}

export default ImageUpload;