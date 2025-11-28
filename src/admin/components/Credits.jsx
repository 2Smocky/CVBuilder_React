import React, { useEffect, useState } from "react";
import { getUsers, updateCredits } from "../../services/adminService";
import Swal from "sweetalert2";
import "../style/credits.css";

export default function ManageCredits() {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState(""); // Para filtrar
    const [selectedUser, setSelectedUser] = useState(null);
    const [credits, setCredits] = useState("");
    const [action, setAction] = useState("add");

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await getUsers();
                setUsers(data);
            } catch (err) {
                console.error(err);
                Swal.fire("Error", "No se pudieron cargar los usuarios", "error");
            }
        };
        fetchUsers();
    }, []);

    const handleCredits = async () => {
        if (!selectedUser || !credits) {
            Swal.fire("Error", "Selecciona un usuario y cantidad válida", "warning");
            return;
        }

        try {
            await updateCredits(selectedUser.id, Number(credits), action);
            Swal.fire("Éxito", `Créditos ${action} correctamente`, "success");
            setCredits("");
            setSelectedUser(null);
            setSearch("");
        } catch (err) {
            console.error(err);
            Swal.fire("Error", "No se pudieron actualizar los créditos", "error");
        }
    };

    // Filtrar usuarios por nombre o email
    const filteredUsers = users.filter(
        u =>
            u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
    <div>
        <h2 className="title-seccion-admin">Administrar Créditos</h2>

        <div className="credits-box">

            <input
                type="text"
                placeholder="Buscar usuario por nombre o email"
                value={search}
                onChange={e => setSearch(e.target.value)}
            />

            <ul className="user-list">
                {filteredUsers.map(u => (
                    <li
                        key={u.id}
                        className={selectedUser?.id === u.id ? "selected" : ""}
                        onClick={() => setSelectedUser(u)}
                    >
                        {u.name} ({u.email})
                    </li>
                ))}
            </ul>

            {selectedUser && (
                <p className="selected-user">
                    Usuario seleccionado: {selectedUser.name}
                </p>
            )}

            <input
                type="number"
                placeholder="Cantidad"
                value={credits}
                onChange={e => setCredits(e.target.value)}
            />

            <select value={action} onChange={e => setAction(e.target.value)}>
                <option value="add">Agregar</option>
                <option value="subtract">Restar</option>
                <option value="set">Establecer</option>
            </select>

            <button onClick={handleCredits}>Actualizar Créditos</button>
        </div>
    </div>
);
}
