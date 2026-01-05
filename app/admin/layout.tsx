import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./_components/app-sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
