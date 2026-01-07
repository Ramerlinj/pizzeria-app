import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export interface User {
    id: number;
    name: string;
    surname?: string;
    email: string;
    phone?: string;
    role?: string; // Assuming role based on "admin" mention
    email_verified_at?: string;
}

export interface AuthResponse {
    user: User;
    access_token: string;
    token_type: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    name: string;
    surname?: string;
    email: string;
    password: string;
    password_confirmation: string;
    phone?: string;
}

export const setToken = (token: string) => {
    Cookies.set("auth_token", token, { expires: 7, secure: true, sameSite: 'Strict' });
};

export const getToken = (): string | undefined => {
    return Cookies.get("auth_token");
};

export const removeToken = () => {
    Cookies.remove("auth_token");
};

export const getAuthHeaders = () => {
    const token = getToken();
    return {
        "Content-Type": "application/json",
        "Accept": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        body: JSON.stringify(credentials),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Error al iniciar sesión");
    }

    const data = await res.json();
    return data.data || data;
};

export const register = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        body: JSON.stringify(credentials),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Error al registrarse");
    }

    const data = await res.json();
    return data.data || data;
};

export const getMe = async (): Promise<User> => {
    const res = await fetch(`${API_URL}/auth/me`, {
        method: "GET",
        headers: getAuthHeaders(),
    });

    if (!res.ok) {
        // If unauthorized, we just throw a specific error that can be ignored or handled
        if (res.status === 401) {
            throw new Error("No autorizado");
        }
        throw new Error("Error al obtener usuario");
    }

    const data = await res.json();
    console.log("getMe response:", data);

    // Handle various response structures
    if (data.data && data.data.user) return data.data.user; // { data: { user: ... } }
    if (data.data) return data.data; // { data: ... }
    if (data.user) return data.user; // { user: ... }

    return data; // { ... }
};

export const logout = async (): Promise<void> => {
    try {
        await fetch(`${API_URL}/auth/logout`, {
            method: "POST",
            headers: getAuthHeaders(),
        });
    } finally {
        removeToken();
    }
};
