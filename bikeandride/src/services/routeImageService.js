import config from "../config/enviroment";

const API_BASE_URL = config.API_URL;

/**
 * SUBIMOS LA FOTO DE PORTADA DE LA RUTA
 */
export const uploadRouteCoverImage = async (routeId, imageFile) => {
    console.log("Subiendo foto de portada", routeId);
    console.log("📤 Archivo:", imageFile.name, imageFile.size, imageFile.type);

    const token = localStorage.getItem("authToken");
    const tokenType = localStorage.getItem("tokenType") || "Bearer";

    if (!token) {
        throw new Error("No hay token de autenticación");
    }

    const formData = new FormData();
    formData.append("files", imageFile);

    console.log("📤 FormData preparado, enviando...");

    const response = await fetch(`${API_BASE_URL}/imagenes/ruta/${routeId}`, {
        method: 'POST',
        headers: {
            'Authorization': `${tokenType} ${token}`,
        },
        body: formData,
    });

    console.log("📤 Respuesta del servidor:", response.status);

    if(!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("❌ Error del servidor:", errorData);
        throw new Error(errorData.error || "Error al subir la imagen");
    }

    const result = await response.json();
    console.log("✅ Respuesta exitosa:", result);
    return result;

};

/**
 * OBTENEMOS LA FOTO DE PORTADA
 */
export const getRouteCoverImage = async (routeId) => {
    console.log("Cargando foto de portada: ", routeId);

    const token = localStorage.getItem('authToken');
    const tokenType = localStorage.getItem('tokenType') || 'Bearer';
  
    if (!token) {
        throw new Error('No hay token de autenticación');
    }

    const response = await fetch(`${API_BASE_URL}/imagenes/ruta/${routeId}`, {
        method: 'GET',
        headers: {
            'Authorization': `${tokenType} ${token}`, 
        },
    });

    if (!response.ok) {
        console.log("No hay imagen de portada");
        return null;
    }

    const imagesData = await response.json();  // ← Es un array

    if (!imagesData || !Array.isArray(imagesData) || imagesData.length === 0) {
        console.log("⚠️ No hay imágenes en la ruta");
        return null;
    }

    // Obtener la primera imagen
    const firstImage = imagesData.sort((a, b) => (a.orden || 0) - (b.orden || 0))[0];

    console.log("✅ Imagen de portada encontrada:", firstImage.nombreArchivo);

    return {
        id: firstImage.idImagen,
        url: `data:${firstImage.tipoMime};base64,${firstImage.contenidoBase64}`,
        tipoMime: firstImage.tipoMime,
        nombreArchivo: firstImage.nombreArchivo
    };
};

/**
 * ELIMINAMOS LA FOTO DE PORTADA
 */
export const deleteRouteCoverImage = async (imageId) => {
    const token = localStorage.getItem('authToken');
    const tokenType = localStorage.getItem('tokenType') || 'Bearer';

    if (!token) {
        throw new Error("No hay token de autenticación");
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
}

/**
 * VALIDAMOS EL TAMAÑO DE LA IMAGEN (MAX 5MB)
 */
export const validateImageSize = (file) => {
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
        throw new Error("La imagen no puede superar los 5MB");
    }
    return true;
}

/**
 * VALIDAMOS EL TIPO DE FICHERO
 */
export const validateImageType = (file) => {
    const validType = ["image/jpeg", "image/png", "image/jpg", "image/gif", "image/webp"];
    if (!validType.includes(file.type)) {
        throw new Error("Solo se permiten imagenes JPG, PNG, GIF o WEBP");
    }
    return true;
};