import { getAuthHeaders } from "./auth-api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export interface OrderItemPayload {
    product_id: number;
    quantity?: number;
}

export interface AddressPayload {
    address_line: string;
    city_id: number;
    sector?: string;
    reference?: string;
}

export interface CreateOrderPayload {
    address_id?: number;
    address?: AddressPayload;
    items: OrderItemPayload[];
}

export interface Payment {
    id: number;
    method: "cash" | "card";
    status: "pending" | "paid" | "approved" | "rejected";
    amount: number;
    transaction_id?: string | null;
    created_at?: string;
}

export interface Order {
    id: number;
    status: string;
    total: number;
    items?: OrderItemPayload[];
    created_at?: string;
}

export interface OrderDetail extends Order {
    payments?: Payment[];
    address?: AddressPayload & { id?: number };
}

export async function createOrder(payload: CreateOrderPayload): Promise<Order> {
    const res = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
    });
    if (!res.ok) {
        throw new Error("No se pudo crear la orden");
    }
    const data = await res.json();
    const maybe = data?.data ?? data;
    if (maybe?.order) return maybe.order;
    return maybe;
}

export interface CreatePaymentPayload {
    amount: number;
    method: "cash" | "card";
    status: "pending" | "paid" | "approved" | "rejected";
    transaction_id?: string | null;
}

export async function createPayment(orderId: number, payload: CreatePaymentPayload) {
    const res = await fetch(`${API_URL}/orders/${orderId}/payments`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
    });
    if (!res.ok) {
        throw new Error("No se pudo registrar el pago");
    }
    const data = await res.json();
    return data?.data ?? data;
}

export async function listOrders(options?: { all?: boolean }): Promise<Order[]> {
    const search = options?.all ? "?all=true" : "";
    const res = await fetch(`${API_URL}/orders${search}`, {
        method: "GET",
        headers: getAuthHeaders(),
        cache: "no-store",
    });
    if (!res.ok) throw new Error("No se pudieron obtener las órdenes");
    const data = await res.json();
    const payload = data?.data ?? data;
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.orders)) return payload.orders;
    return [];
}

export async function getOrder(orderId: number): Promise<OrderDetail> {
    const res = await fetch(`${API_URL}/orders/${orderId}`, {
        method: "GET",
        headers: getAuthHeaders(),
        cache: "no-store",
    });
    if (!res.ok) throw new Error("No se pudo obtener la orden");
    const data = await res.json();
    const payload = data?.data ?? data;
    if (payload?.order) return payload.order;
    return payload;
}

export async function updateOrderStatus(orderId: number, status: string) {
    const res = await fetch(`${API_URL}/orders/${orderId}/status`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error("No se pudo actualizar el estado");
    const data = await res.json();
    return data?.data ?? data;
}
