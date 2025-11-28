const API_URL = "http://127.0.0.1:8000/api";

export async function login(email, password) {
    const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
        throw data; // ← Devuelve errores reales de Laravel
    }

    return data;
}

export async function register(data) {
    const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(data),
    });

    const responseData = await res.json();

    if (!res.ok) {
        throw responseData; // ← Aquí ya recibes los mensajes exactos de validación
    }

    return responseData;
}

export function saveToken(token) {
    localStorage.setItem("token", token);
}

export function getToken() {
    return localStorage.getItem("token");
}

export function logout() {
    localStorage.removeItem("token");
}
