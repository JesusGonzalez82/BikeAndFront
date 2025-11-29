import config from "../config/enviroment";
const API_BASE = config.API_URL;
const API_BIKES = `${API_BASE}/bikes`;

const fetchConfig = {
  headers: { "Content-Type": "application/json" },
};

// Funcion para obtener el id del usuario autenticado
const getUserId = () => {
  const user = localStorage.getItem("user");
  if (user) {
    const userData = JSON.parse(user);
    return userData.idUser;
  }
  return null;
};

// GET - Obtenemos todas las bicicletas del usuario
export const getBikes = async () => {
  const userId = getUserId();
  if (!userId) {
    throw new Error("Usuario no autenticado");
  }
  const response = await fetch(`${API_BIKES}/getListBikeByUserId/${userId}`, {
    method: "GET",
    headers: fetchConfig.headers,
  });
  if (!response.ok) {
    throw new Error("Error al obtener las bicicletas");
  }
  return await response.json();
};

// GET - Obetenmos una bici por su id
export const getBikesById = async (bikeId) => {
  const userId = getUserId();
  if (!userId) {
    throw new Error("Usuario no autenticado");
  }
  const response = await fetch(`${API_BIKES}/${bikeId}?userId=${userId}`, {
    method: "GET",
    headers: fetchConfig.headers,
  });
  if (!response.ok) {
    throw new Error("Bicicleta no encontrada");
  }
  return await response.json();
};

export const createBike = async (bikeData) => {
  const userId = getUserId();
  if (!userId) {
    throw new Error("Usuario no autenticado");
  }

 
  const dataToSend = {
    type: bikeData.type, 
    bike_brand: bikeData.bike_brand, 
    model: bikeData.model, 
    birthday: bikeData.birthday.toString(), 
    weight: parseFloat(bikeData.weight), 
    bike_material: bikeData.bike_material, 
    status: bikeData.status, 
    user: { idUser: userId } 
  };

  // Imprime los datos enviados para depuración
  console.log("Datos enviados al backend:", dataToSend);

  const response = await fetch(`${API_BIKES}/create`, {
    method: "POST",
    headers: fetchConfig.headers,
    body: JSON.stringify(dataToSend),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Error al crear la bicicleta");
  }

  // Imprime la respuesta del backend para depuración
  const createdBike = await response.json();
  console.log("Bicicleta creada:", createdBike);

  return createdBike;
};

// PATCH - Actualizamos una bicicleta parcialmente
export const updateBike = async (bikeId, updates) => {

  const filteredUpdates = {};

  if (updates.type) filteredUpdates.tipo = updates.type;
  if (updates.birthday) filteredUpdates.anio = updates.birthday;
  if (updates.status) filteredUpdates.status = updates.status;
  if (updates.weight) filteredUpdates.weight = updates.weight;

  const response = await fetch(`${API_BIKES}/update/${bikeId}`, {
    method: 'PATCH',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(filteredUpdates),
  });

  if (!response.ok) {
    throw new Error("Error al actualizar la bicicleta");
  }

  return response.json();
}

// // DELETE - Eliminamos una bicicleta
// export const deleteBike = async (bikeId) => {
//   const userId = getUserId();
//   if (!userId) {
//     throw new Error("Usuario no autennticado");
//   }
//   const response = await fetch(`${API_BIKES}/${bikeId}?userId=${userId}`, {
//     method: "DELETE",
//     headers: fetchConfig.headers,
//   });
//   if (!response.ok) {
//     throw new Error("Error al eliminar la bicicleta");
//   }
//   return await response.json();
// };

//POST - Subimos una imagen de una bicicleta
export const uploadBikeImage = async (bikeId, imageFile) => {
  const userId = getUserId();
  if (!userId){
    throw new Error("Usuario no autenticado");
  }

  const formData = new FormData();
  formData.append('image', imageFile);
  formData.append('userId', userId);

  const response = await fetch(`${API_BIKES}/${bikeId}/image`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Error al subir la imagen de la bicicleta");
  }
  return await response.json();
}

// DELETE - Eliminamos la imagen de una bicicleta
export const deleteBikeImage = async (bikeId) => {
  const userId = getUserId();
  if (!userId){
    throw new Error("Usuario no autenticado");
  }
  const response = await fetch(`${API_BIKES}/${bikeId}/image?userId=${userId}`, {
    method: "DELETE",
    headers: fetchConfig.headers,
  });
  if(!response.ok){
    throw new Error("Error al eliminar la imagen de la bicicleta");
  }
  return await response.json();
}

