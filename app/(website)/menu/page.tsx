import { HeroMenu } from "./_components/heroMenu";
import { MenuCategories } from "./_components/MenuCategories";
import { CartProvider } from "./_components/cart-context";
import { CartSheet } from "./_components/CartSheet";

function Menu() {
  return (
    <main className="pb-20">
      <HeroMenu />
      <CartProvider>
        <section className="container mx-auto px-4 pb-10">
          <div className="flex items-center justify-end mb-6">
            <CartSheet />
          </div>
          <MenuCategories />
        </section>
      </CartProvider>
    </main>
  );
}

export default Menu;
