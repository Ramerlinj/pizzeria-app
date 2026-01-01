import { Instagram, Facebook, Twitter} from "lucide-react";

import type { LucideIcon } from "lucide-react";

export interface FooterLink {
  title: string;
  href: string;
}

export interface SocialMedia {
  name: string;
  icon: LucideIcon;
  href: string;
}

export const FOOTER_LINKS: FooterLink[] = [
  { title: "Inicio", href: "/" },
  { title: "Sobre Nosotros", href: "/about" },
  { title: "Menú", href: "/menu" },
  { title: "Chefs", href: "/chefs" },
  { title: "Contacto", href: "/contact" },
];

export const RESTAURANT_INFO = {
  title: "Encuentra nuestros restaurantes",
  address: "Zona Colonial 123, Centro",
  city: "Santo Domingo, República Dominicana",
};

export const OPENING_HOURS = {
  title: "Horarios de apertura",
  days: "Lunes - Domingo",
  hours: "9:00 AM to 11:30 PM",
};

export const SOCIAL_MEDIA: SocialMedia[] = [
  { name: "Facebook", icon: Facebook, href: "https://facebook.com" },
  { name: "Instagram", icon: Instagram, href: "https://instagram.com" },
  { name: "Twitter", icon: Twitter, href: "https://twitter.com" },
];

export const COPYRIGHT = {
  year: new Date().getFullYear(),
  brand: "Todos los derechos reservados.",
  poweredBy: "Ramerlin Dev",
  poweredByUrl: "https://ramerlin.dev",
};
