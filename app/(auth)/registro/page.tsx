"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { signUp } from "@/app/booking/actions";
import { signUpSchema, type SignUpInput } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function RegistroPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = (data: SignUpInput) => {
    setServerError(null);
    startTransition(async () => {
      const result = await signUp(data);
      if (result.error) {
        setServerError(result.error);
      } else {
        // Sin paso de verificación: signUp ya dejó la sesión abierta.
        router.push("/reservar");
        router.refresh();
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Crear cuenta</CardTitle>
        <CardDescription>Completá tus datos para registrarte.</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="registro-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="fullName">Nombre completo</Label>
            <Input
              id="fullName"
              type="text"
              autoComplete="name"
              placeholder="María González"
              {...register("fullName")}
            />
            {errors.fullName && (
              <p className="text-sm text-destructive">{errors.fullName.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="nombre@correo.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="phone">Teléfono</Label>
            <Input
              id="phone"
              type="tel"
              autoComplete="tel"
              placeholder="8888-8888"
              {...register("phone")}
            />
            {errors.phone && (
              <p className="text-sm text-destructive">{errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              placeholder="Mínimo 8 caracteres"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>

          <div className="flex items-start gap-3 pt-1">
            <Checkbox
              id="terms"
              checked={termsAccepted}
              onCheckedChange={(v) => setTermsAccepted(v === true)}
            />
            <Label htmlFor="terms" className="text-sm font-normal leading-snug cursor-pointer">
              He leído y acepto la{" "}
              <Link href="/privacidad" target="_blank" className="underline hover:text-primary">
                política de privacidad
              </Link>{" "}
              y los{" "}
              <Link href="/terminos" target="_blank" className="underline hover:text-primary">
                términos de uso
              </Link>
              .
            </Label>
          </div>

          {serverError && (
            <p className="text-sm text-destructive rounded-md bg-destructive/10 px-3 py-2">
              {serverError}
            </p>
          )}
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button type="submit" form="registro-form" className="w-full" disabled={isPending || !termsAccepted}>
          {isPending ? "Creando tu cuenta…" : "Crear cuenta"}
        </Button>
        <p className="text-sm text-muted-foreground text-center">
          ¿Ya tenés cuenta?{" "}
          <Link href="/login" className="underline text-foreground hover:text-primary">
            Ingresá aquí
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
