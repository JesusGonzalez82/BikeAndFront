import React, { createContext, useContext, useState, useEffect } from 'react';
import { getRoutes, createRoute, updateRoute as updateRouteService, deleteRoute as  deleteRouteService} from '../services/routeService';
import { message } from "antd";

const RouteContext = createContext();

export function useRoutes() {
    const context = useContext(RouteContext);
    if (!context) {
        throw new Error("useRoutes debe ser usado dentro de RouteProvider");
    } 
    return context;
}

export function RouteProvider({ children}) {
    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedRoute, setSelectedRoute] = useState(null);

    useEffect(() => {
        loadRoutes();
    }, []);

    // Cargamos todas las rutas
    const loadRoutes = async () => {
        try {
            setLoading(true);
            const data = await getRoutes();
            setRoutes(data);
        }catch (error) {
            console.error("Error al cargar las rutas: ", error);
            message.error("Error al cargar las rutas");
        }finally {
            setLoading(false);
        }
    };

    // Creamos una nueva ruta
    const addRoute = async (routeData) => {
        try{
            const newRoute = await createRoute(routeData);
            setRoutes([...routes, newRoute]);
            message.success("Ruta creada con éxito");
            return newRoute;
        }catch (error) {
            message.error(error.message || "Error al crear la rurta");
            throw error;
        }
    };

    // Actualizamos una ruta existente
    const updateRoute = async (id, updates) => {
        try{
            const updateRoute = await updateRouteService(id, updates);
            setRoutes(routes.map(route => route.id === id ? updateRoute : route));
            message.success("Ruta actualizada con éxito");
            return updateRoute;
        }catch (error) {
            message.error(error.message || "Error al actualizar la ruta");
            throw error;
        }
    };

    // Eliminamos una ruta
    const deleteRoute = async (id) => {
        try {
            await deleteRouteService(id);
            setRoutes(routes.filter(route => route.id !== id));
            message.success("Ruta eliminada con éxito");
        }catch (error) {
            message.error(error.message || "Error al eliminar la ruta");
            throw error;
        }
    };

    const value = {
        routes,
        loading,
        selectedRoute,
        setSelectedRoute,
        fetchRoutes: loadRoutes,
        addRoute,
        updateRoute,
        deleteRoute,
    };

    return (
        <RouteContext.Provider value={value}>
            {children}
        </RouteContext.Provider>
    );

}