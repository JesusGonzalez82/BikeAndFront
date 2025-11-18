import config from '../config/enviroment';

const API_BASE = config.API_URL;
const API_USERS = `${API_BASE}/users`;

const fetchConfig = {
  headers: { 'Content-Type': 'application/json' },
};

//  GET - Obtener todos los usuarios
export async function getUsers() {
  const response = await fetch(API_USERS);
  if (!response.ok) throw new Error('Error al obtener los usuarios');
  return await response.json();
}

//  GET - Obtener usuario por ID
export const getUserId = async (id) => {
  const response = await fetch(`${API_USERS}/getListUserByUserId/${id}`, fetchConfig);
  if (!response.ok) throw new Error('Usuario no encontrado');
  return await response.json();
};

//  POST - Crear nuevo usuario
export const createUser = async (userData) => {
  const response = await fetch(`${API_USERS}/create`, {
    method: 'POST',
    ...fetchConfig,
    body: JSON.stringify(userData),
  });
  if (!response.ok) throw new Error(await response.text() || 'Error al crear el usuario');
  return await response.json();
};

//  PATCH - Actualizar parcialmente un usuario
export const updateUser = async (id, updates) => {
  const response = await fetch(`${API_USERS}/update/${id}`, {
    method: 'PATCH',
    ...fetchConfig,
    body: JSON.stringify(updates),
  });
  if (!response.ok) throw new Error('Error al actualizar el usuario');
  return await response.json();
};

// DELETE - Desactivar usuario (soft delete)
export const deactivateUser = async (userId) => {
  const response = await fetch(`${API_USERS}/${userId}`, {
    method: "DELETE",
    headers: fetchConfig.headers,
  });

  if (!response.ok) {
    throw new Error("Error al desactivar el usuario");
  }

  return await response.json();
};

// PUT - Reactivar usuario
export const reactivateUser = async (userId) => {
  const response = await fetch(`${API_USERS}/${userId}/reactivate`, {
    method: "PUT",
    headers: fetchConfig.headers,
  });

  if (!response.ok) {
    throw new Error("Error al reactivar el usuario");
  }

  return await response.json();
};

//  POST - Login de usuario
export const loginUser = async (email, password) => {
  const response = await fetch(`${API_USERS}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(errorData.error || "Error al iniciar sesión: ");

    error.response = {
      status: response.status,
      data: errorData
    };

    throw error;
    
  }

  return await response.json();
};