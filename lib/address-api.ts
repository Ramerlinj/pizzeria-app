import { getAuthHeaders } from "./auth-api";

export interface Address {
    id: number;
    user_id: number;
    address_line: string;
    city_id: number;
    sector?: string | null;
    reference?: string | null;
    created_at?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export async function listAddresses(): Promise<Address[]> {
    const res = await fetch(`${API_URL}/addresses`, {
        method: "GET",
        headers: getAuthHeaders(),
        cache: "no-store",
    });
    if (!res.ok) throw new Error("No se pudieron obtener las direcciones");
    const data = await res.json();
    return data.data || data;
}

export async function getAddress(id: number): Promise<Address> {
    const res = await fetch(`${API_URL}/addresses/${id}`, {
        method: "GET",
        headers: getAuthHeaders(),
        cache: "no-store",
    });
    if (!res.ok) throw new Error("No se pudo obtener la dirección");
    const data = await res.json();
    return data.data || data;
}

interface UpsertAddressPayload {
    address_line: string;
    city_id: number;
    sector?: string;
    reference?: string;
}

export async function createAddress(payload: UpsertAddressPayload): Promise<Address> {
    const res = await fetch(`${API_URL}/addresses`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("No se pudo crear la dirección");
    const data = await res.json();
    return data.data || data;
}

export async function updateAddress(id: number, payload: UpsertAddressPayload): Promise<Address> {
    const res = await fetch(`${API_URL}/addresses/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("No se pudo actualizar la dirección");
    const data = await res.json();
    return data.data || data;
}

export async function deleteAddress(id: number): Promise<void> {
    const res = await fetch(`${API_URL}/addresses/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("No se pudo eliminar la dirección");
}
