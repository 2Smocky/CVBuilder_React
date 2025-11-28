import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register as registerUser } from "../services/authService";
import Swal from "sweetalert2";
import "./styles/Register.css";

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            // Registrar usuario
            await registerUser({ name, email, password });

            // Mostrar alerta de éxito
            await Swal.fire({
                title: "¡Registro exitoso!",
                text: "Tu cuenta ha sido creada correctamente.",
                icon: "success",
                confirmButtonText: "Continuar",
            });

            // Redirigir al login
            navigate("/login");

        } catch (err) {
            console.error(err);

            const errorMsg =
                err?.errors
                    ? Object.values(err.errors).flat()[0] // Primer error de Laravel
                    : "Error durante el registro";

            Swal.fire({
                title: "Error",
                text: errorMsg,
                icon: "error",
            });
        }
    };

    return (
        <div className="page-wrapper-register">
            <div className="register-container">

                <div className="register-box">
                    <h2 className="title1">Crear cuenta</h2>
                    <p className="subtitle">Regístrate para continuar</p>

                    <form className="register-form" onSubmit={handleRegister}>
                        <label>Nombre completo</label>
                        <input
                            type="text"
                            placeholder="Nombre"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />

                        <label>Correo electrónico</label>
                        <input
                            type="email"
                            placeholder="Correo"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <label>Contraseña</label>
                        <input
                            type="password"
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <button className="btn-primary" type="submit">
                            Crear cuenta
                        </button>
                    </form>

                </div>

            </div>

            <footer className="footer-register">
                © 2025 — Todos los derechos reservados | Tu App
            </footer>

            <div className="p404-page">
                <h1>Error</h1>
                <span>Pagina no disponible para moviles</span>
            </div>
        </div>
    );
}
