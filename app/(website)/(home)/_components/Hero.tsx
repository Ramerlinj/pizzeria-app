import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export const Hero = () => {
  return (
    <section className="relative mb-20 md:mb-32">
      <div className="container mx-auto max-w-full h-[60vh] md:h-[80vh] lg:h-svh overflow-hidden curva">
        <Image
          src="/banners/pizza-cheese.webp"
          alt="imagen pizza "
          width={1920}
          height={1080}
          className="object-cover aspect-video w-full h-full pointer-events-none"
        />
      </div>
      <div className="absolute flex flex-col bottom-0 z-40 left-1/2 transform-3d transform -translate-x-1/2 translate-y-1/2 ">
        <div className="bg-linear-to-b from-transparent from-49% to-amber-600 to-40% -translate-z-1 -z-10 rounded-full p-1.5 md:p-2 shadow-xl">
          <div className="rounded-full relative flex flex-col items-center justify-center bg-white w-28 h-28 md:w-40 md:h-40">
            <Button
              className="absolute -top-2 md:-top-3 rounded-full bg-red-700 hover:bg-red-700/10 cursor-pointer w-8 h-8 md:w-10 md:h-10"
              size={"icon"}
            >
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
            </Button>
            <span className="font-bbh text-pizza-texto text-lg md:text-2xl font-bold tracking-wide">
              ORDER
            </span>
            <span className="font-bbh text-pizza-texto text-lg md:text-2xl font-bold tracking-wide">
              PIZZA
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
