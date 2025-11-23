import config from "../config/enviroment";

const API_BASE_URL = config.API_URL;

/**
 * Subimos imagenes de la bicicleta
 */
export const uploadBikeImages = async (bikeId, imageFiles) => {
    console.log("Subiendo imagenes de bici:", {bikeId, cantidad: imageFiles.length});

    const token = localStorage.getItem("authToken");
    const tokenType = localStorage.getItem("tokenType") || "Bearer";

    if (!token) {
        throw new Error("No hay token de autenticación");
    }

    const formData = new FormData();
    imageFiles.forEach(file =>{
        formData.append("files", file);
    });

    const response = await fetch(`${API_BASE_URL}/imagenes/bicicleta/${bikeId}`, {
        method: 'POST',
        headers: {
            'Authorization': `${tokenType} ${token}`,
        },
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Error al subir imágenes");
    }

    return await response.json();
};

/**
 * Obtenermos todas las imagenes de una bicicleta
 */

export const getBikeImages = async (bikeId) => {
    console.log("Cargando imagenes de la bici: ", bikeId);

    const token = localStorage.getItem('authToken');
    const tokenType = localStorage.getItem("tokenType") || "Bearer";

    if (!token) {
        throw new Error("No hay token de autenticación");
    }

    const response = await fetch(`${API_BASE_URL}/imagenes/bicicleta/${bikeId}`, {
        method:'GET',
        headers: {
            'Authorization': `${tokenType} ${token}`,
        },
    });

    if (!response.ok){
        return [];
    }

    const imagesData = await response.json();
    
    if (!imagesData || !Array.isArray(imagesData)) {
        return [];
    }

    return imagesData.map(img => ({
        id: img.idImagen,
        orden: img.orden || 0,
        url: `data:${img.tipoMime};base64,${img.contenidoBase64}`,
        tipoMime: img.tipoMime,
        nombreArchivo: img.nombreArchivo
    })).sort((a, b) => a.orden - b.orden);  
};

/**
 * Eliminamos una foto por su ID
 */
export const deleteBikeImageById = async (imageId) => {
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
        throw new Error(errorData.error || "Error al eliminar la imagen");
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