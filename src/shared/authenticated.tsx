import React, {createContext, ReactElement, useEffect, useState} from "react";

export interface User {
    id: string;
    name: string;
    email: string;
    username?: string;
    role?: 'user' | 'officer';
}

type AuthContextType = {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    logout: () => void;
}

const AuthenticatedContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'authUser';

const AuthenticatedProvider = ({children}: {children: ReactElement}) => {
    // Load initial user from localStorage if present
    const [user, setUser] = useState<User | null>(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return null;
            return JSON.parse(raw) as User;
        } catch (e) {
            console.error('Failed to parse stored user', e);
            return null;
        }
    });

    // persist changes
    useEffect(() => {
        try {
            if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
            else localStorage.removeItem(STORAGE_KEY);
        } catch (e) {
            console.error('Failed to persist user', e);
        }
    }, [user]);

    const logout = () => setUser(null);

    return (
        <AuthenticatedContext.Provider value={{user, setUser, logout}}>{children}</AuthenticatedContext.Provider>
    )
}

export { AuthenticatedProvider, AuthenticatedContext };