"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { menuItems } from "@/data/menu";
import { MenuItemCard } from "./MenuItemCard";

const categories = [
  "Entrantes",
  "Pizzas",
  "Hamburguesas",
  "Pollo",
  "Bebidas",
] as const;

export const MenuCategories = () => {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <span className="text-pizza-naranja font-medium tracking-widest uppercase text-sm font-sans">
          Menú Exclusivo
        </span>
        <h2 className="text-4xl md:text-5xl font-bold text-pizza-texto mt-2 font-heading uppercase">
          Elige tu sabor
        </h2>
      </div>

      <Tabs defaultValue="Pizzas" className="w-full flex flex-col items-center">
        <TabsList className="flex flex-wrap justify-center gap-2 bg-transparent mb-12 h-auto p-0">
          {categories.map((category) => (
            <TabsTrigger
              key={category}
              value={category}
              className="text-lg font-medium px-6 py-2 rounded-full data-[state=active]:bg-pizza-naranja data-[state=active]:text-white text-gray-600 hover:text-pizza-naranja transition-colors border border-transparent data-[state=active]:border-pizza-naranja font-heading uppercase tracking-wide"
            >
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent
            key={category}
            value={category}
            className="w-full max-w-5xl"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              {menuItems
                .filter((item) => item.category === category)
                .map((item) => (
                  <MenuItemCard key={item.id} item={item} />
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
};
