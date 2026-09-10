"use client";

import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { requestPasswordReset } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function RecuperarPage() {
  const params = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  // El callback manda acá con ?error=enlace cuando el link venció o ya se usó.
  const enlaceVencido = params.get("error") === "enlace";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await requestPasswordReset(email);
      if (result.error) {
        setError(result.error);
      } else {
        setSent(true);
      }
    });
  };

  if (sent) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Revisá tu correo</CardTitle>
          <CardDescription>
            Si existe una cuenta con ese correo, te enviamos un link para restablecer tu
            contraseña. Puede tardar unos minutos.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Link href="/login" className="text-sm underline text-muted-foreground hover:text-foreground">
            Volver al inicio de sesión
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recuperar contraseña</CardTitle>
        <CardDescription>
          Ingresá tu correo y te enviamos un link para crear una nueva contraseña.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {enlaceVencido && (
          <p className="mb-4 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            Ese enlace ya venció o se usó. Pedí uno nuevo acá abajo.
          </p>
        )}
        <form id="recuperar-form" onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="nombre@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {error && (
            <p className="text-sm text-destructive rounded-md bg-destructive/10 px-3 py-2">
              {error}
            </p>
          )}
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button type="submit" form="recuperar-form" className="w-full" disabled={isPending}>
          {isPending ? "Enviando…" : "Enviar link"}
        </Button>
        <Link href="/login" className="text-sm underline text-muted-foreground hover:text-foreground">
          Volver al inicio de sesión
        </Link>
      </CardFooter>
    </Card>
  );
}
