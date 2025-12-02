import { getToken } from "./authService";

const API_URL = "http://127.0.0.1:8000/api/cv";

export async function downloadCV() {
    const token = getToken();
    if (!token) throw new Error("No estás autenticado");

    const res = await fetch(`${API_URL}/download`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json"
        }
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "No se pudo descargar el CV");

    return data;
}
