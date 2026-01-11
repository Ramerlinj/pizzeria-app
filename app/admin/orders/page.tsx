"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  listOrders,
  getOrder,
  updateOrderStatus,
  Order,
  OrderDetail,
} from "@/lib/order-api";
import { toast } from "sonner";

const statusOptions = [
  { value: "pending", label: "Pendiente" },
  { value: "paid", label: "Pagada" },
  { value: "preparing", label: "En preparación" },
  { value: "delivered", label: "Entregada" },
  { value: "cancelled", label: "Cancelada" },
];

const statusStyle: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  paid: "bg-green-100 text-green-700",
  preparing: "bg-blue-100 text-blue-700",
  delivered: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-gray-200 text-gray-700",
  approved: "bg-green-100 text-green-700",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [detail, setDetail] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [updating, setUpdating] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await listOrders({ all: true });
      setOrders(data);
      if (data.length && !selectedId) {
        setSelectedId(data[0].id);
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || "No se pudieron cargar las órdenes");
    } finally {
      setLoading(false);
    }
  };

  const fetchDetail = async (id: number) => {
    setLoadingDetail(true);
    try {
      const data = await getOrder(id);
      setDetail(data);
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || "No se pudo cargar la orden");
    } finally {
      setLoadingDetail(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (selectedId) {
      fetchDetail(selectedId);
    }
  }, [selectedId]);

  const selectedStatus = useMemo(() => detail?.status || "", [detail]);

  const handleStatusChange = async (status: string) => {
    if (!detail?.id) return;
    setUpdating(true);
    try {
      await updateOrderStatus(detail.id, status);
      toast.success("Estado actualizado");
      setDetail((prev) => (prev ? { ...prev, status } : prev));
      setOrders((prev) =>
        prev.map((o) => (o.id === detail.id ? { ...o, status } : o))
      );
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || "No se pudo actualizar el estado");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-pizza-naranja uppercase tracking-wide">
            Admin
          </p>
          <h1 className="text-3xl font-heading font-bold text-pizza-texto">
            Órdenes
          </h1>
          <p className="text-gray-600 text-sm">Gestiona estados y pagos.</p>
        </div>
        <Button onClick={fetchOrders} disabled={loading}>
          {loading ? "Actualizando..." : "Refrescar"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-4 space-y-3">
          <h2 className="font-semibold text-pizza-texto">Listado</h2>
          <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-2">
            {loading && <p className="text-sm text-gray-500">Cargando...</p>}
            {!loading && orders.length === 0 && (
              <p className="text-sm text-gray-500">Sin órdenes.</p>
            )}
            {orders.map((order) => (
              <button
                key={order.id}
                className={`w-full rounded-xl border px-3 py-2 text-left hover:border-pizza-naranja transition-colors ${
                  selectedId === order.id
                    ? "border-pizza-naranja bg-pizza-naranja/5"
                    : "border-gray-200"
                }`}
                onClick={() => setSelectedId(order.id)}
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-pizza-texto">
                    Orden #{order.id}
                  </span>
                  <Badge
                    className={
                      statusStyle[order.status] || "bg-gray-100 text-gray-700"
                    }
                  >
                    {order.status}
                  </Badge>
                </div>
                <p className="text-xs text-gray-500">Total: ${order.total}</p>
              </button>
            ))}
          </div>
        </Card>

        <Card className="lg:col-span-2 p-5 space-y-4 min-h-[60vh]">
          {!detail && !loadingDetail && (
            <p className="text-sm text-gray-500">Selecciona una orden.</p>
          )}
          {loadingDetail && (
            <p className="text-sm text-gray-500">Cargando detalle...</p>
          )}
          {detail && !loadingDetail && (
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <p className="text-sm text-gray-500">Orden #{detail.id}</p>
                  <p className="text-2xl font-heading font-bold text-pizza-texto">
                    ${detail.total}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    className={
                      statusStyle[detail.status] || "bg-gray-100 text-gray-700"
                    }
                  >
                    {detail.status}
                  </Badge>
                  <Select
                    value={selectedStatus}
                    onValueChange={handleStatusChange}
                    disabled={updating}
                  >
                    <SelectTrigger className="w-44">
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {detail.address && (
                <div className="rounded-xl border border-gray-200 p-4 space-y-1 text-sm text-gray-700">
                  <p className="font-semibold text-pizza-texto">Dirección</p>
                  <p>{detail.address.address_line}</p>
                  <p className="text-gray-500">
                    city_id: {detail.address.city_id}
                  </p>
                  {detail.address.sector && (
                    <p>Sector: {detail.address.sector}</p>
                  )}
                  {detail.address.reference && (
                    <p>Referencia: {detail.address.reference}</p>
                  )}
                </div>
              )}

              {detail.items && detail.items.length > 0 && (
                <div className="rounded-xl border border-gray-200 p-4 space-y-2 text-sm text-gray-700">
                  <p className="font-semibold text-pizza-texto">Items</p>
                  {detail.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span>Producto #{it.product_id}</span>
                      <span>× {it.quantity ?? 1}</span>
                    </div>
                  ))}
                </div>
              )}

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-pizza-texto">Pagos</p>
                  <span className="text-xs text-gray-500">Solo lectura</span>
                </div>
                {detail.payments && detail.payments.length > 0 ? (
                  <div className="space-y-2">
                    {detail.payments.map((pay) => (
                      <div
                        key={pay.id}
                        className="rounded-xl border border-gray-200 p-3 text-sm flex items-center justify-between"
                      >
                        <div>
                          <p className="font-semibold text-pizza-texto">
                            {pay.method.toUpperCase()} · {pay.status}
                          </p>
                          <p className="text-gray-600 text-xs">
                            transaction_id: {pay.transaction_id || "-"}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-heading font-bold text-pizza-texto">
                            ${pay.amount}
                          </p>
                          {pay.created_at && (
                            <p className="text-xs text-gray-500">
                              {new Date(pay.created_at).toLocaleString()}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    Sin pagos registrados.
                  </p>
                )}
              </div>
            </div>
          )}
        </Card>
      </div>
    </main>
  );
}
