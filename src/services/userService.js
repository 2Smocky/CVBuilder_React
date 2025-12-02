import { getToken } from "./authService";

const API_URL = "http://127.0.0.1:8000/api";

export async function getCredits() {
    const token = getToken();
    if (!token) {
        throw new Error("No estás autenticado. Por favor, inicia sesión.");
    }

    const res = await fetch(`${API_URL}/credits`, {
        headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json"
        }
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "No se pudo obtener tu balance de créditos.");
    }

    return await res.json();
}
