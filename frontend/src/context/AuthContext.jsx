import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    axios.defaults.withCredentials = true; // Important for cookies!

    useEffect(() => {
        checkUser();
    }, []);

    const checkUser = async () => {
        try {
            const res = await axios.get('http://localhost:5000/users/me');
            setUser(res.data);
        } catch (err) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const res = await axios.post('http://localhost:5000/auth/login', { email, password });
            setUser(res.data.user);
            return { success: true };
        } catch (err) {
            return { success: false, error: err.response?.data?.error || 'Login failed' };
        }
    };

    const register = async (username, email, password) => {
        try {
            await axios.post('http://localhost:5000/auth/register', { username, email, password });
            return { success: true };
        } catch (err) {
            return { success: false, error: err.response?.data?.error || 'Register failed' };
        }
    }

    const logout = async () => {
        await axios.post('http://localhost:5000/auth/logout');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
