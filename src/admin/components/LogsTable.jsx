import React, { useEffect, useState } from "react";
import { getLogs } from "../../services/adminService";
import "../style/logs.css";

export default function LogsTable() {
    const [logs, setLogs] = useState({ data: [] });
    const [loading, setLoading] = useState(true);

    // --- FILTROS ---
    const [search, setSearch] = useState("");
    const [action, setAction] = useState("");
    const [date, setDate] = useState(""); // ⬅ SOLO UNA FECHA

    // --- PAGINACIÓN ---
    const [page, setPage] = useState(1);

    const loadLogs = async (applyFilters = false) => {
        setLoading(true);

        const filters = {
            page
        };

        // solo se agregan si el usuario oprime Filtrar
        if (applyFilters) {
            if (search) filters.search = search;
            if (action) filters.action = action;
            if (date) filters.date = date;
        }

        try {
            const data = await getLogs(filters);
            setLogs(data);
        } catch (err) {
            console.error("Error al cargar logs:", err);
        } finally {
            setLoading(false);
        }
    };

    // Cargar logs iniciales SIN filtros
    useEffect(() => {
        loadLogs(false);
    }, [page]);

    const handleFilter = () => {
        setPage(1);
        loadLogs(true);
    };

    if (loading) return <p>Cargando logs...</p>;

    return (
        <div>

            <h2 className="title-seccion-admin">Registros del sistema</h2>

            <div className="table-container">

                {/* ---------------- FILTROS ---------------- */}
                <div className="filters" style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
                    <input
                        type="text"
                        placeholder="Buscar..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <select value={action} onChange={(e) => setAction(e.target.value)}>
                        <option value="">Todas</option>
                        <option value="Info">Info</option>
                        <option value="Warning">Warning</option>
                        <option value="CV">Descargas</option>
                        <option value="créditos">Créditos</option>
                    </select>

                    {/* SOLO UNA FECHA */}
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />

                    <button onClick={handleFilter}>Filtrar</button>
                </div>

                {/* ---------------- TABLA ---------------- */}
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Usuario</th>
                            <th>Acción</th>
                            <th>Fecha</th>
                        </tr>
                    </thead>

                    <tbody>
                        {logs.data.length === 0 ? (
                            <tr>
                                <td colSpan="4">Sin resultados</td>
                            </tr>
                        ) : (
                            logs.data.map((log) => (
                                <tr key={log.id}>
                                    <td>{log.id}</td>
                                    <td>{log.user?.email || "Sistema"}</td>
                                    <td>{log.action}</td>
                                    <td>{new Date(log.created_at).toLocaleString()}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {/* ---------------- PAGINACIÓN ---------------- */}
                <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
                    <button
                        disabled={!logs.prev_page_url}
                        onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    >
                        ◀ 
                    </button>

                    <span>Página {logs.current_page} de {logs.last_page}</span>

                    <button
                        disabled={!logs.next_page_url}
                        onClick={() => setPage((p) => p + 1)}
                    >
                         ▶
                    </button>
                </div>
            </div>
        </div>
    );
}
