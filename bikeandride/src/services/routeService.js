import config from '../config/enviroment';
const API_BASE = config.API_URL;
const API_ROUTES = `${API_BASE}/rutas`;

const fetchConfig = {
    headers:  { "Content-Type": "application/json"},
};

// GET - Obtenemos todas las rutas
export const getRoutes = async () => {
    const response = await fetch(`${API_ROUTES}/all`, {
        method: "GET",
        headers: fetchConfig.headers,
    });
    if (!response.ok) {
        throw new Error('Error al obtener las rutas');
    }
    return await response.json();
};

// GET - Obtenemos una ruta por su ID
export const getRouteById = async (routeId) => {
    const response = await fetch(`${API_ROUTES}/${routeId}`, {
        method: "GET",
        headers: fetchConfig.headers,
    });
    if (!response.ok){ 
        throw new Error('Ruta no encontrada');
    }
    return await response.json();
};

// POST - Creamos una nueva ruta
export const createRoute = async (routeData) => {
    const dataToSend = {
        nombreRuta: routeData.nombreRuta,
        distancia: parseFloat(routeData.distancia),
        desnivel: parseInt(routeData.desnivel),
        tipoTerreno: routeData.tipoTerreno,
        descripcionRuta: routeData.descripcionRuta || "",
    };
    // Comprobacion para debugging
    console.log("Datos enviados al backend: ", dataToSend);

    const response = await fetch(`${API_ROUTES}/create`, {
        method: "POST",
        headers: fetchConfig.headers,
        body: JSON.stringify(dataToSend),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Error al crear la ruta");
    }

    return await response.json();
};

// PATCH - Modificamos o actualizamos una ruta
export const updateRoute = async (routeId, updates) => {
    const response = await fetch(`${API_ROUTES}/${routeId}`, {
        method: "PATCH",
        headers: fetchConfig.headers,
        body: JSON.stringify(updates),
    });

    if(!response.ok) {
        throw new Error("Error al actualizar la ruta");
    }

    return await response.json();
};

// DELETE - ELiminamos una ruta
export const deleteRoute = async (routeId) => {
    const response = await fetch(`${API_ROUTES}/${routeId}`, {
        method: "DELETE",
        headers: fetchConfig.headers,
    });

    if(!response.ok) {
        throw new Error("Error al eliminar la ruta");
    }

    return await response.json();
}
