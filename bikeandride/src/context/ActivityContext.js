import React, { createContext, useContext, useState, useEffect } from "react";
import { 
    getActivities, 
    createActivity, 
    updateActivity as updateActivityService, 
    deleteActivity as deleteActivityService,
    deleteActivity, 
} from "../services/activityServices";
import { message } from "antd";

const ActivityContext = createContext();

export function useActivities(){
    const context = useContext(ActivityContext);
    if (!context) {
        throw new Error("useActivities debe ser usado dentro de ActivityProvider");
    }
    return context;
}

export function ActivityProvider({children}){
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState(null);

    useEffect(() => {
        loadActivities();
    }, []);

    // Cargamos todas las actividades

    const loadActivities = async () => {
        try{
            setLoading(true);
            
            const [data] = await Promise.all([
                getActivities(),
                new Promise(resolve => setTimeout(resolve, 500))
            ]);

            setActivities(data);

        } catch (error) {
            console.error("Error al cargar las actividades: ", error );
            message.error("Error al cargar las actividades");
        }finally {
            setLoading(false);
        }
    };

    // Creamos una actividad

    const addActivity = async (activityData) => {
        try{
            const newActivity = await createActivity(activityData);
            setActivities([newActivity, ...activities]);
            message.success("Actividad creada con exito");
            return newActivity;
        }catch (error){
            message.error(error.message || "Error al crear la actividad");
            throw error;
        }
    };

    // Actualizamos una actividad

    const updateActivity = async (id, updates) => {
        try{
            const updatedActivity = await updateActivityService(id, updates);
            setActivities(activities.map((activity) => activity.idActividad === id ? updateActivity : activity));
            message.success("Actividad actualizada con exito");
            return updatedActivity;
        }catch (error) {
            message.error(error.message || "Error al actualizar la actidad");
            throw error;
        }
    };

    const value = {
        activities,
        loading,
        selectedActivity,
        setSelectedActivity,
        fetchActivities: loadActivities,
        addActivity,
        updateActivity,
        deleteActivity,
    };

    return (
        <ActivityContext.Provider value={value}>
            {children}
        </ActivityContext.Provider>
    );

}
