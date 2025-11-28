import React, { useEffect, useState } from "react";
import { getUsers, toggleUserStatus } from "../../services/adminService";
import "../style/users_table.css";

export default function UsersTable() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await getUsers();
                setUsers(data);
            } catch (err) {
                console.error("Error al cargar usuarios:", err);
            }
        };

        fetchUsers();
    }, []);

    const handleToggleStatus = async (user) => {
        try {
            const newStatus = user.status === "active" ? "blocked" : "active";
            await toggleUserStatus(user.id, newStatus);
            setUsers(prevUsers =>
                prevUsers.map(u =>
                    u.id === user.id ? { ...u, status: newStatus } : u
                )
            );
        } catch (err) {
            console.error("Error al cambiar estado:", err);
        }
    };

    return (
        <div>
            <h2 className="title-seccion-admin">Usuarios</h2>

            <table className="admin-table">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Créditos</th>
                        <th>Borradores</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>

                <tbody>
                    {users.map((u) => (
                        <tr key={u.id}>
                            <td>{u.name}</td>
                            <td>{u.email}</td>
                            <td>{u.credits}</td>
                            <td>{u.drafts_count}</td>
                            <td>{u.status === "active" ? "Activo" : "Bloqueado"}</td>
                            <td>
                                <button onClick={() => handleToggleStatus(u)}>
                                    {u.status === "active" ? "Bloquear" : "Activar"}
                                </button>
                                <button onClick={() => alert("Editar pronto")}>
                                    Editar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
