import config from "../config/enviroment";
const API_BASE = config.API_URL;
const API_ACTIVITIES = `${API_BASE}/actividades`;

const fetchConfig = {
    headers: { "Content-Type": "application/json"},
};

const getUserId = () => {
    const user = localStorage.getItem("user");
    if (user) {
        const userData = JSON.parse(user);
        return userData.idUser;
    }
    return null;
};

// GET - Obtenemos todas las actividades
export const getAllActivities = async() => {
    try {
        const token = localStorage.getItem('token');
        const response = await  fetch(`${API_ACTIVITIES}/all`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener todas las actividades');
        }

        return await response.json();
    } catch (error) {
        console.error("Error: ", error);
        throw error;
    }
};

// GET - Obtenemos todas las actividades de un usuario
export const getActivities = async () => {
    const userId = getUserId();
    if(!userId) {
        throw new Error("Usuario no autenticado");
    }

    const response = await fetch(`${API_ACTIVITIES}/usuario/${userId}`, {
        method: "GET",
        headers: fetchConfig.headers,
    });

    if (!response.ok) {
        throw new Error("Error al obtener las actividades");
    }

    return await response.json();
};

// GET - Obtenemos una actividad por su ID

export const getActivityById = async (activityId) => {
    const response = await fetch(`${API_ACTIVITIES}/${activityId}`, {
        method: "GET",
        headers: fetchConfig.headers,
    });

    if (!response.ok) {
        throw new Error("Error al obtener la actividad");
    }

    return await response.json();
};

// POST - Creamos una nueva actividad

export const createActivity = async (activityData) => {
    const userId = getUserId();
    if (!userId) {
        throw new Error("Usuario no autenticado");
    }

    const dataToSend = {
        fecha: activityData.fecha,
        duracion: activityData.duracion,
        distancia: activityData.distancia ? parseFloat(activityData.distancia) : null,
        velocidadMedia: parseFloat(activityData.velocidadMedia),
        velocidadMax: parseFloat(activityData.velocidadMax),
        calorias: activityData.calorias ? parseFloat(activityData.calorias) : null,
        idUsuario: userId,
        idBici: activityData.idBici ? parseInt(activityData.idBici) : null,
        idRuta: activityData.idRuta ? parseInt(activityData.idRuta) : null,
    };

    console.log("Datos enviados al backend: ", dataToSend);

    const response = await fetch(`${API_ACTIVITIES}/create`, {
        method: "POST",
        headers: fetchConfig.headers,
        body: JSON.stringify(dataToSend),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Error al crear la actividad");
    }

    return await response.json();
}

// PATCH - Actualizamos una actividad

export const updateActivity = async (activityId, updates) => {
    const response = await fetch(`${API_ACTIVITIES}/${activityId}`, {
        method: "PATCH",
        headers: fetchConfig.headers,
        body: JSON.stringify(updates),
    });

    if (!response.ok) {
        throw new Error("Error al actualizar la actividad");
    }

    return await response.json();
};

// DELETE - Eliminamos una actividad

export const deleteActivity = async (activityId) => {
    const response = await fetch(`${API_ACTIVITIES}/${activityId}`, {
        method: "DELETE",
        headers: fetchConfig.headers,
    });

    if (!response.ok) {
        throw new Error("Error al eliminar la actividad");
    }

    return await response.json();
};

// GET - Obtenemos las actividades del usuario
export const getUserStatistics = async () => {
    const userId = getUserId();
    if (!userId) {
        throw new Error("Usuario no autenticado");
    }

    const response = await fetch(`${API_ACTIVITIES}/estadisticas/${userId}`, {
        method: "GET",
        headers: fetchConfig.headers,
    });

    if(!response.ok) {
        throw new Error("Error al obtener las estadisticas");
    }

    return await response.json();
};