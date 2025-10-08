const API_URL = 'http://localhost:8080/users';

const fetchConfig = {
    headers: {
        'Content-Type': 'application/json',
    },
};

 // Obtener usuario por ID

 export const getUserId = async (id) =>{
    try{
        const response = await fetch(`${API_URL}/getListUserByUserId/${id}`, fetchConfig);
        if (!response.ok){
            throw new Error('Usuario no encontrado');
        }
        return await response.json();
    }catch (error){
        console.error('Error al obtener el usuario:', error);
        throw error;
    }
 };

 