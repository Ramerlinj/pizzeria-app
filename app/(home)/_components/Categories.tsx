"use client";

import {
  Pizza,
  Salad,
  Drumstick,
  Beer,
  Package,
  UtensilsCrossed,
} from "lucide-react";

import { useState } from "react";

const categories = [
  { name: "PIZZA", icon: Pizza, count: 50 },
  { name: "BURGERS", icon: Package, count: 40 },
  { name: "SALAD", icon: Salad, count: 30 },
  { name: "FRIES", icon: UtensilsCrossed, count: 20 },
  { name: "DRINKS", icon: Beer, count: 10 },
  { name: "CHICKEN", icon: Drumstick, count: 20 },
];

export const Categories = () => {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Título */}
        <h2 className="font-bbh text-pizza-texto text-3xl md:text-4xl lg:text-5xl text-center mb-12 tracking-wide">
          CON INGREDINETES DE CALIDAD
        </h2>

        {/* Categorías */}
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 lg:gap-16">
          {categories.map((category, index) => (
            <div
              key={category.name}
              className="flex items-center gap-8 md:gap-12 lg:gap-16"
            >
              <div
                className="flex flex-col items-center gap-3 cursor-pointer hover:opacity-70 hover:-translate-y-1 transition-all duration-500 group"
                onMouseEnter={() => setHoveredCategory(category.name)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <div className="relative">
                  <category.icon className="w-12 h-12 md:w-14 md:h-14 text-pizza-rojo stroke-1 group-hover:scale-110 transition-transform" />
                  {category.count > 0 && hoveredCategory === category.name && (
                    <div className="absolute -top-2 -right-2 bg-pizza-texto text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                      {category.count}
                    </div>
                  )}
                </div>

                <span className="font-bbh text-pizza-texto text-sm md:text-base tracking-wider group-hover:text-pizza-rojo transition-colors">
                  {category.name}
                </span>

                <div className="h-0.5 w-0 bg-pizza-rojo group-hover:w-full transition-all duration-300"></div>
              </div>

              {index < categories.length - 1 && (
                <div className="hidden md:block w-px h-16 bg-gray-300"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
