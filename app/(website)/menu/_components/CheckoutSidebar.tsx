"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  Check,
  CreditCard,
  Home,
  ListOrdered,
  ShoppingCart,
  Wallet,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";
import { useCart, CheckoutStep } from "./cart-context";
import { listCities, City } from "@/lib/city-api";
import { useAuth } from "@/components/providers/auth-provider";
import { useRouter } from "next/navigation";
import { listAddresses, Address } from "@/lib/address-api";
import { createOrder, createPayment } from "@/lib/order-api";

const steps = [
  {
    id: 0,
    title: "Productos",
    icon: ShoppingCart,
    description: "Revisa tu carrito",
  },
  { id: 1, title: "Dirección", icon: Home, description: "Datos de entrega" },
  { id: 2, title: "Pago", icon: Wallet, description: "Selecciona el método" },
  { id: 3, title: "Resumen", icon: ListOrdered, description: "Factura previa" },
] as const;

export const CheckoutSidebar = () => {
  const {
    items,
    address,
    paymentDetails,
    paymentMethod,
    step,
    subtotal,
    deliveryFee,
    total,
    setAddress,
    setPaymentDetails,
    setPaymentMethod,
    setStep,
    updateQuantity,
    removeItem,
    resetCart,
  } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const [cities, setCities] = useState<City[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [citiesError, setCitiesError] = useState<string | null>(null);
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [addressesError, setAddressesError] = useState<string | null>(null);
  const [processingOrder, setProcessingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [lastOrderId, setLastOrderId] = useState<number | null>(null);

  const fetchCities = useCallback(async () => {
    setLoadingCities(true);
    setCitiesError(null);
    try {
      const data = await listCities();
      setCities(data);
    } catch (error) {
      console.error(error);
      setCitiesError("No se pudieron cargar las ciudades");
      toast.error("No se pudieron cargar las ciudades");
    } finally {
      setLoadingCities(false);
    }
  }, []);

  useEffect(() => {
    fetchCities();
  }, [fetchCities]);

  useEffect(() => {
    const fetchAddresses = async () => {
      if (!isAuthenticated) {
        setSavedAddresses([]);
        return;
      }
      setLoadingAddresses(true);
      setAddressesError(null);
      try {
        const data = await listAddresses();
        setSavedAddresses(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
        setAddressesError("No se pudieron cargar tus direcciones");
        toast.error("No se pudieron cargar tus direcciones");
      } finally {
        setLoadingAddresses(false);
      }
    };
    fetchAddresses();
  }, [isAuthenticated]);

  const canContinue = useMemo(() => {
    if (step === 0) return items.length > 0;
    if (step === 1)
      return !!address.address_line && !!address.city_id && !citiesError;
    if (step === 2 && paymentMethod === "card") {
      return (
        !!paymentDetails.cardHolder &&
        !!paymentDetails.cardNumber &&
        !!paymentDetails.expiry &&
        !!paymentDetails.cvv
      );
    }
    return true;
  }, [
    address.address_line,
    address.city_id,
    citiesError,
    items.length,
    paymentDetails.cardHolder,
    paymentDetails.cardNumber,
    paymentDetails.cvv,
    paymentDetails.expiry,
    paymentMethod,
    step,
  ]);

  const clampStep = (candidate: number): CheckoutStep => {
    if (candidate < 0) return 0;
    if (candidate > 3) return 3;
    return candidate as CheckoutStep;
  };

  const nextStep = () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    setStep(clampStep(step + 1));
  };
  const prevStep = () => setStep(clampStep(step - 1));

  const processPurchase = async () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    if (!canContinue) return;
    setProcessingOrder(true);
    try {
      const txId =
        paymentMethod === "card"
          ? paymentDetails.transactionId ||
            `TX-${Date.now()}-${Math.floor(Math.random() * 1000)}`
          : null;
      if (paymentMethod === "card" && !paymentDetails.transactionId) {
        setPaymentDetails({ transactionId: txId || "" });
      }

      const orderPayload = {
        address: {
          address_line: address.address_line,
          city_id: Number(address.city_id),
          sector: address.sector || undefined,
          reference: address.reference || undefined,
        },
        items: items.map((cart) => ({
          product_id: cart.item.id,
          quantity: cart.quantity,
        })),
      };

      const order = await createOrder(orderPayload);
      const orderId = Number(order?.id);
      if (!Number.isFinite(orderId)) {
        throw new Error("La orden no devolvió un id válido");
      }
      const paymentStatus = paymentMethod === "card" ? "approved" : "paid";
      const paymentAmount = Number(order?.total ?? total);
      if (!Number.isFinite(paymentAmount)) {
        throw new Error("El monto de la orden no es válido");
      }
      await createPayment(orderId, {
        amount: paymentAmount,
        method: paymentMethod,
        status: paymentStatus,
        transaction_id: txId,
      });

      setLastOrderId(orderId);
      setOrderSuccess(true);
      toast.success("Compra procesada con éxito");
      resetCart();
      setStep(0);
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || "No se pudo procesar la compra");
    } finally {
      setProcessingOrder(false);
    }
  };

  const handlePrimaryAction = () => {
    if (step === 3) {
      processPurchase();
    } else {
      nextStep();
    }
  };

  const safeCities = Array.isArray(cities) ? cities : [];
  const fallbackCities: City[] = [
    { id: 1, name: "Santo Domingo" },
    { id: 2, name: "Santiago" },
    { id: 3, name: "La Vega" },
  ];

  const cityOptions = safeCities.length ? safeCities : fallbackCities;
  const showSelect = cityOptions.length > 0;

  const handleUseSavedAddress = (addr: Address) => {
    setAddress({
      address_line: addr.address_line,
      city_id: String(addr.city_id),
      sector: addr.sector || "",
      reference: addr.reference || "",
    });
    toast.success("Dirección cargada");
  };

  const isWide = step >= 2;

  return (
    <aside
      className={`lg:sticky lg:top-20 bg-white/95 backdrop-blur-xl border border-gray-100 shadow-2xl rounded-3xl p-7 space-y-6 min-w-[360px] transition-all duration-500 ease-in-out ${
        isWide ? "w-full max-w-5xl" : "w-full max-w-xl"
      }`}
    >
      <header className="space-y-1">
        <p className="text-sm font-semibold text-pizza-naranja uppercase tracking-wide">
          Checkout
        </p>
        <h3 className="text-2xl font-heading font-bold text-pizza-texto">
          Pide en 4 pasos
        </h3>
        <p className="text-gray-500 text-sm">
          Completa tu dirección, revisa tu carrito, elige pago y confirma.
        </p>
      </header>

      <div className="flex items-center gap-2 text-sm text-gray-500">
        {steps.map((s, idx) => (
          <div key={s.id} className="flex items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs font-bold transition-colors ${
                step === s.id
                  ? "border-pizza-naranja bg-pizza-naranja text-white"
                  : step > s.id
                  ? "border-pizza-naranja/40 bg-pizza-naranja/10 text-pizza-naranja"
                  : "border-gray-200 bg-gray-50 text-gray-400"
              }`}
            >
              {step > s.id ? <Check className="h-4 w-4" /> : s.id + 1}
            </div>
            {idx < steps.length - 1 && <div className="h-px w-6 bg-gray-200" />}
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-4 space-y-4">
        <div className="flex items-center gap-3">
          {(() => {
            const Icon = steps.find((s) => s.id === step)?.icon || Home;
            return <Icon className="h-5 w-5 text-pizza-naranja" />;
          })()}
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Paso {step + 1} de 4
            </p>
            <p className="text-lg font-heading font-semibold text-pizza-texto">
              {steps[step].title}
            </p>
          </div>
        </div>

        {step === 0 && (
          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {items.length === 0 && (
              <p className="text-sm text-gray-500">
                Aún no has agregado productos.
              </p>
            )}
            {items.map((cart) => (
              <div
                key={cart.item.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 p-3"
              >
                <div>
                  <p className="text-sm font-semibold text-pizza-texto">
                    {cart.item.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    ${cart.item.price.toFixed(2)} c/u
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={() =>
                      updateQuantity(cart.item.id, cart.quantity - 1)
                    }
                  >
                    -
                  </Button>
                  <span className="w-6 text-center text-sm font-semibold">
                    {cart.quantity}
                  </span>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={() =>
                      updateQuantity(cart.item.id, cart.quantity + 1)
                    }
                  >
                    +
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-red-500"
                    onClick={() => removeItem(cart.item.id)}
                  >
                    ✕
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {step === 1 && (
          <div className="space-y-3">
            {loadingAddresses && (
              <p className="text-xs text-gray-500">
                Cargando tus direcciones...
              </p>
            )}
            {!loadingAddresses && savedAddresses.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-600">
                  Direcciones guardadas
                </p>
                <div className="space-y-2">
                  {savedAddresses.map((addr) => (
                    <Button
                      key={addr.id}
                      variant="outline"
                      className="w-full justify-between text-left"
                      onClick={() => handleUseSavedAddress(addr)}
                    >
                      <div className="flex flex-col text-sm">
                        <span className="font-semibold text-pizza-texto">
                          {addr.address_line}
                        </span>
                        <span className="text-gray-500 text-xs">
                          city_id: {addr.city_id}
                        </span>
                        {addr.sector && (
                          <span className="text-gray-500 text-xs">
                            Sector: {addr.sector}
                          </span>
                        )}
                      </div>
                      <Check className="h-4 w-4 text-pizza-naranja" />
                    </Button>
                  ))}
                </div>
              </div>
            )}
            {addressesError && (
              <p className="text-xs text-red-500">
                {addressesError}. Reintenta más tarde.
              </p>
            )}
            <Input
              placeholder="Dirección (calle y número)"
              value={address.address_line}
              onChange={(e) => setAddress({ address_line: e.target.value })}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {showSelect ? (
                <Select
                  value={address.city_id}
                  onValueChange={(val) => setAddress({ city_id: val })}
                  disabled={loadingCities}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue
                      placeholder={
                        loadingCities
                          ? "Cargando ciudades..."
                          : citiesError
                          ? "Usando lista base"
                          : "Selecciona ciudad"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {cityOptions.map((city) => (
                      <SelectItem key={city.id} value={String(city.id)}>
                        {city.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  placeholder="Ingresa ciudad o ID"
                  value={address.city_id}
                  onChange={(e) => setAddress({ city_id: e.target.value })}
                />
              )}
              <Input
                placeholder="Sector (opcional)"
                value={address.sector || ""}
                onChange={(e) => setAddress({ sector: e.target.value })}
              />
            </div>
            {citiesError && (
              <div className="flex flex-col gap-2 text-xs text-red-500">
                <p>{citiesError}. Intenta nuevamente o usa la lista base.</p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={fetchCities}
                  disabled={loadingCities}
                >
                  Reintentar cargar ciudades
                </Button>
              </div>
            )}
            <Textarea
              placeholder="Referencia para el repartidor (opcional)"
              value={address.reference || ""}
              onChange={(e) => setAddress({ reference: e.target.value })}
              rows={3}
            />
            <p className="text-xs text-gray-500">
              Campos obligatorios: dirección y ciudad (usaremos el{" "}
              <strong>city_id</strong> de tu tabla <strong>cities</strong>).
            </p>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant={paymentMethod === "card" ? "default" : "outline"}
                className={`h-12 justify-start ${
                  paymentMethod === "card"
                    ? "bg-pizza-naranja hover:bg-pizza-naranja/90 text-white"
                    : ""
                }`}
                onClick={() => setPaymentMethod("card")}
              >
                <CreditCard className="mr-2 h-4 w-4" /> Tarjeta
              </Button>
              <Button
                variant={paymentMethod === "cash" ? "default" : "outline"}
                className={`h-12 justify-start ${
                  paymentMethod === "cash"
                    ? "bg-pizza-naranja hover:bg-pizza-naranja/90 text-white"
                    : ""
                }`}
                onClick={() => setPaymentMethod("cash")}
              >
                <Wallet className="mr-2 h-4 w-4" /> Efectivo
              </Button>
            </div>
            {paymentMethod === "card" && (
              <div className="space-y-3 rounded-xl border border-gray-100 bg-gray-50 p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input
                    placeholder="Titular de la tarjeta"
                    value={paymentDetails.cardHolder}
                    onChange={(e) =>
                      setPaymentDetails({ cardHolder: e.target.value })
                    }
                  />
                  <Input
                    placeholder="Número de tarjeta"
                    value={paymentDetails.cardNumber}
                    onChange={(e) =>
                      setPaymentDetails({ cardNumber: e.target.value })
                    }
                  />
                  <Input
                    placeholder="MM/AA"
                    value={paymentDetails.expiry}
                    onChange={(e) =>
                      setPaymentDetails({ expiry: e.target.value })
                    }
                  />
                  <Input
                    placeholder="CVV"
                    value={paymentDetails.cvv}
                    onChange={(e) => setPaymentDetails({ cvv: e.target.value })}
                  />
                  <Input
                    placeholder="transaction_id (requerido)"
                    value={paymentDetails.transactionId}
                    onChange={(e) =>
                      setPaymentDetails({ transactionId: e.target.value })
                    }
                  />
                </div>
                <p className="text-xs text-gray-600">
                  El endpoint exige <strong>transaction_id</strong> para pagos
                  con tarjeta; si no lo completas generaremos uno
                  automáticamente al procesar.
                </p>
              </div>
            )}
            {paymentMethod === "cash" && (
              <p className="text-xs text-gray-500">
                Para efectivo, el API permite estados pending/paid;
                transaction_id debe ir vacío.
              </p>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-3 text-sm text-gray-700">
            <div className="rounded-xl bg-gray-50 p-3 border border-gray-100">
              <p className="font-semibold text-pizza-texto">Dirección</p>
              <p>{address.address_line}</p>
              <p className="text-gray-500">city_id: {address.city_id}</p>
              {address.sector && <p>Sector: {address.sector}</p>}
              {address.reference && <p>Referencia: {address.reference}</p>}
            </div>
            <div className="rounded-xl bg-gray-50 p-3 border border-gray-100">
              <p className="font-semibold text-pizza-texto">Pago</p>
              <p className="uppercase text-xs font-bold text-pizza-naranja">
                {paymentMethod === "card" ? "Tarjeta" : "Efectivo"}
              </p>
              {paymentMethod === "card" && (
                <div className="mt-1 text-xs text-gray-600 space-y-1">
                  <p>Titular: {paymentDetails.cardHolder || "-"}</p>
                  <p>
                    Tarjeta:{" "}
                    {paymentDetails.cardNumber
                      ? `•••• ${paymentDetails.cardNumber.slice(-4)}`
                      : "-"}
                  </p>
                  <p>transaction_id: {paymentDetails.transactionId || "-"}</p>
                </div>
              )}
            </div>
            <div className="rounded-xl bg-gray-50 p-3 border border-gray-100">
              <p className="font-semibold text-pizza-texto mb-2">Detalle</p>
              {items.map((cart) => (
                <div
                  key={cart.item.id}
                  className="flex justify-between text-sm"
                >
                  <span>
                    {cart.item.name} × {cart.quantity}
                  </span>
                  <span>${(cart.item.price * cart.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="mt-2 border-t border-dashed border-gray-200 pt-2 space-y-1">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Envío</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-heading font-bold text-pizza-texto">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Subtotal</span>
          <span className="font-semibold text-pizza-texto">
            ${subtotal.toFixed(2)}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Envío</span>
          <span className="font-semibold text-pizza-texto">
            ${deliveryFee.toFixed(2)}
          </span>
        </div>
        <div className="flex items-center justify-between text-lg font-heading font-bold text-pizza-texto">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <Button
          variant="ghost"
          onClick={prevStep}
          disabled={step === 0}
          className="w-1/2"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Anterior
        </Button>
        <Button
          className="w-1/2 bg-pizza-naranja hover:bg-pizza-naranja/90 text-white"
          disabled={!canContinue || processingOrder}
          onClick={handlePrimaryAction}
        >
          {processingOrder
            ? "Procesando..."
            : step === 3
            ? isAuthenticated
              ? "Procesar compra"
              : "Inicia sesión"
            : "Siguiente"}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {step === 3 && (
        <p className="text-xs text-gray-500 text-center">
          {isAuthenticated
            ? "Crearemos la orden y registraremos el pago con tus datos."
            : "Para finalizar, inicia sesión; te redirigiremos si avanzas."}
        </p>
      )}

      {orderSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6">
          <div className="w-full max-w-xl rounded-3xl bg-white p-10 text-center shadow-2xl border border-pizza-naranja/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-pizza-naranja/10 via-transparent to-pizza-naranja/5 pointer-events-none" />
            <div className="relative">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600 shadow-inner">
                <CheckCircle className="h-12 w-12" />
              </div>
              <h3 className="text-3xl font-heading font-bold text-pizza-texto">
                ¡Orden creada!
              </h3>
              <p className="mt-3 text-sm text-gray-600">
                Tu pedido se registró y el pago quedó confirmado. Puedes seguir
                navegando o ver el estado en órdenes.
              </p>
              {lastOrderId && (
                <p className="mt-2 text-sm font-semibold text-pizza-naranja">
                  Orden #{lastOrderId}
                </p>
              )}
              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={() => setOrderSuccess(false)}
                  className="bg-pizza-naranja hover:bg-pizza-naranja/90 text-white"
                >
                  Seguir comprando
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setOrderSuccess(false);
                    router.push("/orders");
                  }}
                >
                  Ver órdenes
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
