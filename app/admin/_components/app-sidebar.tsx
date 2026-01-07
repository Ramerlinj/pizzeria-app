"use client";

import { Pizza, Settings, LayoutDashboard, Carrot } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import logo from "@/public/logos/logotipo.svg";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Productos",
    url: "/admin/products",
    icon: Pizza,
  },
  {
    title: "Ingredientes",
    url: "/admin/ingredients",
    icon: Carrot,
  },
  {
    title: "Configuración",
    url: "/admin/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="border-r border-huerto-verde/20 bg-huerto-crema/50">
      <SidebarHeader className="h-20 flex items-center justify-center border-b border-huerto-verde/10 bg-white/50">
        <Link href="/admin">
          <Image
            src={logo}
            width={120}
            height={120}
            alt="Logo Pizzería"
            className="w-28"
          />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="pt-4">
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    className="data-[active=true]:bg-huerto-verde data-[active=true]:text-white hover:bg-huerto-verde/10 hover:text-huerto-verde transition-colors"
                  >
                    <Link href={item.url} className="font-medium">
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
