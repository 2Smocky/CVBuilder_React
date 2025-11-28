import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style/admin_login.css";
import Swal from "sweetalert2";


export default function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (email === "admin@gmail.com" && password === "123456") {
            localStorage.setItem("adminAuth", "true");
            navigate("/admin/panel");
        } else {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Credenciales incorrectas",
                confirmButtonText: "Intentar de nuevo"
            });
        }
    };

    return (
        <div className="admin-login">
            <h2>Admin Login</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Correo"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Clave"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Ingresar</button>
            </form>
        </div>
    );
}
