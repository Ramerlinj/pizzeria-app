"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Check } from "lucide-react";
import { useCart } from "./cart-context";
import { CheckoutSidebar } from "./CheckoutSidebar";
import { useAuth } from "@/components/providers/auth-provider";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const CartSheet = () => {
  const { items, step } = useCart();
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const count = items.reduce((acc, it) => acc + it.quantity, 0);

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen && !isAuthenticated && !loading) {
      router.push("/login");
      return;
    }
    setOpen(nextOpen);
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button
          className="flex items-center gap-2 bg-pizza-naranja hover:bg-pizza-naranja/90 text-white shadow-lg shadow-pizza-naranja/20"
          size="lg"
        >
          <ShoppingCart className="h-5 w-5" />
          <span>Carrito</span>
          {count > 0 && (
            <span className="ml-1 inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-white/20 px-2 text-sm font-semibold">
              {count}
            </span>
          )}
          {step === 3 && <Check className="h-4 w-4 text-white/80" />}
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className={`w-full ${
          step >= 2 ? "sm:max-w-4xl lg:max-w-5xl" : "sm:max-w-xl"
        } overflow-y-auto transition-all duration-500 ease-in-out`}
      >
        <SheetHeader className="text-left">
          <SheetTitle className="font-heading text-2xl text-pizza-texto">
            Tu pedido
          </SheetTitle>
          <p className="text-sm text-gray-500">
            Completa dirección, carrito y pago en el lateral.
          </p>
        </SheetHeader>
        <div className="mt-6 pb-10">
          <CheckoutSidebar />
        </div>
      </SheetContent>
    </Sheet>
  );
};
