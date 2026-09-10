"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/**
 * Campo de contraseña con botón para verla mientras se escribe.
 *
 * Escribir a ciegas una contraseña con mayúsculas y números es de los puntos
 * donde más gente se traba, sobre todo desde el teléfono. El botón no queda
 * dentro del recorrido del tabulador (`tabIndex={-1}`) para no interrumpir a
 * quien navega con teclado.
 */
function PasswordInput({
  className,
  ...props
}: Omit<React.ComponentProps<"input">, "type">) {
  const [visible, setVisible] = React.useState(false);
  const Icono = visible ? EyeOff : Eye;

  return (
    <div className="relative">
      <Input
        type={visible ? "text" : "password"}
        className={cn("pr-10", className)}
        {...props}
      />
      <button
        type="button"
        tabIndex={-1}
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
        aria-pressed={visible}
        title={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
        className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground transition-colors hover:text-foreground"
      >
        <Icono className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}

export { PasswordInput };
