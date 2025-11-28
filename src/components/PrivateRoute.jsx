import { Navigate } from "react-router-dom";
import { getToken } from "../services/authService";

export default function PrivateRoute({ children }) {
    const token = getToken();

    if (!token) return <Navigate to="/login" />;

    return children;
}
