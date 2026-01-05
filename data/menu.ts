export interface Ingredient {
    id: number;
    name: string;
    price: number;
    available: boolean;
    type: 'base' | 'salsa' | 'queso' | 'extra';
}

export interface MenuItem {
    id: number;
    name: string;
    description: string;
    price: number;
    image_url: string;
    type_product: 'pizza' | 'drink' | 'dessert' | 'extra';
    is_recommended: boolean;
    badge?: "Nuevo" | "Picante";
    ingredients?: number[]; // IDs of ingredients
}

export const ingredients: Ingredient[] = [
    { id: 1, name: "Queso Mozzarella", price: 1.50, available: true, type: 'queso' },
    { id: 2, name: "Tomate", price: 0.50, available: true, type: 'extra' },
    { id: 3, name: "Pepperoni", price: 1.00, available: true, type: 'extra' },
    { id: 4, name: "Champiñones", price: 0.80, available: true, type: 'extra' },
    { id: 5, name: "Cebolla", price: 0.50, available: true, type: 'extra' },
    { id: 6, name: "Pimiento", price: 0.60, available: true, type: 'extra' },
    { id: 7, name: "Aceitunas", price: 0.70, available: true, type: 'extra' },
    { id: 8, name: "Pollo", price: 1.20, available: false, type: 'extra' },
    { id: 9, name: "Carne Picada", price: 1.50, available: true, type: 'extra' },
    { id: 10, name: "Bacon", price: 1.00, available: true, type: 'extra' },
];

export const menuItems: MenuItem[] = [
    // Entrantes
    {
        id: 1,
        name: "PAN DE AJO",
        description: "Pan tostado cubierto con ajo y aceite de oliva.",
        price: 8.00,
        image_url: "/pizzas/pizza-home-1.webp", // Placeholder
        type_product: "extra",
        is_recommended: false
    },
    {
        id: 2,
        name: "PALITOS DE QUESO",
        description: "Palitos de queso fritos servidos con salsa marinara.",
        price: 10.00,
        image_url: "/pizzas/pizza-home-2.webp", // Placeholder
        type_product: "extra",
        badge: "Picante",
        is_recommended: true
    },
    // Pizzas
    {
        id: 3,
        name: "PIZZA SPRING FLING",
        description: "Una explosión de sabores primaverales.",
        price: 10.00,
        image_url: "/pizzas/pizza-home-1.webp",
        type_product: "pizza",
        badge: "Nuevo",
        is_recommended: true
    },
    {
        id: 4,
        name: "PIZZA FARM VILLA",
        description: "Deliciosa combinación de vegetales frescos de la granja.",
        price: 18.00,
        image_url: "/pizzas/pizza-home-2.webp",
        type_product: "pizza",
        is_recommended: false
    },
    {
        id: 5,
        name: "PIZZA VEGETARIANA SUPREMA",
        description: "La opción definitiva para los amantes de los vegetales.",
        price: 18.00,
        image_url: "/pizzas/pizza-home-3.webp",
        type_product: "pizza",
        is_recommended: false
    },
    {
        id: 6,
        name: "PIZZA PANEER TIKKA",
        description: "Fusión india con trozos de paneer marinados.",
        price: 20.00,
        image_url: "/pizzas/pizza-home-4.webp",
        type_product: "pizza",
        badge: "Picante",
        is_recommended: true
    },
    {
        id: 7,
        name: "PIZZA ESPECIAL KORMA",
        description: "Sabor suave y cremoso con un toque de especias.",
        price: 12.00,
        image_url: "/pizzas/pizza-home-1.webp",
        type_product: "pizza",
        is_recommended: false
    },
    {
        id: 8,
        name: "PIZZA PASIÓN PICANTE",
        description: "Para los que buscan un toque extra de calor.",
        price: 16.00,
        image_url: "/pizzas/pizza-home-2.webp",
        type_product: "pizza",
        badge: "Picante",
        is_recommended: false
    },
    {
        id: 9,
        name: "PIZZA FLORENTINA ESPECIAL",
        description: "Espinacas frescas, huevo y queso parmesano.",
        price: 20.00,
        image_url: "/pizzas/pizza-home-3.webp",
        type_product: "pizza",
        badge: "Picante",
        is_recommended: false
    },
    {
        id: 10,
        name: "PIZZA COMBO MEXICANO",
        description: "Sabores auténticos de México en tu pizza.",
        price: 22.00,
        image_url: "/pizzas/pizza-home-4.webp",
        type_product: "pizza",
        is_recommended: false
    },
    // Hamburguesas
    {
        id: 11,
        name: "HAMBURGUESA CLÁSICA",
        description: "Jugosa carne de res con lechuga, tomate y queso.",
        price: 12.00,
        image_url: "/pizzas/pizza-home-1.webp", // Placeholder
        type_product: "extra",
        is_recommended: false
    },
    // Pollo
    {
        id: 12,
        name: "POLLO CRUJIENTE",
        description: "Pollo frito dorado con una guarnición de papas fritas.",
        price: 15.00,
        image_url: "/pizzas/pizza-home-2.webp", // Placeholder
        type_product: "extra",
        is_recommended: false
    },
    // Bebidas
    {
        id: 13,
        name: "COLA",
        description: "Refrescante bebida de cola.",
        price: 3.00,
        image_url: "/pizzas/pizza-home-3.webp", // Placeholder
        type_product: "drink",
        is_recommended: false
    }
];
