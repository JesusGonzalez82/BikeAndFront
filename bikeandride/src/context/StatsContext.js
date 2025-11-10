import React, { createContext, useContext, useState } from "react";
import { getUserStats } from "../services/statsService";

const StatsContext = createContext();

export function useStats() {
    const context = useContext(StatsContext);
    if (!context){
        throw new Error("useStats debe estar dentro de un StatsProvider");
    }
    return context;
}

export function StatsProvider({ children}) {
    const [stats, setStats] = useState({
        totalBikes: 0,
        totalRoutes: 0,
        TotalActivities: 0,
        totalKm: 0,
    });
    const [loading, setLoading] = useState(false);
    
    const loadStats = async () => {
        try {
            setLoading(true);
            const data = await getUserStats();
            setStats(data);
        }catch (error) {
            console.error("Error al cargar las estadisticas: ", error);
        }finally {
            setLoading(false);
        }
    };

    const value = {
        stats,
        loading,
        loadStats,
    };

    return (
        <StatsContext.Provider value={value}>
            {children}
        </StatsContext.Provider>
    );
}