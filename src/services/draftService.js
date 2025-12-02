import { getToken } from "./authService";

const API_URL = "http://127.0.0.1:8000/api/cv/drafts";

export async function getDrafts() {
    const res = await fetch(API_URL, {
        headers: { 
            "Authorization": `Bearer ${getToken()}`,
            "Accept": "application/json"
        }
    });

    if (!res.ok) throw new Error("Error al obtener borradores");
    return await res.json();
}

export async function saveDraft(titulo, data) {
    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken()}`,
                "Accept": "application/json"
            },
            body: JSON.stringify({ titulo, data }),
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Error al guardar el borrador");
        }

        return await res.json();
    } catch (error) {
        // Captura errores de red o errores lanzados desde la respuesta
        throw new Error(error.message || "No se pudo conectar con el servidor");
    }
}

export async function updateDraft(id, data) {
    try {
        const res = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken()}`,
                "Accept": "application/json"
            },
            body: JSON.stringify({ data }),
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Error al actualizar el borrador");
        }

        return await res.json();
    } catch (error) {
        // Captura errores de red o errores lanzados desde la respuesta
        throw new Error(error.message || "No se pudo conectar con el servidor");
    }
}

export async function getDraft(id) {
    const res = await fetch(`${API_URL}/${id}`, {
        headers: { 
            "Authorization": `Bearer ${getToken()}`,
            "Accept": "application/json"
        }
    });

    if (!res.ok) throw new Error("Error al cargar borrador");
    return await res.json();
}

export async function deleteDraft(id) {
    const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: { 
            "Authorization": `Bearer ${getToken()}`,
            "Accept": "application/json"
        }
    });

    if (!res.ok) throw new Error("Error al eliminar borrador");
    return await res.json();
}
