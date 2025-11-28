import "../style/sidebar_admin.css";

export default function SidebarAdmin({ setSection, menuOpen, setMenuOpen }) {
    return (
        <div className="admin-sidebar">
            <div className="logo">
                <h2>CVBuilder</h2>
                <span>Admin Panel</span>
            </div>

            {/* Contenedor que se oculta/muestra */}
            <div className={`menu-items ${menuOpen ? "open" : ""}`}>
                <button onClick={() => { setSection("dashboard"); setMenuOpen(false); }}>Dashboard</button>
                <button onClick={() => { setSection("users"); setMenuOpen(false); }}>Usuarios</button>
                <button onClick={() => { setSection("credits"); setMenuOpen(false); }}>Créditos</button>
                <button onClick={() => { setSection("logs"); setMenuOpen(false); }}>Ver Logs</button>

                <button
                    className="logout-btn"
                    onClick={() => {
                        localStorage.removeItem("adminAuth");
                        window.location.href = "/admin";
                    }}
                >
                    Cerrar sesión
                </button>
            </div>
        </div>
    );
}

