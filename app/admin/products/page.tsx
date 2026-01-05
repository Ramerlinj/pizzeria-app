"use client";

import { useEffect, useState } from "react";
import { MenuItem } from "@/data/menu";
import { deleteProduct, getProducts } from "@/lib/admin-api";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function ProductsPage() {
  const [products, setProducts] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      toast.error("Error al cargar los productos");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("¿Estás seguro de que quieres eliminar este producto?")) {
      try {
        await deleteProduct(id);
        toast.success("Producto eliminado correctamente");
        loadProducts();
      } catch (error) {
        toast.error("Error al eliminar el producto");
      }
    }
  };

  if (loading) {
    return <div className="p-4">Cargando productos...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight text-huerto-texto font-heading">
          Productos
        </h2>
        <Button
          asChild
          className="bg-huerto-verde hover:bg-huerto-verde/90 text-white"
        >
          <Link href="/admin/products/new">
            <Plus className="mr-2 h-4 w-4" /> Nuevo Producto
          </Link>
        </Button>
      </div>

      <div className="border border-huerto-verde/20 rounded-md bg-white shadow-sm">
        <Table>
          <TableHeader className="bg-huerto-crema/30">
            <TableRow className="hover:bg-transparent border-huerto-verde/10">
              <TableHead className="text-huerto-texto font-semibold">
                ID
              </TableHead>
              <TableHead className="text-huerto-texto font-semibold">
                Nombre
              </TableHead>
              <TableHead className="text-huerto-texto font-semibold">
                Tipo de Producto
              </TableHead>
              <TableHead className="text-huerto-texto font-semibold">
                Recomendado
              </TableHead>
              <TableHead className="text-huerto-texto font-semibold">
                Precio
              </TableHead>
              <TableHead className="text-right text-huerto-texto font-semibold">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow
                key={product.id}
                className="hover:bg-huerto-crema/10 border-huerto-verde/10"
              >
                <TableCell className="font-medium text-huerto-texto/80">
                  {product.id}
                </TableCell>
                <TableCell className="font-medium text-huerto-texto">
                  {product.name}
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-full border border-huerto-verde/20 bg-huerto-verde/10 px-2.5 py-0.5 text-xs font-semibold text-huerto-verde transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                    {product.type_product}
                  </span>
                </TableCell>
                <TableCell>
                  {product.is_recommended ? (
                    <span className="inline-flex items-center rounded-full border border-yellow-500/20 bg-yellow-500/10 px-2.5 py-0.5 text-xs font-semibold text-yellow-600">
                      Sí
                    </span>
                  ) : (
                    <span className="text-muted-foreground text-xs">No</span>
                  )}
                </TableCell>
                <TableCell className="text-huerto-texto font-medium">
                  ${product.price.toFixed(2)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      asChild
                      className="hover:bg-huerto-verde/10 hover:text-huerto-verde text-huerto-texto/70"
                    >
                      <Link href={`/admin/products/${product.id}`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleDelete(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {products.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">
                  No hay productos encontrados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
