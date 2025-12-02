import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register as registerUser } from "../services/authService";
import Swal from "sweetalert2";
import "./styles/Register.css";

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const validatePassword = (password) => {
        const errors = [];
        if (password.length <= 6) {
            errors.push("La contraseña debe tener más de 6 caracteres.");
        }
        if (!/[A-Z]/.test(password)) {
            errors.push("La contraseña debe contener al menos una letra mayúscula.");
        }
        if (!/[0-9]/.test(password)) {
            errors.push("La contraseña debe contener al menos un número.");
        }
        return errors;
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            Swal.fire({
                title: "Error",
                text: "Las contraseñas no coinciden.",
                icon: "error",
            });
            return;
        }

        const passwordErrors = validatePassword(password);
        if (passwordErrors.length > 0) {
            Swal.fire({
                title: "Error en la contraseña",
                html: passwordErrors.join("<br>"),
                icon: "error",
            });
            return;
        }

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
                err?.response?.data?.errors
                    ? Object.values(err.response.data.errors).flat()[0] // Primer error de Laravel
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
                            type={showPassword ? "text" : "password"}
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <label>Confirmar Contraseña</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Confirmar Contraseña"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />

                        <div>
                            <input
                                type="checkbox"
                                id="show-password"
                                checked={showPassword}
                                onChange={() => setShowPassword(!showPassword)}
                            />
                            <label htmlFor="show-password">Mostrar contraseñas</label>
                        </div>

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
