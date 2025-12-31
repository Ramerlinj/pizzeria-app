import Image from "next/image";
import { Button } from "@/components/ui/button";

export const AboutPizza = () => {
  return (
    <section className="grid grid-cols-2 mx-auto mb-32 md:px-0">
      <div className="">
        <Image
          src={"/demo-pizza.webp"}
          width={1200}
          height={100}
          alt="Demo Pizza"
        />
      </div>
      <div className="mx-30 content-center">
        <span className="font-heading text-xl text-pizza-rojo -tracking-tight">
          ⸺ La mejor pizza para compartir con amigos y familia.
        </span>
        <h1 className="font-heading text-5xl font-bold text-pizza-texto -tracking-tight uppercase mt-5 text-balance">
          La Pizza mas deliciosa, Hecha con Amor.
        </h1>
        <p className="text-gray-500 text-sm mt-4 text-balance font-light">
          All about quality you can trust. As one of the original founding pizza
          brands and the 3rd largest pizza chain, our sole mission is making the
          freshest, tastiest.
        </p>
        <Button className="mt-5 h-12" variant={"animated"}>
          Sobre el Restaurante
        </Button>
      </div>
    </section>
  );
};
