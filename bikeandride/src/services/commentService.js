import config from "../config/enviroment";
import { getCurrentDateForBackend } from "../utils/dateUtils";

const API_BASE_URL = config.API_URL;

/**
 * Obtemos todos los comentarios que tenga una actividad
 */
export const getComments = async (activityId) => {
    const token = localStorage.getItem('authToken');
    const tokenType = localStorage.getItem('tokenType') || 'Bearer';

    if (!token){
        throw new Error("No hay token de autenticación");
    }

    const response = await fetch(`${API_BASE_URL}/comentarios/actividad/${activityId}`, {
       method: 'GET',
       headers: {
        'Authorization': `${tokenType} ${token}`,
       } ,
    });

    if (!response.ok){
        if (response.status === 404) {
            return [];
        }
        throw new Error ('Error al obtener los comentarios');
    }

    return await response.json();
};

/**
 * Añadimos un comentario a una actividadç
 */
export const addComment = async (activityId, texto) => {
    const token = localStorage.getItem('authToken');
    const tokenType = localStorage.getItem('tokenType') || 'Bearer';
    const user = JSON.parse(localStorage.getItem('user'));

    if (!token) {
        throw new Error("No hay token de autenticación");
    }

    if (!user || !user.idUser) {
        throw new Error("Usuario no autenticado");
    }

    const commentData = {
        comentario: texto,
        idActividad: activityId,
        idUsuario: user.idUser,
        fecha: getCurrentDateForBackend()
    };

    const response = await fetch(`${API_BASE_URL}/comentarios/create`, {
        method: 'POST',
        headers: {
            'Authorization': `${tokenType} ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(commentData),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Error al añadir el comentario");
    }

    return await response.json();
};

/**
 * Editamos un comentario
 */
export const updateComment = async (commentId, texto) => {
    const token = localStorage.getItem('authToken');
    const tokenType = localStorage.getItem('tokenType') || 'Bearer';

    if (!token) {
        throw new Error("No hay token de identificación");
    }

    const updateData = {
        comentario: texto
    };

    const response = await fetch(`${API_BASE_URL}/comentarios/${commentId}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `${tokenType} ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
    });

    if (!response.ok){
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Error al editar el comentario");
    }

    return await response.json();
};

/**
 * Eliminamos un comentario
 */
export const deleteComment = async (commentId) => {
    const token = localStorage.getItem('authToken');
    const tokenType = localStorage.getItem('tokenType') || 'Bearer';

    if (!token) {
        throw new Error ("No hay token de autenticación");
    }

    const response = await fetch(`${API_BASE_URL}/comentarios/${commentId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `${tokenType} ${token}`,
        },
    });

    if(!response.ok){
        const errorData = await response.json.catch(() => ({}));
        throw new Error(errorData.error || "Error al eliminar el comentario");
    }

    return true;
};

/**
 * Obtenemos los comentarios recientes (últimos N comentarios)
 */
export const getRecentComments = async (limit = 10) => {
    const token = localStorage.getItem('authToken');
    const tokenType = localStorage.getItem('tokenType' || 'Bearer');

    if (!token) {
        throw new Error("No hay token de autenticación");
    }

    const response = await fetch(`${API_BASE_URL}/comentarios/recientes?limite=${limit}`, {
        method: 'GET',
        headers: {
            'Authorization': `${tokenType} ${token}`,
        },
    });

    if (!response.ok){
        throw new Error("Error al obtener los comentarios más recientes");
    }

    return await response.json();
};

