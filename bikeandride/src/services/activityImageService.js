import config from "../config/enviroment";

const API_BASE_URL = config.API_URL;

/**
 * Subimos imagenes de las actividades
 */
export const uploadActivityImage = async (activityId, imageFile) => {
  console.log("Subiendo Imagen: ", { activityId, fileName: imageFile.name, size: imageFile.size });  
  const token = localStorage.getItem("authToken");
  const tokenType = localStorage.getItem("tokenType") || "Bearer";

  if (!token) {
    throw new Error("No hay token de autenticación");
  }

  const formData = new FormData();
  formData.append("files", imageFile);

    const response = await fetch(`${API_BASE_URL}/imagenes/actividad/${activityId}`, {
    method: 'POST',
    headers: {
      'Authorization': `${tokenType} ${token}`,
    },
    body: formData,
  });

  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.log("Error del servidor: ", errorData)
    throw new Error(errorData.error || "Error al subir la imagen");
  }

  const result = await response.json();
  return result;
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
    });

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

export const getActivityImages = async (activityId) => {
    console.log("Cargando todas las imagenes de la activdad: ", activityId);

    const token = localStorage.getItem("authToken");
    const tokenType = localStorage.getItem("tokenType") || 'Bearer';

    if (!token) {
        throw new Error("No hay token de autenticación");
    }

    const response = await fetch(`${API_BASE_URL}/imagenes/actividad/${activityId}`, {
        method: 'GET',
        headers: {
            'Authorization': `${tokenType} ${token}`,
        },
    });

    console.log("Respuesta GET de todas las imagenes", response.status);

    if (!response.ok) {
        console.log("No hay imagenes: ", response.status);
        return [];
    }

    const imagesData = await response.json();
    console.log("Imagenes recibidas: ", imagesData);

    if (!imagesData || !Array.isArray(imagesData)) {
        return [];
    }

    // Convertimos las imagenes a DATA URLs

    return imagesData.map(img => ({
        id: img.idImagen,
        orden: img.orden || 0,
        url: `data:${img.tipoMime};base64,${img.contenidoBase64}`,
        tipoMime: img.tipoMime,
        nombreArchivo: img.nombreArchivo
    })).sort((a, b) => a.orden - b.orden);
};

/**
 * Eliminar una imagen especifica de una actividad por su ID
 */
export const deleteActivityImageById = async (imageId) => {
    const token = localStorage.getItem('authToken');
    const tokenType = localStorage.getItem('tokenType') || 'Bearer';

    if (!token) {
        throw new Error('No hay token de autenticación');
    }

    const response = await fetch(`${API_BASE_URL}/imagenes/${imageId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `${tokenType} ${token}`,
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error (errorData.error || "Error al eliminar la imagen");
    }

    return true;

};
