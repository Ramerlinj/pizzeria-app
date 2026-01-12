"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Leaf,
  Flame,
  Heart,
  MapPin,
  Plane,
  Trophy,
  Utensils,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[80vh] flex items-center justify-center overflow-hidden bg-pizza-crema">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCOfsdC4etN_u9JHa9kE5qOLLeCCkMfOwBytPK9ZQ_3BOkdfaz4loYifiZzMl601XD565xaEnxcpwCUEnoWDJ6MznYXTIy7byUCSKM4_cf3uPTWcuKJKoKxh-psYgEzpk-0SwmhmdRydjmNcv7zNRpu5Dj7gv1HAyUgsVPVL7Ng-KxUH2w0OAZnQJTZeSiqnPWy5fE_dqW8AUNL3hPMbDHxbfJB3C3-RGCHzyWIVtbgjHLC2zsWhz_X1UKFb6tuIM9LF21nEmlg5aw"
            alt="Horno de pizza tradicional"
            fill
            className="object-cover brightness-90"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-white/75 via-white/60 to-white/20" />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto text-gray-900">
          <span className="inline-block py-1 px-3 rounded-full bg-pizza-naranja/15 text-pizza-naranja text-xs font-bold tracking-wider mb-4 uppercase">
            Est. 1998
          </span>
          <h1 className="text-5xl md:text-7xl font-bold font-heading mb-6 leading-tight text-pizza-texto">
            Más Que Solo <span className="text-pizza-naranja">Pizza</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Creamos experiencias, no solo comidas. Una rebanada de tradición
            napolitana servida con pasión moderna en cada bocado.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/menu">
              <Button className="bg-pizza-naranja hover:bg-pizza-naranja/90 text-white rounded-full px-8 py-6 text-lg font-bold shadow-lg shadow-pizza-naranja/20 transition-all hover:scale-105">
                Ver Menú
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                variant="outline"
                className="bg-white border-pizza-naranja/30 text-pizza-texto hover:bg-pizza-naranja/10 rounded-full px-8 py-6 text-lg font-bold transition-all hover:scale-105"
              >
                Nuestras Ubicaciones
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-20 bg-gradient-to-b from-white via-pizza-crema/50 to-white text-pizza-texto">
        <div className="container px-4 mx-auto">
          <div className="mb-16 text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-bold font-heading mb-4 text-pizza-texto">
              Nuestra <span className="text-pizza-naranja">Filosofía</span>
            </h2>
            <p className="text-gray-600 max-w-2xl">
              Desde la granja hasta el fuego, creemos en el poder de lo simple.
              Ingredientes de alta calidad obtenidos directamente de Italia. No
              cortamos esquinas; cortamos rebanadas.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white p-8 rounded-3xl border border-pizza-naranja/15 hover:border-pizza-naranja/50 transition-all duration-300 group hover:-translate-y-1 shadow-sm">
              <div className="w-14 h-14 bg-pizza-naranja/15 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-pizza-naranja transition-colors duration-300">
                <Leaf className="w-7 h-7 text-pizza-naranja group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold font-heading mb-3">
                Ingredientes Frescos
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Obtenemos diariamente ingredientes de mercados orgánicos locales
                e importamos directamente desde Nápoles lo esencial.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-8 rounded-3xl border border-pizza-naranja/15 hover:border-pizza-naranja/50 transition-all duration-300 group hover:-translate-y-1 shadow-sm">
              <div className="w-14 h-14 bg-pizza-naranja/15 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-pizza-naranja transition-colors duration-300">
                <Flame className="w-7 h-7 text-pizza-naranja group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold font-heading mb-3">
                Horno de Leña
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Cocinadas a 900°F en nuestros hornos Stefano Ferrara
                personalizados para ese carbonizado de leopardo perfecto.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-8 rounded-3xl border border-pizza-naranja/15 hover:border-pizza-naranja/50 transition-all duration-300 group hover:-translate-y-1 shadow-sm">
              <div className="w-14 h-14 bg-pizza-naranja/15 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-pizza-naranja transition-colors duration-300">
                <Heart className="w-7 h-7 text-pizza-naranja group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold font-heading mb-3">
                Receta Familiar
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Masa fermentada durante 72 horas, transmitida a través de tres
                generaciones de la familia Rossi.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className="py-24 bg-gray-50">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-20">
            <span className="text-pizza-naranja font-bold tracking-widest uppercase text-sm">
              Nuestra Historia
            </span>
            <h2 className="text-4xl md:text-5xl font-bold font-heading mt-2 text-gray-900">
              El Viaje
            </h2>
          </div>

          <div className="relative max-w-5xl mx-auto">
            {/* Vertical Line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 -translate-x-1/2"></div>

            <div className="space-y-20">
              {/* Item 1 */}
              <div className="relative flex flex-col md:flex-row items-center gap-8 md:gap-16 group">
                <div className="md:w-1/2 md:text-right pl-20 md:pl-0">
                  <span className="text-pizza-naranja font-bold text-lg block mb-1">
                    1998
                  </span>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 font-heading">
                    Orígenes en Nápoles
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Todo comenzó en un pequeño callejón en Nápoles, donde la
                    Nonna Maria perfeccionó su receta de masa secreta.
                  </p>
                </div>

                <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-16 h-16 bg-pizza-naranja rounded-full flex items-center justify-center z-10 shadow-lg shadow-pizza-naranja/30 border-4 border-white">
                  <MapPin className="w-7 h-7 text-white" />
                </div>

                <div className="md:w-1/2 hidden md:block"></div>
              </div>

              {/* Item 2 */}
              <div className="relative flex flex-col md:flex-row items-center gap-8 md:gap-16 group">
                <div className="md:w-1/2 hidden md:block"></div>

                <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-16 h-16 bg-pizza-naranja rounded-full flex items-center justify-center z-10 shadow-lg shadow-pizza-naranja/30 border-4 border-white">
                  <Plane className="w-7 h-7 text-white" />
                </div>

                <div className="md:w-1/2 pl-20 md:pl-0">
                  <span className="text-pizza-naranja font-bold text-lg block mb-1">
                    2005
                  </span>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 font-heading">
                    La Mudanza a NYC
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    La familia Rossi trajo su tradición a Brooklyn, abriendo su
                    primera ubicación en EE.UU. con un horno importado ladrillo
                    a ladrillo.
                  </p>
                </div>
              </div>

              {/* Item 3 */}
              <div className="relative flex flex-col md:flex-row items-center gap-8 md:gap-16 group">
                <div className="md:w-1/2 md:text-right pl-20 md:pl-0">
                  <span className="text-pizza-naranja font-bold text-lg block mb-1">
                    2012
                  </span>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 font-heading">
                    Primera Estrella Michelin
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Nuestra pizza Margherita fue reconocida por su autenticidad
                    y perfecto equilibrio de sabores, ganando reconocimiento
                    internacional.
                  </p>
                </div>

                <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-16 h-16 bg-pizza-naranja rounded-full flex items-center justify-center z-10 shadow-lg shadow-pizza-naranja/30 border-4 border-white">
                  <Trophy className="w-7 h-7 text-white" />
                </div>

                <div className="md:w-1/2 hidden md:block"></div>
              </div>

              {/* Item 4 */}
              <div className="relative flex flex-col md:flex-row items-center gap-8 md:gap-16 group">
                <div className="md:w-1/2 hidden md:block"></div>

                <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-16 h-16 bg-pizza-naranja rounded-full flex items-center justify-center z-10 shadow-lg shadow-pizza-naranja/30 border-4 border-white">
                  <Utensils className="w-7 h-7 text-white" />
                </div>

                <div className="md:w-1/2 pl-20 md:pl-0">
                  <span className="text-pizza-naranja font-bold text-lg block mb-1">
                    Hoy
                  </span>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 font-heading">
                    Expansión y Amor
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Ahora servimos auténtica pizza napolitana en 5 ubicaciones,
                    manteniendo la misma pasión y calidad que el primer día.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-white">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
            <div>
              <span className="text-pizza-naranja font-bold tracking-widest uppercase text-sm">
                Nuestro Equipo
              </span>
              <h2 className="text-4xl font-bold font-heading mt-2 text-gray-900">
                Conoce a los Maestros
              </h2>
            </div>
            <Link
              href="/team"
              className="hidden md:flex items-center gap-2 font-bold text-gray-900 hover:text-pizza-naranja transition-colors group"
            >
              Únete al equipo{" "}
              <span className="text-xl group-hover:translate-x-1 transition-transform">
                →
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
            {[
              {
                name: "Marco Rossi",
                role: "Jefe de Cocina",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAwBSDDnF7m7H9Bzsvob0Nbu1xU7oycinNcf8TsAbqx60Z-lpZYBOxRz5lIOK_Vw9QERbnW5bHpTpiqKc-EvMrfkYT-hPZRbAh8uOvBx2A9YWuQ-ZJ_SG1OosYn8RiuVEaiSe_E94xX0X3Nkfh4UHiwL_1ncGolC1zUFecXXN2dqGXqsuC5ymPcAvEYo_p-68wIfuIfCOfTLFy7u-mjG4bnqN4tyriJ4vwzC6bG3UG_3WxDPflVLUtDWnQ0Xhp-06mb2WEesobPQGc",
              },
              {
                name: "Giulia Bianchi",
                role: "Sous Chef",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBXIqW2NyUEKgJ7yX1_D3-nPPHirkH7DQD19B85Fmxbin7JRMXRjfeZ34_aNGnugKwmkkmMYyd82_8r7eePXdGwq6gj1K49FeY7FA3K-rndRlTAF4sw651DT0NlVEo5LmMYu3V_G1TcpswCD0jxi3d3WBG6tKUJGla260vZYyh5bFub8w_s331X34o-HSxf_rEdd0ge5JMpL47NrTAfO-NNmy8mj5P7ep4_NaewZoNc1uMRBXd2oSFoWQ_YR-I6HteyB8ww3xUG9DI",
              },
              {
                name: "Leo Esposito",
                role: "Gerente General",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCLdV9Z_qacnPySUz0ojMPSx3G9laLlAOmm7nNchJ-RJqBMtUpLhOOFMjKThjt9wXwDWgMBPquelyIPaL-YAcdNuH0X7nz3sTgD42SNVWrKzftbKw1vBytkYmsHRbTGIOVjqiqjFnFq9hwMfRI6UhlsUUFK4-vB04tkhI3FgvM6U96CGbOTluuuD0pfIbm5l2lgqwFuwRuqle8l2M-w7DVNmQIAlB5jHRROHRyY0jEcqtFgyd3nkBWfHJJf2wZb4ArfCxZWX9xWaaU",
              },
              {
                name: "Sofia Romano",
                role: "Chef Pastelera",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuANOPQw_kbAVRn2Jpfg55rBbgIvnTq0xyZEh2t_dn4hxu2rrsilfdmdwK0jDUdiG_1mhqmJN1RKaAHQ1BJZahZV_6J6WEcoPmuE7eJaY8gNPb0O_FzQoLo6WH_BObVkeMB48ic-1lNrV8DjRCqaPCvOkpOfWrXZ3zd3QwZFuu2pF9_2E0bzuQR-Ong_9DgpP3t5zJxVrLmm2z6scc6ztj82C4P0O98Q8SxQtkbvVCA2o5tARfb0XjLRg45Jekc-MDqcka3USh1H-Y4",
              },
            ].map((member, i) => (
              <div key={i} className="text-center group">
                <div className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden border-4 border-white shadow-xl group-hover:scale-105 transition-transform duration-300 ring-1 ring-gray-100">
                  <Image
                    src={member.img}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {member.name}
                </h3>
                <p className="text-pizza-naranja text-sm font-medium uppercase tracking-wide">
                  {member.role}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center md:hidden">
            <Link
              href="/team"
              className="inline-flex items-center gap-2 font-bold text-gray-900 hover:text-pizza-naranja transition-colors"
            >
              Únete al equipo <span className="text-xl">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 flex items-center justify-center overflow-hidden bg-pizza-crema">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAT_9o6kQkenjE-M3golhwSR62EplmIWxw29qWtgELVyVQYYz8XFDP7M5K9QHMu9qZGMjQOA2RJn3ObZuFxccHpto--En-Th-F3TB-gTGT-MLKk5dGuG9pL7AjBchiRevp1KSG-LdqLNFrxC1urr8gDno_GVB6yaCia3RJVcCbeczBHyfxR0UteEi1wJouTZV6w5cVaA7jNU4KaVTg7l8Zxqm2qSkdwyVbcelB1N0f6w4IAsQjtYot27vgdSWWaaNR1hyvYuu91bg8"
            alt="Pizza deliciosa"
            fill
            className="object-cover brightness-90"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/70 to-white/30" />
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto text-pizza-texto">
          <h2 className="text-4xl md:text-6xl font-bold font-heading mb-6">
            Prueba la Tradición
          </h2>
          <p className="text-lg text-gray-700 mb-10 max-w-2xl mx-auto">
            ¿Listo para experimentar la mejor pizza napolitana de la ciudad?
            Reserva tu mesa ahora o pide a domicilio y disfruta en casa.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-pizza-naranja hover:bg-pizza-naranja/90 text-white rounded-full px-8 py-6 text-lg font-bold shadow-lg shadow-pizza-naranja/20 transition-all hover:scale-105">
              Reservar Mesa
            </Button>
            <Button
              variant="outline"
              className="bg-white text-pizza-texto border-pizza-naranja/30 hover:bg-pizza-naranja/10 rounded-full px-8 py-6 text-lg font-bold transition-all hover:scale-105"
            >
              Pedir a Domicilio
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
