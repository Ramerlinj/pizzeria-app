"use client";

import HeaderItems from "./HeaderItems";
import MobileMenu from "./MobileMenu";
import Image from "next/image";
import logo from "@/public/logos/logotipo.svg";
import { Button } from "@/components/ui/button";
import { useScrolled } from "@/hooks/useScrolled";
import Link from "next/link";
import { LogOut, User as UserIcon } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const scrolled = useScrolled(10);
  const { user, logoutUser } = useAuth();

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

          <div className="hidden md:block">
            <HeaderItems />
          </div>

          <div className="md:mr-20 flex items-center justify-end">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant={"outline"}
                    size={"sm"}
                    className="bg-black/4 p-3 md:p-5 border-none font-heading rounded-3xl cursor-pointer hover:bg-huerto-texto/10 hover:text-huerto-texto text-pizza-texto transition-all duration-300"
                  >
                    <span className="text-lg px-2 hover:text-huerto-texto/90">
                      {user.name || "Usuario"}
                    </span>
                    <UserIcon className="size-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer">
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Perfil</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={logoutUser}
                    className="cursor-pointer text-red-600 focus:text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Cerrar sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button
                  variant={"outline"}
                  size={"sm"}
                  className="bg-black/4 p-3 md:p-5 border-none font-heading rounded-3xl cursor-pointer hover:bg-huerto-texto/10 hover:text-huerto-texto text-pizza-texto transition-all duration-300"
                >
                  <span className="hidden md:inline text-lg px-2 hover:text-huerto-texto/90">
                    Inicia sesión
                  </span>
                  <UserIcon className="size-5" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
