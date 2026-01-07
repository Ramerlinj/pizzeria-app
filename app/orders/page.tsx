"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { getAuthHeaders } from "@/lib/auth-api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

type OrderItem = {
  product_id: number;
  name?: string;
  quantity: number;
  price?: number;
};

type Order = {
  id: number;
  status: string;
  total: number;
  created_at?: string;
  items?: OrderItem[];
};

const statusMap: Record<
  string,
  { label: string; step: number; note?: string }
> = {
  pending: { label: "Pendiente", step: 0 },
  paid: { label: "En proceso", step: 1 },
  preparing: { label: "En proceso", step: 1 },
  delivered: { label: "Completado", step: 2, note: "El delivery va en camino" },
  approved: { label: "En proceso", step: 1 },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/orders`, {
        headers: getAuthHeaders(),
        cache: "no-store",
      });
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      if (!res.ok) throw new Error("No se pudieron obtener las órdenes");
      const data = await res.json();
      const payload = data?.data ?? data;
      const list = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.orders)
        ? payload.orders
        : [];
      setOrders(list);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error cargando órdenes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-pizza-naranja uppercase tracking-wide">
            Órdenes
          </p>
          <h1 className="text-3xl font-heading font-bold text-pizza-texto">
            En proceso
          </h1>
          <p className="text-gray-600 text-sm">
            Órdenes pendientes, pagadas o en preparación.
          </p>
        </div>
        <Button onClick={fetchOrders} disabled={loading}>
          {loading ? "Actualizando..." : "Actualizar"}
        </Button>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm space-y-3 animate-pulse"
            >
              <div className="h-4 w-32 bg-gray-200 rounded" />
              <div className="h-3 w-20 bg-gray-200 rounded" />
              <div className="h-16 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      )}

      {!loading && orders.length === 0 && !error && (
        <p className="text-sm text-gray-500">No tienes órdenes en proceso.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {orders.map((order) => {
          const normalized = (order.status || "").toLowerCase();
          const statusInfo = statusMap[normalized];
          const progress = ((statusInfo?.step ?? 0) / 2) * 100;

          return (
            <div
              key={order.id}
              className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-pizza-texto">
                  Orden #{order.id}
                </p>
                <span className="rounded-full bg-pizza-naranja/10 text-pizza-naranja px-3 py-1 text-xs font-semibold uppercase">
                  {statusInfo?.label || order.status}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Pendiente</span>
                  <span>En proceso</span>
                  <span>Completado</span>
                </div>
                <div className="relative h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="absolute h-full bg-pizza-naranja transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <p className="text-sm text-gray-700">
                Total: $
                {order.total?.toFixed ? order.total.toFixed(2) : order.total}
              </p>

              {statusInfo?.note && (
                <p className="text-xs text-green-600 font-semibold">
                  {statusInfo.note}
                </p>
              )}

              {order.items && order.items.length > 0 && (
                <div className="text-xs text-gray-600 space-y-1 border-t border-dashed border-gray-200 pt-2">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span>
                        #{item.product_id} × {item.quantity}
                      </span>
                      {item.price && (
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}
