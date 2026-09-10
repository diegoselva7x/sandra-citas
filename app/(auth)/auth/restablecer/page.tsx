"use client";

import { useEffect, useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import { updatePassword } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function RestablecerPage() {
  const [isPending, startTransition] = useTransition();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [preparando, setPreparando] = useState(true);

  // Supabase puede devolver la sesión de dos formas. Con el flujo PKCE llega
  // como ?code= y ya la canjeó /auth/callback antes de traernos acá. Con el
  // flujo implícito llega en el fragmento (#access_token=…), que nunca viaja al
  // servidor: hay que leerlo del lado del cliente o el formulario se envía sin
  // sesión y updateUser falla.
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash.includes("access_token")) {
      setPreparando(false);
      return;
    }

    const params = new URLSearchParams(hash.slice(1));
    const access_token = params.get("access_token");
    const refresh_token = params.get("refresh_token");

    if (!access_token || !refresh_token) {
      setPreparando(false);
      return;
    }

    createClient()
      .auth.setSession({ access_token, refresh_token })
      .then(({ error }) => {
        if (error) setError("El enlace expiró o ya se usó. Pedí uno nuevo.");
        // Se limpia el token de la barra de direcciones.
        window.history.replaceState(null, "", window.location.pathname);
      })
      .finally(() => setPreparando(false));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    startTransition(async () => {
      const result = await updatePassword(password);
      if (result?.error) {
        setError(result.error);
      }
      // Si no hay error, la action hace redirect() a /mi-cuenta automáticamente.
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nueva contraseña</CardTitle>
        <CardDescription>Elegí una contraseña nueva para tu cuenta.</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="restablecer-form" onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="password">Nueva contraseña</Label>
            <PasswordInput
              id="password"
              autoComplete="new-password"
              placeholder="Mínimo 8 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="confirm">Confirmá la contraseña</Label>
            <PasswordInput
              id="confirm"
              autoComplete="new-password"
              placeholder="Repetí tu nueva contraseña"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
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
      <CardFooter>
        <Button
          type="submit"
          form="restablecer-form"
          className="w-full"
          disabled={isPending || preparando}
        >
          {preparando ? "Verificando el enlace…" : isPending ? "Guardando…" : "Guardar contraseña"}
        </Button>
      </CardFooter>
    </Card>
  );
}
