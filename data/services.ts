import { Apple, PackageCheck, ChefHat } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface Service {
    id: number;
    title: string;
    description: string;
    icon?: LucideIcon;
}

export const services: Service[] = [
    {
        id: 1,
        title: "Alimento Fresco",
        description: "Cada ingrediente se conserva fresco y de alta calidad.",
        icon: Apple,
    },
    {
        id: 2,
        title: "Entrega Rápida",
        description: "Recibe tu pizza caliente y lista para disfrutar en minutos.",
        icon: PackageCheck,
    },
    {
        id: 3,
        title: "Los mejores chefs",
        description: "Nuestros chefs expertos preparan cada pizza con pasión y habilidad.",
        icon: ChefHat,
    },
    {
        id: 4,
        title: "Atención Personalizada",
        description: "Te asesoramos para elegir la pizza perfecta para cada ocasión.",
        icon: PackageCheck,
    },
    {
        id: 5,
        title: "Opciones Saludables",
        description: "Disfruta de masas integrales y toppings balanceados sin sacrificar sabor.",
        icon: Apple,
    },
    {
        id: 6,
        title: "Promociones Exclusivas",
        description: "Accede a descuentos especiales y combos diseñados para compartir.",
        icon: ChefHat,
    },
];