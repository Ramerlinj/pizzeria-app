import Image from "next/image";
import { Button } from "@/components/ui/button";

export const AboutPizza = () => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 mx-auto mb-20 md:mb-32 px-4 md:px-0 gap-8 md:gap-0">
      <div className="w-full">
        <Image
          src="/demo-pizza.webp"
          width={1200}
          height={100}
          alt="Demo Pizza"
          className="w-full h-auto"
        />
      </div>
      <div className="px-4 md:px-8 lg:mx-30 content-center">
        <span className="font-heading text-sm md:text-xl text-pizza-rojo -tracking-tight">
          ⸺ La mejor pizza para compartir con amigos y familia.
        </span>
        <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-pizza-texto -tracking-tight uppercase mt-3 md:mt-5 text-balance">
          La Pizza mas deliciosa, Hecha con Amor.
        </h1>
        <p className="text-gray-500 text-xs md:text-sm mt-3 md:mt-4 text-balance font-light">
          All about quality you can trust. As one of the original founding pizza
          brands and the 3rd largest pizza chain, our sole mission is making the
          freshest, tastiest.
        </p>
        <Button
          className="mt-4 md:mt-5 h-10 md:h-12 text-sm md:text-base"
          variant={"animated"}
        >
          Sobre el Restaurante
        </Button>
      </div>
    </section>
  );
};
