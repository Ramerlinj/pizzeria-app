"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MenuItem, Ingredient } from "@/data/menu";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createProduct, updateProduct, getIngredients } from "@/lib/admin-api";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  description: z.string().min(5, {
    message: "La descripción debe tener al menos 5 caracteres.",
  }),
  price: z.coerce.number().min(0, {
    message: "El precio debe ser mayor o igual a 0.",
  }),
  image_url: z.string().min(1, {
    message: "La URL de la imagen es requerida.",
  }),
  type_product: z.enum(["pizza", "drink", "dessert", "extra"]),
  is_recommended: z.boolean().default(false),
  badge: z.enum(["Nuevo", "Picante"]).optional().or(z.literal("")),
  ingredients: z.array(z.number()).optional(),
});

type FormSchema = typeof formSchema;
type FormValues = z.output<FormSchema>;
type FormInput = z.input<FormSchema>;

interface ProductFormProps {
  initialData?: MenuItem;
}

export function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

  useEffect(() => {
    const loadIngredients = async () => {
      try {
        const data = await getIngredients();
        setIngredients(data);
      } catch (error) {
        console.error("Error loading ingredients:", error);
        toast.error("No se pudieron cargar los ingredientes disponibles");
      }
    };
    loadIngredients();
  }, []);

  const form = useForm<FormInput, any, FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      price: initialData?.price || 0,
      image_url: initialData?.image_url || "/pizzas/pizza-home-1.webp",
      type_product: initialData?.type_product || "pizza",
      is_recommended: initialData?.is_recommended || false,
      badge: initialData?.badge || "",
      ingredients: initialData?.ingredients || [],
    },
  });

  const typeProduct = form.watch("type_product");

  async function onSubmit(values: FormValues) {
    setLoading(true);
    try {
      const formattedValues = {
        ...values,
        badge:
          values.badge === ""
            ? undefined
            : (values.badge as "Nuevo" | "Picante"),
      };

      if (initialData) {
        await updateProduct(initialData.id, formattedValues);
        toast.success("Producto actualizado correctamente");
      } else {
        await createProduct(formattedValues);
        toast.success("Producto creado correctamente");
      }
      router.push("/admin/products");
      router.refresh();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Hubo un error al guardar el producto");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-2xl bg-white p-6 rounded-lg border border-huerto-verde/20 shadow-sm"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-huerto-texto font-medium">
                Nombre
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Nombre del producto"
                  {...field}
                  className="border-huerto-verde/20 focus-visible:ring-huerto-verde"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-huerto-texto font-medium">
                Descripción
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descripción del producto"
                  {...field}
                  className="border-huerto-verde/20 focus-visible:ring-huerto-verde"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-huerto-texto font-medium">
                  Precio
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...field}
                    value={field.value === undefined || field.value === null ? "" : Number(field.value)}
                    onChange={(event) => {
                      const raw = event.target.value;
                      const numeric = raw === "" ? "" : Number(raw);
                      field.onChange(numeric);
                    }}
                    className="border-huerto-verde/20 focus-visible:ring-huerto-verde"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type_product"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-huerto-texto font-medium">
                  Tipo de Producto
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="border-huerto-verde/20 focus:ring-huerto-verde">
                      <SelectValue placeholder="Selecciona un tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="pizza">Pizza</SelectItem>
                    <SelectItem value="drink">Bebida</SelectItem>
                    <SelectItem value="dessert">Postre</SelectItem>
                    <SelectItem value="extra">Extra</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="image_url"
            render={({ field: { value, onChange, ...fieldProps } }) => (
              <FormItem>
                <FormLabel className="text-huerto-texto font-medium">
                  Imagen del Producto
                </FormLabel>
                <FormControl>
                  <Input
                    {...fieldProps}
                    type="file"
                    accept="image/*"
                    className="border-huerto-verde/20 focus-visible:ring-huerto-verde file:text-huerto-texto"
                    onChange={(event) => {
                      const file = event.target.files && event.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          onChange(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </FormControl>
                {value && (
                  <div className="mt-2 relative w-full h-40 rounded-md overflow-hidden border border-huerto-verde/20 bg-gray-50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={value}
                      alt="Preview"
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="badge"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-huerto-texto font-medium">
                  Etiqueta (Opcional)
                </FormLabel>
                <Select
                  onValueChange={(value) =>
                    field.onChange(value === "none" ? "" : value)
                  }
                  value={field.value || "none"}
                >
                  <FormControl>
                    <SelectTrigger className="border-huerto-verde/20 focus:ring-huerto-verde">
                      <SelectValue placeholder="Sin etiqueta" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">Sin etiqueta</SelectItem>
                    <SelectItem value="Nuevo">Nuevo</SelectItem>
                    <SelectItem value="Picante">Picante</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="is_recommended"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-huerto-verde/20 p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="border-huerto-verde/50 data-[state=checked]:bg-huerto-verde data-[state=checked]:text-white"
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-huerto-texto font-medium">
                  Recomendado
                </FormLabel>
                <FormDescription>
                  Este producto aparecerá en la sección de recomendados.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        {typeProduct === "pizza" && (
          <FormField
            control={form.control}
            name="ingredients"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-huerto-texto font-medium">
                    Ingredientes
                  </FormLabel>
                  <FormDescription>
                    Selecciona los ingredientes que lleva este producto.
                  </FormDescription>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border border-huerto-verde/20 rounded-md p-4">
                  {ingredients.map((ingredient) => (
                    <FormField
                      key={ingredient.id}
                      control={form.control}
                      name="ingredients"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={ingredient.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(ingredient.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([
                                        ...(field.value || []),
                                        ingredient.id,
                                      ])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== ingredient.id
                                        )
                                      );
                                }}
                                className="border-huerto-verde/50 data-[state=checked]:bg-huerto-verde data-[state=checked]:text-white"
                              />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer text-huerto-texto">
                              {ingredient.name}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="flex gap-4 pt-4">
          <Button
            type="submit"
            disabled={loading}
            className="bg-huerto-verde hover:bg-huerto-verde/90 text-white"
          >
            {loading ? "Guardando..." : initialData ? "Actualizar" : "Crear"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="border-huerto-verde/20 text-huerto-texto hover:bg-huerto-verde/10"
          >
            Cancelar
          </Button>
        </div>
      </form>
    </Form>
  );
}
