
export interface NavItem {
  title: string;
  href: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

export const NAVBAR: NavItem[] = [
    { title: "Inicio", href: "/" },
    { title: "Menú", href: "/menu" },
    { title: "Sobre Nosotros", href: "/about" },
    { title: "Contacto", href: "/contact" },
];