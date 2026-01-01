"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { NAVBAR } from "@/data/header";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import Image from "next/image";
import logo from "@/public/logos/logotipo.svg";

export default function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="md:hidden p-2 hover:bg-black/5 rounded-lg transition-colors"
        aria-label="Abrir menú"
      >
        <Menu className="size-6 text-pizza-texto" />
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-[300px] sm:w-[400px]">
          <SheetHeader>
            <SheetTitle className="flex items-center justify-between">
              <Link href="/" onClick={() => setOpen(false)}>
                <Image
                  src={logo}
                  width={150}
                  height={150}
                  alt="Logo Pizzería"
                  className="cursor-pointer"
                />
              </Link>
            </SheetTitle>
          </SheetHeader>

          <nav className="mt-8">
            <ul className="flex flex-col space-y-2">
              {NAVBAR.map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-lg font-medium text-pizza-texto hover:bg-pizza-rojo/10 hover:text-pizza-rojo rounded-lg transition-all duration-300"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="absolute bottom-8 left-0 right-0 px-6">
            <Link
              href="/shop"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-2 w-full bg-pizza-rojo text-white py-3 rounded-lg font-semibold hover:bg-pizza-rojo/90 transition-colors"
            >
              Compra Online
            </Link>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
