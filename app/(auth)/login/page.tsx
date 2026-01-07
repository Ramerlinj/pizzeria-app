"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail } from "lucide-react";
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
import { login, setToken } from "@/lib/auth-api";
import { useAuth } from "@/components/providers/auth-provider";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "La contraseña es requerida"),
});

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { refreshUser } = useAuth();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setLoading(true);
    try {
      const data = await login(values);
      setToken(data.access_token);
      await refreshUser();
      toast.success("Bienvenido de nuevo!");
      router.push("/"); // Redirect to home or dashboard
    } catch (error:any) {
      toast.error(error?.message || "Credenciales inválidas");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen w-full">
      {/* Left Side - Form */}
      <div className="flex w-full flex-col justify-center px-8 py-12 md:w-1/2 lg:px-16 xl:px-24 bg-white">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8">
            <h1 className="mb-2 text-4xl font-bold text-gray-900 font-heading">
              Bienvenido de nuevo
            </h1>
            <p className="text-gray-600">
              ¿Listo para pedir tu pizza favorita?
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

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-xs font-bold uppercase tracking-wider text-gray-500">
                        CONTRASEÑA
                      </FormLabel>
                      <Link
                        href="/forgot-password"
                        className="text-xs font-bold text-pizza-naranja hover:underline"
                      >
                        ¿Olvidaste tu contraseña?
                      </Link>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Ingresa tu contraseña"
                          className="pl-4 pr-10 py-6 rounded-full border-gray-200 bg-gray-50 focus:bg-white transition-colors"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
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
                {loading ? "Iniciando sesión..." : "Iniciar Sesión →"}
              </Button>
            </form>
          </Form>

          <div className="mt-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-sm text-gray-400">O continúa con</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="rounded-full py-6 border-gray-200 hover:bg-gray-50"
              type="button"
            >
              <span className="mr-2">G</span> Google
            </Button>
            <Button
              variant="outline"
              className="rounded-full py-6 border-gray-200 hover:bg-gray-50"
              type="button"
            >
              <span className="mr-2">f</span> Facebook
            </Button>
          </div>

          <div className="mt-8 text-center text-sm text-gray-500">
            ¿No tienes una cuenta?{" "}
            <Link
              href="/register"
              className="font-bold text-pizza-naranja hover:underline"
            >
              Regístrate
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden w-1/2 bg-gray-900 md:block relative overflow-hidden">
        <Image
          src="/pizzas/pizza-home-1.webp" // Using existing image
          alt="Delicious Pizza"
          fill
          className="object-cover opacity-90"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-12 left-12 right-12 text-white">
          <div className="mb-4 flex gap-1">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-yellow-400 text-xl">
                ★
              </span>
            ))}
          </div>
          <p className="text-2xl font-bold font-heading leading-tight mb-2">
            "La mejor pizza que he probado en mi vida!"
          </p>
          <p className="text-sm opacity-80">Amada por más de 10,000 amantes de la pizza</p>
        </div>
      </div>
    </div>
  );
}
