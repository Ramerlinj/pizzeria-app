import { Hero } from "./_components/Hero";
import { AboutPizza } from "./_components/AboutPizza";
import { PopularPizza } from "./_components/PopularPizza";
import { Categories } from "./_components/Categories";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Categories />
      <AboutPizza />
      <PopularPizza />
    </main>
  );
}
