import Link from "next/link";
import Image from "next/image";
import logo from "@/public/logos/logo-background-dark-large.svg";
import {
  FOOTER_LINKS,
  RESTAURANT_INFO,
  OPENING_HOURS,
  SOCIAL_MEDIA,
  COPYRIGHT,
} from "@/data/footer";

const Footer = () => {
  return (
    <footer className="bg-neutral-900 text-gray-400">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="flex flex-col space-y-6">
            <Link href="/" className="inline-flex">
                <Image
                  src={logo}
                  alt="Logo Pizzao"
                  className="w-full h-full object-contain"
                />
              
            </Link>
          </div>

          <div className="flex flex-col space-y-4">
            <h3 className="text-white font-heading text-lg font-semibold mb-2">
              {RESTAURANT_INFO.title}
            </h3>
            <div className="space-y-1">
              <p className="text-gray-400">{RESTAURANT_INFO.address}</p>
              <p className="text-gray-400">{RESTAURANT_INFO.city}</p>
            </div>
          </div>

          <div className="flex flex-col space-y-4">
            <h3 className="text-white font-heading text-lg font-semibold mb-2">
              {OPENING_HOURS.title}
            </h3>
            <div className="space-y-1">
              <p className="text-gray-400">{OPENING_HOURS.days}</p>
              <p className="text-gray-400">{OPENING_HOURS.hours}</p>
            </div>
          </div>

          <div className="flex flex-col space-y-4">
            <h3 className="text-white font-heading text-lg font-semibold mb-2">
              Conéctate con nosotros
            </h3>
            <div className="flex space-x-4">
              {SOCIAL_MEDIA.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-neutral-800 hover:bg-neutral-700 rounded-full flex items-center justify-center transition-colors duration-300"
                  aria-label={social.name}
                >
                    <social.icon className="w-6 h-6 text-gray-400 hover:text-white" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-neutral-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <nav className="flex flex-wrap justify-center md:justify-start gap-6">
              {FOOTER_LINKS.map((link) => (
                <Link
                  key={link.title}
                  href={link.href}
                  className="text-gray-400 hover:text-white transition-colors duration-300 text-sm"
                >
                  {link.title}
                </Link>
              ))}
            </nav>

            <div className="text-sm text-gray-400">
              <span>
                © {COPYRIGHT.year} {COPYRIGHT.brand} {" "}
              </span>
              <Link
                href={COPYRIGHT.poweredByUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gray-300 transition-colors duration-300 underline"
              >
                {COPYRIGHT.poweredBy}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
