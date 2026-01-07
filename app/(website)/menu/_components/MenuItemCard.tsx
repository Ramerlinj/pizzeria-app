"use client";

import Image from "next/image";
import { MenuItem } from "@/data/menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "./cart-context";

interface MenuItemCardProps {
  item: MenuItem;
}

export const MenuItemCard = ({ item }: MenuItemCardProps) => {
  const { addItem } = useCart();

  return (
    <div className="flex items-start justify-between gap-4 p-4 border-b border-dashed border-gray-200 last:border-0 hover:bg-gray-50 transition-colors rounded-lg">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-xl font-bold uppercase tracking-wide text-pizza-texto flex items-center gap-2 font-heading">
            {item.name}
            {item.badge && (
              <Badge
                variant={item.badge === "Picante" ? "destructive" : "default"}
                className="text-xs px-2 py-0.5 h-auto font-sans uppercase tracking-wider"
              >
                {item.badge}
              </Badge>
            )}
          </h3>
          <span className="text-xl font-bold text-pizza-naranja font-heading">
            ${item.price.toFixed(2)}
          </span>
        </div>
        <p className="text-gray-500 text-sm leading-relaxed font-sans">
          {item.description}
        </p>
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg group-hover:scale-105 transition-transform duration-300">
          <Image
            src={item.image_url}
            alt={item.name}
            fill
            className="object-cover"
          />
        </div>
        <Button
          size="sm"
          className="bg-pizza-naranja hover:bg-pizza-naranja/90 text-white rounded-full px-4 py-2 text-sm"
          onClick={() => addItem(item)}
        >
          Agregar
        </Button>
      </div>
    </div>
  );
};
