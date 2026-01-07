"use client";

import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import { MenuItem } from "@/data/menu";

export type PaymentMethod = "card" | "cash";
export type CheckoutStep = 0 | 1 | 2 | 3; // 0: items, 1: address, 2: payment, 3: summary

export interface PaymentDetails {
  cardHolder: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
  transactionId: string; // requerido por el endpoint cuando es tarjeta
}

export interface AddressForm {
  address_line: string;
  city_id: string;
  sector?: string;
  reference?: string;
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
  note?: string;
}

interface CartContextValue {
  items: CartItem[];
  address: AddressForm;
  paymentDetails: PaymentDetails;
  paymentMethod: PaymentMethod;
  step: CheckoutStep;
  subtotal: number;
  deliveryFee: number;
  total: number;
  addItem: (item: MenuItem) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  setAddress: (values: Partial<AddressForm>) => void;
  setPaymentDetails: (values: Partial<PaymentDetails>) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  setStep: (step: CheckoutStep) => void;
  resetCart: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const initialAddress: AddressForm = {
  address_line: "",
  city_id: "",
  sector: "",
  reference: "",
};

const initialPaymentDetails: PaymentDetails = {
  cardHolder: "",
  cardNumber: "",
  expiry: "",
  cvv: "",
  transactionId: "",
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [address, setAddressState] = useState<AddressForm>(initialAddress);
  const [paymentDetails, setPaymentDetailsState] = useState<PaymentDetails>(
    initialPaymentDetails
  );
  const [paymentMethod, setPaymentMethodState] =
    useState<PaymentMethod>("card");
  const [step, setStepState] = useState<CheckoutStep>(0);

  const addItem = (item: MenuItem) => {
    setItems((prev) => {
      const existing = prev.find((cart) => cart.item.id === item.id);
      if (existing) {
        return prev.map((cart) =>
          cart.item.id === item.id
            ? { ...cart, quantity: cart.quantity + 1 }
            : cart
        );
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((cart) => cart.item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) return removeItem(id);
    setItems((prev) =>
      prev.map((cart) => (cart.item.id === id ? { ...cart, quantity } : cart))
    );
  };

  const setAddress = (values: Partial<AddressForm>) => {
    setAddressState((prev) => ({ ...prev, ...values }));
  };

  const setPaymentDetails = (values: Partial<PaymentDetails>) => {
    setPaymentDetailsState((prev) => ({ ...prev, ...values }));
  };

  const setPaymentMethod = (method: PaymentMethod) => {
    setPaymentMethodState(method);
    if (method === "cash") {
      setPaymentDetailsState(initialPaymentDetails);
    }
  };

  const setStep = (next: CheckoutStep) => {
    setStepState(next);
  };

  const resetCart = () => {
    setItems([]);
    setAddressState(initialAddress);
    setPaymentDetailsState(initialPaymentDetails);
    setPaymentMethodState("card");
    setStepState(0);
  };

  const subtotal = useMemo(
    () => items.reduce((acc, cart) => acc + cart.item.price * cart.quantity, 0),
    [items]
  );

  const deliveryFee = items.length ? 2.5 : 0;
  const total = subtotal + deliveryFee;

  const value: CartContextValue = {
    items,
    address,
    paymentDetails,
    paymentMethod,
    step,
    subtotal,
    deliveryFee,
    total,
    addItem,
    removeItem,
    updateQuantity,
    setAddress,
    setPaymentDetails,
    setPaymentMethod,
    setStep,
    resetCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
};
