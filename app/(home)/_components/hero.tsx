import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export const Hero = () => {
  return (
    <section className="relative mb-32">
      <div className="container mx-auto max-w-full h-svh overflow-hidden curva">
        <Image
          src="/banners/pizza-cheese.png"
          alt="Description"
          width={1920}
          height={1080}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="absolute flex flex-col bottom-0 z-50 left-1/2 transform-3d transform -translate-x-1/2 translate-y-1/2 ">
        <div className="bg-linear-to-b from-transparent from-49% to-amber-600 to-40% -translate-z-1 -z-10 rounded-full p-2 shadow-xl">
          <div className="rounded-full relative flex flex-col items-center justify-center bg-white w-40 h-40">
            <Button
              className="absolute -top-3 rounded-full bg-red-700 hover:bg-red-700/10 cursor-pointer w-10 h-10"
              size={"icon"}
            >
              <ArrowRight className="w-5 h-5" />
            </Button>
            <span className="font-bbh text-pizza-texto text-2xl font-bold tracking-wide">
              ORDER
            </span>
            <span className="font-bbh text-pizza-texto text-2xl font-bold tracking-wide">
              PIZZA
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
