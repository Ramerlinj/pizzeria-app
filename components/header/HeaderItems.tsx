import { NAVBAR } from "@/data/header";

export default function HeaderItems() {
  return (
    <nav className="w-full">
      <ul className="flex justify-center h-full items-center gap-20">
        {NAVBAR.map((item, index) => (
          <li className="text-pizza-texto text-lg font-medium font-heading" key={index}>
            <a
              href={item.href}
              className="relative flex items-center p-2 rounded-xl px-1 gap-2 border border-transparent hover:border-primary-200 hover:bg-primary-100/50 transition-all duration-300
              after:content-[''] after:absolute after:bottom-1 after:left-0 after:w-0 after:h-[3px] after:bg-pizza-rojo after:rounded-2xl hover:after:w-full after:transition-all after:duration-500"
            >
              {item.icon && <item.icon className="size-6" />}
              {item.title}
            </a>
            
          </li>
        ))}
      </ul>
    </nav>
  );
}