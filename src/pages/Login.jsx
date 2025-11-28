import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, saveToken } from "../services/authService";
import Swal from "sweetalert2";
import "./styles/Login.css";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const data = await login(email, password);
            saveToken(data.token);
            navigate("/cv");
        } catch (err) {
            // err es el objeto que envía Laravel: { error: "..." }
            const message = err.error || "Correo o contraseña incorrectos";

            Swal.fire({
                title: message === "Usuario bloqueado" ? "Acceso denegado" : "Error",
                text: message,
                icon: "error",
            });
        }
    }

    return (
        <div className="page-wrapper">
            <main className="login-container">
                <div className="login-box">
                    <h1 className="title1">Bienvenido</h1>
                    <p className="subtitle">Crea tu CV profesional de forma rápida y sencilla</p>

                    <form onSubmit={handleSubmit} className="form">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <label>Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <button type="submit" className="btn-primary">
                            Entrar
                        </button>
                    </form>

                    <div className="register-section">
                        <p>¿No tienes cuenta?</p>
                        <button
                            className="btn-secondary"
                            onClick={() => navigate("/register")}
                        >
                            Crear cuenta
                        </button>
                    </div>
                </div>
            </main>

            <footer className="footer">
                © {new Date().getFullYear()} ~ Todos los derechos reservados a VertexCode
            </footer>

            <div className="p404-page">
                <h1>Error</h1>
                <span>Pagina no disponible para moviles</span>
            </div>
        </div>
    );
}
