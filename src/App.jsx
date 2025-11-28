import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CVBuilder from "./pages/CVBuilder";
import PrivateRoute from "./components/PrivateRoute";

import AdminLogin from "./admin/AdminLogin";
import AdminPanel from "./admin/AdminPanel";
import AdminRoute from "./admin/routes/AdminRoute";

function App() {
    return (
        <Routes>

            {/* Login normal */}
            <Route path="/login" element={<Login />} />

            {/* Registro normal */}
            <Route path="/register" element={<Register />} />

            {/* Panel normal protegido */}
            <Route
                path="/cv"
                element={
                    <PrivateRoute>
                        <CVBuilder />
                    </PrivateRoute>
                }
            />

            {/* 🟦 ADMIN LOGIN */}
            <Route path="/admin" element={<AdminLogin />} />

            {/* 🟩 ADMIN PANEL (Protegido) */}
            <Route
                path="/admin/panel"
                element={
                    <AdminRoute>
                        <AdminPanel />
                    </AdminRoute>
                }
            />

            {/* Redirección por defecto */}
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
}

export default App;
