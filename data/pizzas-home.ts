export interface PizzaHome {
    id: number;
    name: string;
    imageUrl: string;
    price: number;
    priceBeforeDiscount?: number;
    stars: number;
}

export const pizzasHome: PizzaHome[] = [
    {
        id: 1,
        name: "MEXICAN GREEN WAVE",
        imageUrl: "/pizzas/pizza-home-1.webp",
        price: 19.00,
        priceBeforeDiscount: 25.00,
        stars: 5.0,
    },
    {
        id: 2,
        name: "INDI TANDOORI PANEER",
        imageUrl: "/pizzas/pizza-home-2.webp",
        price: 18.00,
        priceBeforeDiscount: 24.00,
        stars: 4.9,
    },
    {
        id: 3,
        name: "DOUBLE CHICKEN SAUSAGE",
        imageUrl: "/pizzas/pizza-home-3.webp",
        price: 20.00,
        priceBeforeDiscount: 22.00,
        stars: 5.0,
    },
    {
        id: 4,
        name: "GRILLED VEAL COOKED",
        imageUrl: "/pizzas/pizza-home-4.webp",
        price: 16.00,
        priceBeforeDiscount: 20.00,
        stars: 4.3,
    },
];