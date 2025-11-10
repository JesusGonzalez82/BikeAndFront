import config from '../config/enviroment.js';
const API_BASE = config.API_URL;

const getUserId = () => {
    const user = localStorage.getItem("user");
    if (user) {
        const userData = JSON.parse(user);
        return userData.idUser;
    }
    return null;
};

export const getUserStats = async () => {
    const userId = getUserId();
    if (!userId) {
        throw new Error("Usuario no autenticado");
    }

    try{
        const [bikesResponse, routesResponse] = await Promise.all([
            fetch(`${API_BASE}/bikes/getListBikeByUserId/${userId}`),
            fetch(`${API_BASE}/rutas/all`)
        ]);

        const bikes = await bikesResponse.json();
        const routes = await routesResponse.json();

        return {
            totalBikes: bikes.length,
            totalRoutes: routes.length, // Dejamos a 0 hasta que tengamos la pagina operativa
            totalActivities: 0, // Dejamos a 0 hasta que tengamos la pagina operativa
            totalKm: 0, // Dejamos a 0 hasta que tengamos la pagina operativa
            bikes,
            routes
        };
    } catch (error) {
        console.error("Error al obtener las estadisticas del usuario: ", error);
        throw error;
    }
}