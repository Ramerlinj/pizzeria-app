export interface MenuItem {
    id: number;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    category: "Entrantes" | "Pizzas" | "Hamburguesas" | "Pollo" | "Bebidas";
    badge?: "Nuevo" | "Picante";
}

export const menuItems: MenuItem[] = [
    // Entrantes
    {
        id: 1,
        name: "PAN DE AJO",
        description: "Pan tostado cubierto con ajo y aceite de oliva.",
        price: 8.00,
        imageUrl: "/pizzas/pizza-home-1.webp", // Placeholder
        category: "Entrantes"
    },
    {
        id: 2,
        name: "PALITOS DE QUESO",
        description: "Palitos de queso fritos servidos con salsa marinara.",
        price: 10.00,
        imageUrl: "/pizzas/pizza-home-2.webp", // Placeholder
        category: "Entrantes",
        badge: "Picante"
    },
    // Pizzas
    {
        id: 3,
        name: "PIZZA SPRING FLING",
        description: "Una explosión de sabores primaverales.",
        price: 10.00,
        imageUrl: "/pizzas/pizza-home-1.webp",
        category: "Pizzas",
        badge: "Nuevo"
    },
    {
        id: 4,
        name: "PIZZA FARM VILLA",
        description: "Deliciosa combinación de vegetales frescos de la granja.",
        price: 18.00,
        imageUrl: "/pizzas/pizza-home-2.webp",
        category: "Pizzas"
    },
    {
        id: 5,
        name: "PIZZA VEGETARIANA SUPREMA",
        description: "La opción definitiva para los amantes de los vegetales.",
        price: 18.00,
        imageUrl: "/pizzas/pizza-home-3.webp",
        category: "Pizzas"
    },
    {
        id: 6,
        name: "PIZZA PANEER TIKKA",
        description: "Fusión india con trozos de paneer marinados.",
        price: 20.00,
        imageUrl: "/pizzas/pizza-home-4.webp",
        category: "Pizzas",
        badge: "Picante"
    },
    {
        id: 7,
        name: "PIZZA ESPECIAL KORMA",
        description: "Sabor suave y cremoso con un toque de especias.",
        price: 12.00,
        imageUrl: "/pizzas/pizza-home-1.webp",
        category: "Pizzas"
    },
    {
        id: 8,
        name: "PIZZA PASIÓN PICANTE",
        description: "Para los que buscan un toque extra de calor.",
        price: 16.00,
        imageUrl: "/pizzas/pizza-home-2.webp",
        category: "Pizzas",
        badge: "Picante"
    },
    {
        id: 9,
        name: "PIZZA FLORENTINA ESPECIAL",
        description: "Espinacas frescas, huevo y queso parmesano.",
        price: 20.00,
        imageUrl: "/pizzas/pizza-home-3.webp",
        category: "Pizzas",
        badge: "Picante"
    },
    {
        id: 10,
        name: "PIZZA COMBO MEXICANO",
        description: "Sabores auténticos de México en tu pizza.",
        price: 22.00,
        imageUrl: "/pizzas/pizza-home-4.webp",
        category: "Pizzas"
    },
    // Hamburguesas
    {
        id: 11,
        name: "HAMBURGUESA CLÁSICA",
        description: "Jugosa carne de res con lechuga, tomate y queso.",
        price: 12.00,
        imageUrl: "/pizzas/pizza-home-1.webp", // Placeholder
        category: "Hamburguesas"
    },
    // Pollo
    {
        id: 12,
        name: "POLLO CRUJIENTE",
        description: "Pollo frito dorado con una guarnición de papas fritas.",
        price: 15.00,
        imageUrl: "/pizzas/pizza-home-2.webp", // Placeholder
        category: "Pollo"
    },
    // Bebidas
    {
        id: 13,
        name: "COLA",
        description: "Refrescante bebida de cola.",
        price: 3.00,
        imageUrl: "/pizzas/pizza-home-3.webp", // Placeholder
        category: "Bebidas"
    }
];
