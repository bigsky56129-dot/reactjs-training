import React, {createContext, ReactElement, useState} from "react";

export interface User {
    id: string;
    name: string;
    email: string;
    role?: 'user' | 'officer';
}

type AuthContextType = {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthenticatedContext = createContext<AuthContextType | undefined>(undefined);

const AuthenticatedProvider = ({children}: {children: ReactElement}) => {
    // The app starts without an authenticated user by default.
    const [user, setUser] = useState<User | null>(null);

    return (
        <AuthenticatedContext.Provider value={{user, setUser}}>{children}</AuthenticatedContext.Provider>
    )
}

export { AuthenticatedProvider, AuthenticatedContext };