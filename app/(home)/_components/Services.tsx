"use client";

import { services } from "@/data/services";

export const Services = () => {
  return (
    <section className="container mx-auto px-10 py-8 mb-20">
      <div className="mb-8 flex items-center justify-center">
        <span className="tracking-wider text-pizza-rojo text-xl border-r border-pizza-rojo mr-5 px-4 inline-block uppercase">¿Por qué elegirnos?</span>
        <h2 className="font-bbh text-5xl inline-block">SOmos calidad</h2>
      </div>
      
      <div className="grid grid-cols-2 gap-x-10">
        {services.map((service) => (
          <div
            key={service.id}
            className="flex flex-col text-center group border border-x-transparent hover:scale-100 transition-all hover:shadow-md duration-400 ease-in-out"
          >
            <div className="flex items-center">
              <div className="border-r-2 p-12 flex">
                {service.icon && (
                  <service.icon className="stroke-1 size-12 group-hover:scale-105 transition-all duration-400" />
                )}
              </div>
              <div className=" ml-10 text-left space-y-2">
                <h3 className="text-2xl font-heading">{service.title}</h3>
                <p className="text-ms  text-slate-600">{service.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
