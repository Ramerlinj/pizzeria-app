"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MenuItem } from "@/data/menu";
import { useEffect, useMemo, useState } from "react";
import { MenuItemCard } from "./MenuItemCard";
import {
  getIngredients,
  getProductIngredients,
  getProducts,
} from "@/lib/admin-api";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import { useCart } from "./cart-context";

const categories = [
  { id: "pizza", label: "Pizzas" },
  { id: "drink", label: "Bebidas" },
  { id: "dessert", label: "Postres" },
  { id: "extra", label: "Extras" },
] as const;

export const MenuCategories = () => {
  const [products, setProducts] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [ingredientNames, setIngredientNames] = useState<string[]>([]);
  const { addItem } = useCart();

  const pizzaCount = useMemo(
    () => products.filter((p) => p.type_product === "pizza").length,
    [products]
  );

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error(error);
        toast.error("Error al cargar el menú");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const loadDetails = async (item: MenuItem) => {
    setSelectedItem(item);
    setIngredientNames([]);
    setDetailLoading(true);

    try {
      if (item.type_product !== "pizza") {
        setIngredientNames([]);
        return;
      }

      const hasInlineIngredients =
        Array.isArray(item.ingredients) && item.ingredients.length > 0;

      // Prefer names coming directly with el producto
      if (hasInlineIngredients) {
        const rawList = item.ingredients as unknown[];
        const names = rawList
          .map((ing) => {
            if (typeof ing === "string") return ing;
            if (typeof ing === "number") return null;
            if (ing && typeof ing === "object" && "name" in ing) {
              const nameValue = (ing as { name?: unknown }).name;
              return typeof nameValue === "string" ? nameValue : null;
            }
            return null;
          })
          .filter((n): n is string => Boolean(n));

        if (names.length > 0) {
          setIngredientNames(names);
          return;
        }
      }

      // Fallback: IDs -> map to names con catálogo de ingredientes
      const ids = await getProductIngredients(item.id);
      const ingredients = await getIngredients();
      const lookup = new Map(ingredients.map((ing) => [ing.id, ing.name]));
      const names = ids
        .map((id) => lookup.get(id) || `Ingrediente #${id}`)
        .filter(Boolean);
      setIngredientNames(names);
    } catch (error) {
      console.error(error);
      toast.error("No pudimos cargar los ingredientes");
    } finally {
      setDetailLoading(false);
    }
  };

  const closeDialog = () => {
    setSelectedItem(null);
    setIngredientNames([]);
  };

  const handleAddToCart = () => {
    if (!selectedItem) return;
    addItem(selectedItem);
    toast.success(`${selectedItem.name} añadida al carrito`);
    closeDialog();
  };

  if (loading) {
    return <div className="text-center py-20">Cargando menú...</div>;
  }

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <span className="text-pizza-naranja font-medium tracking-widest uppercase text-sm font-sans">
          Menú Exclusivo
        </span>
        <h2 className="text-4xl md:text-5xl font-bold text-pizza-texto mt-2 font-heading uppercase">
          Elige tu sabor
        </h2>
        <p className="text-gray-500 mt-3 text-sm uppercase tracking-[0.2em]">
          {pizzaCount} pizzas artesanales y más delicias
        </p>
      </div>

      <Tabs defaultValue="pizza" className="w-full flex flex-col items-center">
        <TabsList className="flex flex-wrap justify-center gap-2 bg-transparent mb-12 h-auto p-0">
          {categories.map((category) => (
            <TabsTrigger
              key={category.id}
              value={category.id}
              className="text-lg font-medium px-6 py-2 rounded-full data-[state=active]:bg-pizza-naranja data-[state=active]:text-white text-gray-600 hover:text-pizza-naranja transition-colors border border-transparent data-[state=active]:border-pizza-naranja font-heading uppercase tracking-wide"
            >
              {category.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent
            key={category.id}
            value={category.id}
            className="w-full max-w-5xl"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              {products
                .filter((item) => item.type_product === category.id)
                .map((item) => (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    onShowDetails={loadDetails}
                  />
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <Dialog
        open={Boolean(selectedItem)}
        onOpenChange={(open) => !open && closeDialog()}
      >
        <DialogContent className="max-w-5xl md:max-w-6xl p-0 overflow-hidden rounded-[32px] border border-white/60 bg-white/85 backdrop-blur-xl shadow-[0_25px_95px_-45px_rgba(0,0,0,0.55)]">
          {selectedItem && (
            <div className="grid md:grid-cols-2">
              <div className="relative h-[360px] md:h-[520px] lg:h-[580px]">
                <Image
                  src={selectedItem.image_url}
                  alt={selectedItem.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/65 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6 flex items-center gap-3 text-white drop-shadow-2xl">
                  <span className="text-4xl md:text-5xl font-heading font-bold">
                    ${selectedItem.price.toFixed(2)}
                  </span>
                  {selectedItem.badge && (
                    <Badge
                      variant="secondary"
                      className="bg-white/90 text-pizza-texto text-xs px-3 py-1 rounded-full"
                    >
                      {selectedItem.badge}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="p-8 md:p-10 space-y-6">
                <DialogHeader>
                  <DialogTitle className="text-3xl md:text-4xl font-heading uppercase tracking-tight text-pizza-texto">
                    {selectedItem.name}
                  </DialogTitle>
                  <p className="text-gray-600 leading-relaxed">
                    {selectedItem.description}
                  </p>
                </DialogHeader>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm uppercase tracking-[0.2em] text-pizza-texto/80 font-semibold">
                      Ingredientes
                    </span>
                    <Badge
                      variant="outline"
                      className="rounded-full px-3 text-xs bg-white/80 text-pizza-texto border-pizza-naranja/30 shadow-sm"
                    >
                      {detailLoading
                        ? "Cargando..."
                        : `${ingredientNames.length} ingredientes`}
                    </Badge>
                  </div>
                  <ScrollArea className="h-40 pr-2">
                    {detailLoading && (
                      <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Cargando ingredientes
                      </div>
                    )}
                    {!detailLoading && ingredientNames.length === 0 && (
                      <p className="text-sm text-gray-500">
                        Aún no tenemos ingredientes listados para esta pizza.
                      </p>
                    )}
                    {!detailLoading && ingredientNames.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {ingredientNames.map((name) => (
                          <span
                            key={name}
                            className="px-3 py-1 rounded-full bg-pizza-naranja/12 text-pizza-texto text-sm border border-pizza-naranja/30 shadow-sm"
                          >
                            {name}
                          </span>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </div>

                {selectedItem.is_recommended && (
                  <div className="rounded-2xl border border-pizza-naranja/25 bg-white/85 p-4 text-sm text-pizza-texto shadow-sm">
                    Recomendación del chef: esta pizza es favorita de nuestros
                    clientes.
                  </div>
                )}

                <div className="flex items-center justify-between pt-4">
                  <div className="text-2xl font-heading text-pizza-naranja font-bold">
                    ${selectedItem.price.toFixed(2)}
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={closeDialog}
                      className="rounded-full"
                    >
                      Cerrar
                    </Button>
                    <Button
                      className="bg-pizza-naranja text-white rounded-full hover:bg-pizza-naranja/90"
                      onClick={handleAddToCart}
                    >
                      Añadir al carrito
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};
