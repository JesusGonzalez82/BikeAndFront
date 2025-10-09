const API_URL = 'http://localhost:8080/users';

const fetchConfig = {
    headers: {
        'Content-Type': 'application/json',
    },
};

 // GET - Obtener usuario por ID

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

 // POST - Creo un nuevo usuario

 export const createUser = async (userData) =>{
    try{
        const response = await fetch(`${API_URL}/create`,{
            method: 'POST',
            ...fetchConfig,
            body: JSON.stringify(userData),
        });
        if(!response.ok){
            const errorData = await response.text();
            throw new Error(errorData || 'Error al crear el usuario');
        }
        return await response.json();
    }catch (error){
        console.error('Error al crear el usuario', error);
        throw error;
    }
 }

 // PATCH - Actualizo parcialmente un usuario

 export const updateUser = async (id, updates) =>{
    try{
        const response = await fetch(`${API_URL}/update/${id}`,{
            method: 'PATCH',
            ...fetchConfig,
            body: JSON.stringify(updates),
        });
        if(!response.ok){
            throw new Error('Error al actualizar el usuario');
        }
        return await response.json();
    }catch(error){
        console.error('Error al modificar el usuario', error);
        throw error;
    }
 }

 // DELETE - Desactivo un usuario

 export const deactivateUser = async(id) =>{
    try{
        const response = await fetch(`${API_URL}/${id}`,{
            method: 'DELETE',
            ...fetchConfig,
        });
        if(!response.ok){
            throw new Error ('Error al desactivar el usuario');
        }
        return await response.json();
    }catch(error){
        console.error('Error al desactivar el usuario', error);
        throw error;
    }
 }

 // PUT - Reactivo un usuario

 export const reactivateUser = async(id)=>{
    try{
        const response = await fetch(`${API_URL}/${id}/reactivate`,{
            method: 'PUT',
            ...fetchConfig,
        });
        if(!response.ok){
            throw new Error('Error al reactivar el usuario');
        }
        return await response.json();
    }catch(error){
        console.error('Error al reactivar el usuario', error);
        throw error;
    }
 }

 // LOGIN - Auntenico usuario
 
 export const loginUser = async(name, password) =>{
    try{
        const response = await fetch(`${API_URL}/login`,{
            method:'POST',
            ...fetchConfig,
            body: JSON.stringify({ name, password}),
        });
        if(!response.ok){
            if(response.status===401){
                throw new Error('Usuario o contraseña incorrectos');
            }else if(response.status===403){
                throw new Error('Usuario inactivo. Contacta con el administrador');
            }
            throw new Error('Error al inicia sesión');
        }
        return await response.json();
    }catch(error){
        console.error('Error al hacer login: ', error);
        throw error;
    }
 }