import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { menuItems } from "@/data/menu";
import { Pizza, ShoppingBag, Star, Flame, ListChecks } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const totalProducts = menuItems.length;
  const pizzas = menuItems.filter((p) => p.type_product === "pizza").length;
  const drinks = menuItems.filter((p) => p.type_product === "drink").length;
  const extras = menuItems.filter(
    (p) => p.type_product === "extra" || p.type_product === "dessert"
  ).length;
  const featured = menuItems.filter((p) => p.is_recommended).length;
  const spicy = menuItems.filter((p) => p.badge === "Picante").length;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-huerto-verde/20 bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-huerto-texto">
              Total productos
            </CardTitle>
            <Pizza className="h-4 w-4 text-huerto-verde" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-huerto-texto">
              {totalProducts}
            </div>
            <CardDescription>Menú cargado actualmente</CardDescription>
          </CardContent>
        </Card>

        <Card className="border-huerto-verde/20 bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-huerto-texto">
              Pizzas
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-huerto-verde" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-huerto-texto">{pizzas}</div>
            <CardDescription>
              Bebidas: {drinks} · Extras/Postres: {extras}
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="border-huerto-verde/20 bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-huerto-texto">
              Recomendados
            </CardTitle>
            <Star className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-huerto-texto">
              {featured}
            </div>
            <CardDescription>Marcados como destacados</CardDescription>
          </CardContent>
        </Card>

        <Card className="border-huerto-verde/20 bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-huerto-texto">
              Picantes
            </CardTitle>
            <Flame className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-huerto-texto">{spicy}</div>
            <CardDescription>Con badge “Picante”</CardDescription>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border-huerto-verde/20 bg-white shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-huerto-texto">
              Acciones rápidas
            </CardTitle>
            <CardDescription>Atajos frecuentes del panel</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            <Link href="/admin/products/new">
              <Button className="w-full justify-between bg-huerto-verde text-white hover:bg-huerto-verde/90">
                Crear producto
                <ShoppingBag className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/admin/orders">
              <Button
                variant="outline"
                className="w-full justify-between border-huerto-verde/40"
              >
                Ver órdenes
                <ListChecks className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/admin/users">
              <Button
                variant="outline"
                className="w-full justify-between border-huerto-verde/40"
              >
                Gestionar usuarios
                <Star className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/admin/settings">
              <Button variant="ghost" className="w-full justify-between">
                Configuración
                <Pizza className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-huerto-verde/20 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-huerto-texto">
              Checklist de revisión
            </CardTitle>
            <CardDescription>Para mantener el menú al día</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-gray-700">
            <div className="flex items-start gap-2">
              <ListChecks className="h-4 w-4 text-huerto-verde mt-1" />
              <span>Verifica precios y badges de recomendados.</span>
            </div>
            <div className="flex items-start gap-2">
              <ListChecks className="h-4 w-4 text-huerto-verde mt-1" />
              <span>
                Confirma que las órdenes archivadas estén conciliadas.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <ListChecks className="h-4 w-4 text-huerto-verde mt-1" />
              <span>Revisa usuarios con rol admin/superadmin.</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
