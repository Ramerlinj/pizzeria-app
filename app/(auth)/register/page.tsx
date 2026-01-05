"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, User } from "lucide-react";
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
import { register, setToken } from "@/lib/auth-api";
import { useAuth } from "@/components/providers/auth-provider";

const registerSchema = z
  .object({
    name: z.string().min(2, "El nombre es requerido"),
    surname: z.string().min(2, "El apellido es requerido"),
    email: z.string().email("Email inválido"),
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres"),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Las contraseñas no coinciden",
    path: ["password_confirmation"],
  });

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { refreshUser } = useAuth();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      surname: "",
      email: "",
      password: "",
      password_confirmation: "",
    },
  });

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    setLoading(true);
    try {
      const data = await register(values);
      setToken(data.access_token);
      await refreshUser();
      toast.success("Cuenta creada exitosamente!");
      router.push("/");
    } catch (error: any) {
      toast.error(error.message || "Error al registrarse");
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
              Únete a <span className="text-pizza-naranja">Slice Life</span>
            </h1>
            <p className="text-gray-600">
              Regístrate para seguir tus pedidos, ganar recompensas y guardar
              tus pizzas favoritas.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-wider text-gray-500">
                      NOMBRE COMPLETO
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Mario"
                          className="pl-4 pr-10 py-6 rounded-full border-gray-200 bg-gray-50 focus:bg-white transition-colors"
                          {...field}
                        />
                        <User className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="surname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-wider text-gray-500">
                      APELLIDO
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Rossi"
                          className="pl-4 pr-10 py-6 rounded-full border-gray-200 bg-gray-50 focus:bg-white transition-colors"
                          {...field}
                        />
                        <User className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                    <FormLabel className="text-xs font-bold uppercase tracking-wider text-gray-500">
                      CONTRASEÑA
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Crea una contraseña segura"
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

              <FormField
                control={form.control}
                name="password_confirmation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-wider text-gray-500">
                      CONFIRMAR CONTRASEÑA
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Confirma tu contraseña"
                          className="pl-4 pr-10 py-6 rounded-full border-gray-200 bg-gray-50 focus:bg-white transition-colors"
                          {...field}
                        />
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
                {loading ? "Creando cuenta..." : "Crear Cuenta"}
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
            ¿Ya tienes una cuenta?{" "}
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
          src="/pizzas/pizza-home-2.webp" // Using existing image
          alt="Delicious Pizza"
          fill
          className="object-cover opacity-90"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-12 left-12 right-12">
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
            <div className="mb-4 flex gap-1">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-yellow-400 text-xl">
                  ★
                </span>
              ))}
            </div>
            <p className="text-xl font-bold text-white font-heading leading-tight mb-2">
              "La mejor pizza que he probado en mi vida!"
            </p>
            <p className="text-sm text-white/80">— Happy Customer</p>
          </div>
        </div>
      </div>
    </div>
  );
}
