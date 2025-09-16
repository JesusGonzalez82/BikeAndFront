import React, {createContext, useContext, useState, useEffect} from "react";

// Utilizamos Context para compartir datos entre todos los componenetes de la app, asi no tenemos que pasar
// props manualmente de padre a hijo.

const AuthContext = createContext();

export function useAuth(){
    const context = useContext(AuthContext);
    if (!context){
        throw new Error ('useAuth debe ser usado dentro de AuthProvider');
    }
    return context;
}

export function AuthProvider({ children }){
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);


//Verificar si hay algún usuario logeado

useEffect(() =>{
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');

    if (token && userData){
        try{
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
            setIsAuthenticated(true);
        }catch(error){
            console.error('Error parsing user data: ', error);
            logout();
        }  
    }
    setLoading(false);
}, []);
    const login = (userData, token) => {
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        setIsAuthenticated(true);
    };

    const logout = () =>{
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        localStorage.removeItem('tokenType');
        setUser(null);
        setIsAuthenticated(false);
    };

    const value = {
        user,
        isAuthenticated,
        login,
        logout,
        loading
    };

    return(
        <AuthContext.Provider value ={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}