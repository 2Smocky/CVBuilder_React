// src/services/adminService.js

const API_URL = "http://127.0.0.1:8000/api/admin";
const ADMIN_KEY = "superadmin123"; // tu clave de admin

// Helper para hacer fetch con la cabecera de admin
const fetchAdmin = async (endpoint, options = {}) => {
    const res = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            "X-ADMIN-KEY": ADMIN_KEY,
            ...(options.headers || {}),
        },
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Error ${res.status}: ${errorText}`);
    }

    return res.json();
};

// Obtener estadísticas del dashboard
export const getStats = async () => {
    return fetchAdmin("/stats");
};

// Obtener lista de usuarios
export const getUsers = async () => {
    return fetchAdmin("/users");
};

// Actualizar créditos de un usuario (sumar, restar o establecer)
export const updateCredits = async (userId, amount, action) =>
    fetchAdmin("/credits", {
        method: "POST",
        body: JSON.stringify({ user_id: userId, amount, action }),
    });

// Cambiar estado ON/OFF de un usuario
export const toggleUserStatus = async (userId, status) =>
    fetchAdmin("/user-status", {
        method: "POST",
        body: JSON.stringify({ user_id: userId, status }),
    });

// Obtener logs del sistema
export const getLogs = async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return fetchAdmin(`/logs?${params}`);
};
