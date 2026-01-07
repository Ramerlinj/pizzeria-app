import { getAuthHeaders } from "./auth-api";

export interface City {
    id: number;
    name: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export async function listCities(): Promise<City[]> {
    const res = await fetch(`${API_URL}/cities`, {
        method: "GET",
        headers: getAuthHeaders(),
        cache: "no-store",
    });
    if (!res.ok) throw new Error("No se pudieron obtener las ciudades");
    const data = await res.json();
    const payload = data?.data ?? data;
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload?.cities)) return payload.cities;
    return [];
}
