const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080"; // fallback por seguridad
console.log("API_URL =", API_URL); // para verificar
const env = { API_URL };
export default env;