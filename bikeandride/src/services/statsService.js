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
        const [bikesResponse, routesResponse, activitiesResponse] = await Promise.all([
            fetch(`${API_BASE}/bikes/getListBikeByUserId/${userId}`),
            fetch(`${API_BASE}/rutas/all`),
            fetch(`${API_BASE}/actividades/usuario/${userId}`)
        ]);

        const bikes = await bikesResponse.json();
        const routes = await routesResponse.json();
        const activities = await activitiesResponse.json();

        const totalKm = activities.reduce((sum, activity) =>{
            return sum + (parseFloat(activity.distancia) || 0);
        }, 0);

        return {
            totalBikes: bikes.length,
            totalRoutes: routes.length, 
            totalActivities: activities.length, 
            totalKm: parseFloat(totalKm.toFixed(1)),
            bikes,
            routes,
            activities
        };
    } catch (error) {
        console.error("Error al obtener las estadisticas del usuario: ", error);
        throw error;
    }
}