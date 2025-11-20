import config from "../config/enviroment";

const API_BASE_URL = config.API_URL;

/**
 * Subimos imagenes de las actividades
 */
export const uploadActivityImage = async (activityId, imageFile) => {
  const token = localStorage.getItem("authToken");
  const tokenType = localStorage.getItem("tokenType") || "Bearer";

  if (!token) {
    throw new Error("No hay token de autenticación");
  }

  const fomrData = new FormData();
  fomrData.append("file", imageFile);

  const response = await fetch(
    `${API_BASE_URL}/imagenes/actividad/${activityId}`,
    {
      method: "POST",
      headers: {
        Authorization: `${tokenType} ${token}`,
      },
      body: FormData,
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Error al subir la imagen");
  }

  return await response.json();
};

/**
 * Obtenemos la imagen de una actividad
 */

export const getActivityImage = async (activityId) => {
  const token = localStorage.getItem("authToken");
  const tokenType = localStorage.getItem("tokenType") || "Bearer";

  if (!token) {
    throw new Error("No hay token de autenticación");
  }

  const response = await fetch(`${API_BASE_URL}/imagenes/actividad/${activityId}`,{
      method: "GET",
      headers: {
        Authorization: `${tokenType} ${token}`,
      },
    }
  );

  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }

    throw new Error("Error al obtener la imange");
  }

  const imageData = await response.json();

  if (!imageData || !imageData.contenidoBase64) {
    return null;
  }

  return `data:${imageData.tipoMime};base64,${imageData.contenidoBase64}`;
};

/**
 * Eliminamos una imagen de una actividad
 */
export const deleteActivityImage = async (actividadId) => {
  const token = localStorage.getItem("authToken");
  const tokenType = localStorage.getItem("tokenType") || "Bearer";

  if (!token) {
    throw new Error("No hay token de autenticación");
  }

  const response = await fetch(
    `${API_BASE_URL}/imagenes/actividad/${actividadId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `${tokenType} ${token}`,
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Errora al eliminar la imagen");
  }

  return true;
};

/**
 * Validamos el tamaño máximo de la imagen (5mb)
 */
export const validateImageSize = (file) => {
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
        throw new Error ("La imagen no puede superar los 5MB");
    }
    return true;
}

/**
 * Validamos el tipo de archivo
 */
export const validateImageType = (file) => {
    const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
        throw new Error("Solo se permiten imagenes JPG, PNG, GIF o WEBP");
    }
    return true;
};
