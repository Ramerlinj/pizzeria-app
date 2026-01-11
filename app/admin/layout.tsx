"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./_components/app-sidebar";
import { useAuth } from "@/components/providers/auth-provider";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (
      !loading &&
      (!isAuthenticated || !["admin", "superadmin"].includes(user?.role || ""))
    ) {
      router.push("/");
    }
  }, [isAuthenticated, loading, router, user?.role]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-huerto-texto">
        Verificando sesión...
      </div>
    );
  }

  if (!isAuthenticated || !["admin", "superadmin"].includes(user?.role || "")) {
    return null;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full bg-huerto-crema/30 min-h-screen">
        <div className="p-4 flex items-center gap-2 border-b border-huerto-verde/10 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
          <SidebarTrigger className="text-huerto-verde hover:bg-huerto-verde/10" />
          <h1 className="font-heading text-xl text-huerto-texto">
            Panel de Administración
          </h1>
        </div>
        <div className="p-6">{children}</div>
      </main>
    </SidebarProvider>
  );
}
