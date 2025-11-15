import config from "../config/enviroment";

const API_BASE = config.API_URL;
const API_IMAGES = `${API_BASE}/imagenes`;

// ==================== VALIDACIONES ====================

// Validar tamaño de archivo (máximo 5MB)
export const validateImageSize = (file) => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    throw new Error("La imagen no puede superar los 5MB");
  }
  return true;
};

// Validar tipo de archivo
export const validateImageType = (file) => {
  const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif", "image/webp"];
  if (!validTypes.includes(file.type)) {
    throw new Error("Solo se permiten imágenes JPG, PNG, GIF o WEBP");
  }
  return true;
};

// ==================== USUARIOS ====================

// POST - Subir imagen de perfil
export const uploadProfileImage = async (userId, file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_IMAGES}/usuario/${userId}/perfil`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Error al subir la imagen de perfil");
  }

  return await response.json();
};

// POST - Subir imagen de banner
export const uploadBannerImage = async (userId, file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_IMAGES}/usuario/${userId}/banner`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Error al subir el banner");
  }

  return await response.json();
};

// GET - Obtener imagen de perfil
export const getProfileImage = async (userId) => {
  const response = await fetch(`${API_IMAGES}/usuario/${userId}/perfil`, {
    method: "GET",
  });

  if (!response.ok) {
    if (response.status === 404) {
      return null; // No tiene imagen de perfil
    }
    throw new Error("Error al obtener la imagen de perfil");
  }

  return await response.json();
};

// GET - Obtener imagen de banner
export const getBannerImage = async (userId) => {
  const response = await fetch(`${API_IMAGES}/usuario/${userId}/banner`, {
    method: "GET",
  });

  if (!response.ok) {
    if (response.status === 404) {
      return null; // No tiene banner
    }
    throw new Error("Error al obtener el banner");
  }

  return await response.json();
};

// ==================== UTILIDADES ====================

// Convertir Base64 a URL de imagen
export const base64ToImageUrl = (base64Data, mimeType) => {
  if (!base64Data) return null;
  return `data:${mimeType};base64,${base64Data}`;
};