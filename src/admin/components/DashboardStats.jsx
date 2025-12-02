import React, { useEffect, useState } from "react";
import { getStats } from "../../services/adminService";
import "../style/dashboard_stats.css";

export default function DashboardStats() {
    const [stats, setStats] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getStats();
                setStats(data);
            } catch {
                setError("No se pudieron cargar las estadísticas");
            }
        };

        fetchStats();
    }, []);

    if (error) return <p>{error}</p>;
    if (!stats) return <p>Cargando...</p>;

    return (
        <div className="dashboard-container">
            <h2>Dashboard</h2>

            <div className="stats-grid">
                <div className="stat-card">Total usuarios: {stats.users}</div>
                <div className="stat-card">Total borradores: {stats.drafts}</div>
                <div className="stat-card">Usuarios activos: {stats.active_users}</div>
                <div className="stat-card">Usuarios bloqueados: {stats.blocked_users}</div>
            </div>
        </div>
    );
}
