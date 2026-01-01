"use client";

import HeaderItems from "./HeaderItems";
import MobileMenu from "./MobileMenu";
import Image from "next/image";
import logo from "@/public/logos/logotipo.svg";
import { Button } from "@/components/ui/button";
import { useScrolled } from "@/hooks/useScrolled";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export default function Header() {
  const scrolled = useScrolled(10);

  return (
    <header
      className={`border-b border-transparent ${
        scrolled
          ? "bg-white/5 backdrop-blur-md border-b border-white/5 shadow-sm"
          : "bg-transparent"
      } fixed top-0 w-full h-20 flex items-center justify-center z-50 transition-all duration-300`}
    >
      <div className="container px-4 md:px-6">
        <div className="flex justify-between items-center">
          <div className="md:hidden">
            <MobileMenu />
          </div>

          {/* Logo */}
          <div className="md:ml-20">
            <Link href="/">
              <Image
                src={logo}
                width={150}
                height={150}
                alt="Logo de la pizzería"
                className="cursor-pointer hover:scale-105 transition-all duration-300 w-32 md:w-[150px]"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <HeaderItems />
          </div>

          {/* Shop Button */}
          <div className="md:mr-20 flex items-center justify-end">
            <Button
              variant={"outline"}
              size={"sm"}
              className="bg-black/4 p-3 md:p-5 border-none font-heading rounded-3xl cursor-pointer hover:bg-huerto-texto/10 hover:text-huerto-texto text-pizza-texto transition-all duration-300"
            >
              <span className="hidden md:inline text-lg px-2 hover:text-huerto-texto/90">Compra Online</span>
              <ShoppingBag className="size-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
