"use client";

import { useEffect, useState, use } from "react";
import { ProductForm } from "../_components/product-form";
import { getProduct, getProductIngredients } from "@/lib/admin-api";
import { MenuItem } from "@/data/menu";
import { toast } from "sonner";

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [product, setProduct] = useState<MenuItem | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const numericId = parseInt(id);
        const data = await getProduct(numericId);
        if (data) {
          const ingredientIds = await getProductIngredients(numericId);
          setProduct({ ...data, ingredients: ingredientIds });
        } else {
          toast.error("Producto no encontrado");
        }
      } catch (error) {
        toast.error("Error al cargar el producto");
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!product) {
    return <div>Producto no encontrado</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Editar Producto</h3>
        <p className="text-sm text-muted-foreground">
          Modifica los detalles del producto.
        </p>
      </div>
      <ProductForm initialData={product} />
    </div>
  );
}
