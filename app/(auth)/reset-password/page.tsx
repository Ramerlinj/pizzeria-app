"use client";

import { Suspense, useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import Image from "next/image";
import { Lock } from "lucide-react";
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
import { resetPassword } from "@/lib/auth-api";

const resetSchema = z
  .object({
    password: z.string().min(6, "Mínimo 6 caracteres"),
    password_confirmation: z.string().min(6, "Mínimo 6 caracteres"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Las contraseñas no coinciden",
    path: ["password_confirmation"],
  });

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <ResetPasswordContent />
    </Suspense>
  );
}

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const presetEmail = searchParams.get("email") || "";
  const presetToken = searchParams.get("token") || "";
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof resetSchema>>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      password: "",
      password_confirmation: "",
    },
  });

  const missingLinkData = useMemo(
    () => !presetEmail || !presetToken,
    [presetEmail, presetToken]
  );

  const onSubmit = async (values: z.infer<typeof resetSchema>) => {
    if (!presetEmail || !presetToken) {
      toast.error("Link de recuperación inválido o incompleto");
      return;
    }
    setIsLoading(true);
    try {
      await resetPassword({
        ...values,
        email: presetEmail,
        token: presetToken,
      });
      toast.success("Contraseña actualizada. Inicia sesión.");
      router.push("/login");
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudo restablecer la contraseña";
      console.error(error);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full">
      <div className="flex w-full flex-col justify-center px-8 py-12 md:w-1/2 lg:px-16 xl:px-24 bg-white">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8">
            <h1 className="mb-2 text-4xl font-bold text-gray-900 font-heading">
              Restablecer contraseña
            </h1>
            <p className="text-gray-600">
              Usa el token enviado a tu correo para crear una nueva contraseña.
            </p>
          </div>

          {missingLinkData && (
            <p className="mb-4 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800 border border-amber-200">
              No se detectó token o email en el enlace. Revisa el correo de
              recuperación.
            </p>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-wider text-gray-500">
                      NUEVA CONTRASEÑA
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="password"
                          placeholder="••••••"
                          className="pl-4 pr-10 py-6 rounded-full border-gray-200 bg-gray-50 focus:bg-white transition-colors"
                          {...field}
                        />
                        <Lock className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
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
                          type="password"
                          placeholder="••••••"
                          className="pl-4 pr-10 py-6 rounded-full border-gray-200 bg-gray-50 focus:bg-white transition-colors"
                          {...field}
                        />
                        <Lock className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-full bg-pizza-naranja py-6 text-lg font-bold text-white hover:bg-pizza-naranja/90 shadow-lg shadow-pizza-naranja/20"
              >
                {isLoading ? "Restableciendo..." : "Guardar nueva contraseña"}
              </Button>
            </form>
          </Form>

          <div className="mt-8 text-center text-sm text-gray-500">
            ¿Recordaste tu contraseña?{" "}
            <Link
              href="/login"
              className="font-bold text-pizza-naranja hover:underline"
            >
              Inicia sesión
            </Link>
          </div>
        </div>
      </div>

      <div className="hidden w-1/2 bg-gray-900 md:block relative overflow-hidden">
        <Image
          src="/pizzas/pizza-home-4.webp"
          alt="Pizzería"
          fill
          className="object-cover opacity-90"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
      </div>
    </div>
  );
}
