import config from '../config/enviroment';

const API_BASE_URL = config.API_URL;

export const getVotacionesByActividad = async (idActividad) => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/votacion/allByIdActividad/${idActividad}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })

        if (!response.ok){
            throw new Error("Error al obtener las votaciones");
        }

        return await response.json();
    }catch (error){
        console.error("Error al obtener las votaciones: ", error);
    }
};

// Agregamos o Actualizamos una votacion
export const agregarVoto = async (votacionData) => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${config.API_URL}/votacion/agregarVoto`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(votacionData)
        });
    if (!response.ok){
        throw new Error("Error al agregar el voto");
    }

    return await response.json();
    } catch (error) {
        console.error("Error al agregar el voto: ", error);
        throw error;
    }
};
    