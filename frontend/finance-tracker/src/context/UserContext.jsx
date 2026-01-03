import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';

const UserContext = createContext();
export { UserContext };

const UserProvider = ({ children }) => {
    // Initialize from localStorage so reloads/dev helper keep the user visible
    const [user, setUser] = useState(() => {
        try {
            const raw = localStorage.getItem('user');
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    });

    // keep localStorage in sync with context
    useEffect(() => {
        try {
            if (user) {
                localStorage.setItem('user', JSON.stringify(user));
            } else {
                localStorage.removeItem('user');
            }
        } catch {
            // Ignore localStorage errors
        }
    }, [user]);

    // Memoize functions to prevent unnecessary re-renders
    const updateUser = useCallback((userData) => {
        setUser(userData);
    }, []);

    const clearUser = useCallback(() => {
        setUser(null);
        try {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        } catch {
            // Ignore localStorage errors
        }
    }, []);

    // Memoize context value to prevent unnecessary re-renders
    const contextValue = useMemo(() => ({
        user,
        updateUser,
        clearUser
    }), [user, updateUser, clearUser]);

    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    );
}

export default UserProvider;