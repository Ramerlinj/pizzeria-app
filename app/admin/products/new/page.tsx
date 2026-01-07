import { ProductForm } from "../_components/product-form";

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Crear Nuevo Producto</h3>
        <p className="text-sm text-muted-foreground">
          Añade un nuevo plato al menú.
        </p>
      </div>
      <ProductForm />
    </div>
  );
}
