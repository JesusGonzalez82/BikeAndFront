import dayjs from 'dayjs';

/**
 * Utilidades para manejar fechas entre backend y frontend
 * El frontend usa Day.js de Ant Design que devuelve objetos
 * El backend (Java Spring) espera strings en formato ISO: "YYYY-MM-DD"
 */

/**
 * Convertimos un objeto Day.js a String ISO para el back
 * @param {Object} dateObj - Objeto Day.js de Ant Design
 * @returns {string} Fecha en fomato "YYYY-MM-DD"
 */

export const formatDateForBackend = (dateObj) => {
    if (!dateObj) return null;

    if (typeof dateObj === 'string') return dateObj;

    return dayjs(dateObj).format('YYYY-MM-DD');
};

/**
 * Convertimos un String del backend a objeto Day.js para el front
 * @param {string} dateString - Fecha en fomato "YYYY-MM-DD"
 * @returns {Objetc} Objeto Day.js para usar en DatePicker
 */

export const formatDateForFrontend = (dateString) => {
    if (!dateString) return null;

    return dayjs(dateString);
};

/**
 * Obtenemos la fecha actual en el formato del backend
 * @returns {string} Fecha en formato "YYYY-MM-DD"
 */

export const getCurrentDateForBackend = () => {
    return dayjs().format('YYYY-MM-DD');
};

/**
 * Validamos si una fecha es válida
 * @param {*} date - Fecha a vcalidar (string u objeto Day.js)
 * @returns {boolean} true si es válida, false si no
 */

export const isValidDate = (date) => {
    if (!date) return false;
    return dayjs(date).isValid();
};

/**
 * Convertimos la fecha a formato legible en Español
 * @param {*} date - Fecha
 * @returns {string} Fecha formateada en Español
 */

export const formatDateToSpanish = (date) => {
    if (!date) return '';
    return dayjs(date).locale('es').format('DD [de] MMMM [de] YYYY');
};

/**
 * Calculamos la edad a partir de una fecha de nacimiento
 * @param {*} birthDate - Fecha de nacimiento
 * @returns {number} Edad en años
 */

export const calculateAge = (birthDate) => {
    if (!birthDate) return null;;
    return dayjs().diff(dayjs(birthDate), 'year');
};

/**
 * Formatea un objeto Day.js a formato de tiempo HH:mm:ss
 * @param {Object} timeObj - Objeto Day.js
 * @returns {string} Tiempo en formato "HH:mm:ss"
 */
export const formatTimeForBackend = (timeObj) => {
  if (!timeObj) return null;
  if (typeof timeObj === 'string') return timeObj;
  return dayjs(timeObj).format('HH:mm:ss');
};
