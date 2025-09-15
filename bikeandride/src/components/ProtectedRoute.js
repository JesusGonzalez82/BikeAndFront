import { Navigate } from "react-router-dom";
import { userAuth } from '../context/AuthContext';

export function ProtectedRoute({children}){
    const {isAuthenticated} = userAuth();
    return isAuthenticated ? children : <Navigate to="/login" replace />
}

export function PublicRoute({children}){
    const {isAuthenticated} = userAuth();
    return isAuthenticated ? <Navigate to="/home" replace /> : children;
}