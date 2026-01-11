import { getAuthHeaders } from "./auth-api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export type UserRole = "user" | "admin" | "superadmin";

export interface AdminUser {
    id: number;
    name: string;
    surname?: string;
    email: string;
    phone?: string;
    role?: UserRole;
    created_at?: string;
}

export async function listUsers(): Promise<AdminUser[]> {
    const res = await fetch(`${API_URL}/users`, {
        method: "GET",
        headers: getAuthHeaders(),
        cache: "no-store",
    });
    if (!res.ok) throw new Error("No se pudieron obtener los usuarios");
    const data = await res.json();
    const payload = data?.data ?? data;
    if (Array.isArray(payload?.users)) return payload.users;
    if (Array.isArray(payload)) return payload;
    return [];
}

export async function updateUserRole(userId: number, role: UserRole) {
    const res = await fetch(`${API_URL}/users/${userId}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ role }),
    });
    if (!res.ok) throw new Error("No se pudo actualizar el rol");
    const data = await res.json();
    return data?.data ?? data;
}

export async function deleteUser(userId: number) {
    const res = await fetch(`${API_URL}/users/${userId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("No se pudo eliminar el usuario");
    const data = await res.json();
    return data?.data ?? data;
}
