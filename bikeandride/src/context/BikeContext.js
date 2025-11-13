import React, { createContext, useContext, useState, useEffect} from "react";
import { getBikes, createBike, updateBike as updateBikeService } from "../services/bikeService";
import { message } from "antd";

const BikeContext = createContext();

export function useBikes() {
    const context = useContext(BikeContext);
    if (!context) {
        throw new Error("useBikes deber ser usado dentro de BikeProvider");
    }
    return context;
}

export function BikeProvider({ children }) {
    const [bikes, setBikes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedBike, setSelectedBike] = useState(null);

    useEffect(() => {
        loadBikes();
    }, []);
    // Funcion para cargar las bicicletas de los usuarios
    const loadBikes = async () => {
        try{
            setLoading(true);
    
        const [data] = await Promise.all([
        getBikes(),
        new Promise(resolve => setTimeout(resolve, 500))
        ]);

            const mappedBikes = data.map(bike => ({
                id_bici: bike.idBike,
                marca: bike.bike_brand,
                modelo: bike.model,
                anio: bike.birthday,
                tipo_bici: bike.type,
                peso: bike.weight,
                material: bike.bike_material,
                status: bike.status,
        }));
            setBikes(mappedBikes);
        }catch (error){
            console.error('Error al cargar las bicis: ', error);
        }finally{
            setLoading(false)
        }
    };
        
    // Funcion para Crear una nueva bicicleta
    const addBike = async (bikeData) => {
        try{
            const newBike = await createBike(bikeData);
            setBikes([...bikes, newBike]);
            message.success("Bicicleta creada con exito");
            return newBike;
        }catch (error) {
            message.error(error.message || "Error al crear la bicicleta");
            throw error;
        }
    };

    // Funcion para editar una bicicleta
    const updateBike = async (id, updates) => {
        try {
            const updateBike = await updateBikeService(id, updates);
            setBikes(bikes.map(bike => bike.id_bici === id ? updateBike : bike));
            message.success("Bicicleta actualizada con exito");
            return updateBike;
        }catch (error) {
            message.error(error.message || "Error al actualizar la biciccleta");
            throw error;
        }
    }

    // // Funciona para eliminar una bicicleta
    // const deleteBike = async (id) => {
    //     try {
    //         await deleteBikeService(id);
    //         setBikes(bikes.filter(bike => bike.id_bici !== id));
    //         message.success("Bicicleta elimanada con exito");
    //     }catch (error) {
    //         message.error(error.message || "Error al eliminar la bicicleta");
    //         throw error;
    //     }
    // };

    const value = {
        bikes,
        loading,
        selectedBike,
        setSelectedBike,
        fetchBikes: loadBikes,
        addBike,
        updateBike,
        // deleteBike
    }

    return (
        <BikeContext.Provider value={value}>
            {children}
        </BikeContext.Provider>
    )

}

