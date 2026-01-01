import Image from "next/image";
import { Star } from "lucide-react";
import { pizzasHome, PizzaHome } from "@/data/pizzas-home";

const StarRating = ({ rating }: { rating: number }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className="flex items-center gap-2 bg-white rounded-full px-3 py-1 shadow-md">
      <div className="flex items-center bg-red-600 rounded-sm px-2 py-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-3 h-3 ${
              i < fullStars
                ? "fill-yellow-400 text-yellow-400"
                : i === fullStars && hasHalfStar
                ? "fill-yellow-400/50 text-yellow-400"
                : "fill-gray-300 text-gray-300"
            }`}
          />
        ))}
      </div>
      <span className="text-sm font-semibold text-pizza-texto">
        {rating.toFixed(1)}
      </span>
    </div>
  );
};

const PizzaCard = ({ pizza }: { pizza: PizzaHome }) => {
  return (
    <div className="group flex flex-col items-center  hover:bg-white p-4 transition-colors rounded-lg shadow-lg relative z-10">

      <div className="relative w-48 h-48 mb-4">
        <Image
          src={pizza.imageUrl}
          alt={pizza.name}
          fill
          className="object-contain drop-shadow-xl group-hover:scale-105 transition-transform duration-400 group-hover:rotate-90 cursor-pointer group-hover:-translate-y-1"
        />
      </div>

      <StarRating rating={pizza.stars} />

      <h3 className="font-bbh text-pizza-texto text-sm mt-3 tracking-wide text-center">
        {pizza.name}
      </h3>

      <div className="flex items-center gap-2 mt-1">
        {pizza.priceBeforeDiscount && (
          <span className="text-red-600 line-through text-sm">
            ${pizza.priceBeforeDiscount.toFixed(2)}
          </span>
        )}
        <span className="text-pizza-texto font-bold text-lg">
          ${pizza.price.toFixed(2)}
        </span>
      </div>
    </div>
  );
};

export const PopularPizza = () => {
  return (
    <section className="relative mb-32">
      <div className="bg-pizza-crema pt-20 pb-44 relative overflow-hidden">
        <div className="flex items-center justify-center gap-4 mb-12">
          <span className="font-oswald text-red-600 text-xl tracking-wider">
            OUR SIGNATURE
          </span>
          <div className="w-px h-8 bg-red-800"></div>
          <h2 className="font-bbh text-pizza-texto text-4xl md:text-5xl tracking-wide">
              PIZZA POPULARES
          </h2>
        </div>

        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 justify-items-center">
            {pizzasHome.map((pizza) => (
              <PizzaCard key={pizza.id} pizza={pizza} />
            ))}
          </div>
        </div>

        <div className="absolute -bottom-1/5 left-1/2 -translate-x-1/2 pointer-events-none">
          <span className="font-bbh text-3xl md:text-[18rem] text-huerto-verde/40 leading-none tracking-[0.2em] whitespace-nowrap">
            Delicia
          </span>
        </div>
      </div>

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-20">
        <div className="bg-pizza-texto rounded-full w-32 h-32 flex flex-col items-center justify-center cursor-pointer hover:bg-pizza-texto/90 transition-colors shadow-2xl">
          <span className="font-bbh text-white text-base tracking-wide">
            EXPLORE
          </span>
          <span className="font-bbh text-white text-base tracking-wide">
            MENU
          </span>
        </div>
      </div>
    </section>
  );
};
