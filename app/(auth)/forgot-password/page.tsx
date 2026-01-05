"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import Image from "next/image";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";

const forgotPasswordSchema = z.object({
  email: z.string().email("Email inválido"),
});

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof forgotPasswordSchema>) {
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success("Si el email existe, recibirás instrucciones.");
    setLoading(false);
  }

  return (
    <div className="flex min-h-screen w-full">
      {/* Left Side - Form */}
      <div className="flex w-full flex-col justify-center px-8 py-12 md:w-1/2 lg:px-16 xl:px-24 bg-white">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8">
            <h1 className="mb-2 text-4xl font-bold text-gray-900 font-heading">
              ¿Olvidaste tu contraseña?
            </h1>
            <p className="text-gray-600">
              Ingresa tu correo electrónico y te enviaremos un enlace para
              restablecer tu contraseña.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-wider text-gray-500">
                      CORREO ELECTRÓNICO
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="mario@example.com"
                          className="pl-4 pr-10 py-6 rounded-full border-gray-200 bg-gray-50 focus:bg-white transition-colors"
                          {...field}
                        />
                        <Mail className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-pizza-naranja py-6 text-lg font-bold text-white hover:bg-pizza-naranja/90 shadow-lg shadow-pizza-naranja/20"
              >
                {loading ? "Enviando..." : "Enviar enlace de recuperación"}
              </Button>
            </form>
          </Form>

          <div className="mt-8 text-center text-sm text-gray-500">
            ¿Recuerdas tu contraseña?{" "}
            <Link
              href="/login"
              className="font-bold text-pizza-naranja hover:underline"
            >
              Inicia Sesión
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden w-1/2 bg-gray-900 md:block relative overflow-hidden">
        <Image
          src="/pizzas/pizza-home-3.webp" // Using existing image
          alt="Delicious Pizza"
          fill
          className="object-cover opacity-90"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
      </div>
    </div>
  );
}
