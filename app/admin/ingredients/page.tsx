"use client";

import { useEffect, useState } from "react";
import { Ingredient } from "@/data/menu";
import {
  createIngredient,
  deleteIngredient,
  getIngredients,
  updateIngredient,
} from "@/lib/admin-api";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Edit, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function IngredientsPage() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(
    null
  );
  const [formData, setFormData] = useState<{
    name: string;
    price: number | "";
    available: boolean;
    type: "base" | "salsa" | "queso" | "extra";
  }>({ name: "", price: "", available: true, type: "extra" });

  useEffect(() => {
    loadIngredients();
  }, []);

  const loadIngredients = async () => {
    try {
      const data = await getIngredients();
      setIngredients(data);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : null;
      toast.error(message || "Error al cargar los ingredientes");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const priceValue =
        typeof formData.price === "string"
          ? parseFloat(formData.price)
          : formData.price;

      if (!Number.isFinite(priceValue)) {
        toast.error("Ingresa un precio válido");
        return;
      }

      const payload = { ...formData, price: priceValue };

      if (editingIngredient) {
        await updateIngredient(editingIngredient.id, payload);
        toast.success("Ingrediente actualizado");
      } else {
        await createIngredient(payload);
        toast.success("Ingrediente creado");
      }
      setIsDialogOpen(false);
      setFormData({ name: "", price: "", available: true, type: "extra" });
      setEditingIngredient(null);
      loadIngredients();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : null;
      toast.error(message || "Error al guardar el ingrediente");
    }
  };

  const handleEdit = (ingredient: Ingredient) => {
    setEditingIngredient(ingredient);
    setFormData({
      name: ingredient.name,
      price: ingredient.price,
      available: ingredient.available,
      type: ingredient.type,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("¿Estás seguro de que quieres eliminar este ingrediente?")) {
      try {
        await deleteIngredient(id);
        toast.success("Ingrediente eliminado");
        loadIngredients();
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : null;
        toast.error(message || "Error al eliminar el ingrediente");
      }
    }
  };

  const openNewDialog = () => {
    setEditingIngredient(null);
    setFormData({ name: "", price: "", available: true, type: "extra" });
    setIsDialogOpen(true);
  };

  if (loading) {
    return <div className="p-4">Cargando ingredientes...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight text-huerto-texto font-heading">
          Ingredientes
        </h2>
        <Button
          onClick={openNewDialog}
          className="bg-huerto-verde hover:bg-huerto-verde/90 text-white"
        >
          <Plus className="mr-2 h-4 w-4" /> Nuevo Ingrediente
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
                Tipo
              </TableHead>
              <TableHead className="text-huerto-texto font-semibold">
                Precio
              </TableHead>
              <TableHead className="text-huerto-texto font-semibold">
                Disponible
              </TableHead>
              <TableHead className="text-right text-huerto-texto font-semibold">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ingredients.map((ingredient) => (
              <TableRow
                key={ingredient.id}
                className="hover:bg-huerto-crema/10 border-huerto-verde/10"
              >
                <TableCell className="font-medium text-huerto-texto/80">
                  {ingredient.id}
                </TableCell>
                <TableCell className="font-medium text-huerto-texto">
                  {ingredient.name}
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-full border border-huerto-verde/20 bg-huerto-verde/10 px-2.5 py-0.5 text-xs font-semibold text-huerto-verde">
                    {ingredient.type}
                  </span>
                </TableCell>
                <TableCell className="text-huerto-texto">
                  ${ingredient.price.toFixed(2)}
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      ingredient.available
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {ingredient.available ? "Sí" : "No"}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(ingredient)}
                      className="hover:bg-huerto-verde/10 hover:text-huerto-verde text-huerto-texto/70"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleDelete(ingredient.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {ingredients.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-10">
                  No hay ingredientes.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white border-huerto-verde/20">
          <DialogHeader>
            <DialogTitle className="text-huerto-texto font-heading">
              {editingIngredient ? "Editar Ingrediente" : "Nuevo Ingrediente"}
            </DialogTitle>
            <DialogDescription>
              Añade o modifica los ingredientes disponibles para las pizzas.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right text-huerto-texto">
                  Nombre
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="col-span-3 border-huerto-verde/20 focus-visible:ring-huerto-verde"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right text-huerto-texto">
                  Tipo
                </Label>
                <div className="col-span-3">
                  <Select
                    value={formData.type}
                    onValueChange={(
                      value: "base" | "salsa" | "queso" | "extra"
                    ) => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger className="border-huerto-verde/20 focus:ring-huerto-verde">
                      <SelectValue placeholder="Selecciona un tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="base">Base</SelectItem>
                      <SelectItem value="salsa">Salsa</SelectItem>
                      <SelectItem value="queso">Queso</SelectItem>
                      <SelectItem value="extra">Extra</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right text-huerto-texto">
                  Precio
                </Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price === "" ? "" : formData.price}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData({
                      ...formData,
                      price: value === "" ? "" : parseFloat(value),
                    });
                  }}
                  className="col-span-3 border-huerto-verde/20 focus-visible:ring-huerto-verde"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="available"
                  className="text-right text-huerto-texto"
                >
                  Disponible
                </Label>
                <div className="col-span-3 flex items-center space-x-2">
                  <Switch
                    id="available"
                    checked={formData.available}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, available: checked })
                    }
                  />
                  <Label
                    htmlFor="available"
                    className="font-normal text-muted-foreground"
                  >
                    {formData.available
                      ? "Disponible para ordenar"
                      : "No disponible"}
                  </Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                className="bg-huerto-verde hover:bg-huerto-verde/90 text-white"
              >
                {editingIngredient ? "Guardar Cambios" : "Crear Ingrediente"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
