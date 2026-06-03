"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle } from "lucide-react";

interface ContactFormProps {
  contactEmail: string | null;
}

export default function ContactForm({ contactEmail }: ContactFormProps) {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [enviado, setEnviado] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const to = contactEmail ?? "";
    const subject = encodeURIComponent(`Consulta de ${nombre}`);
    const body = encodeURIComponent(`Nombre: ${nombre}\nEmail: ${email}\n\n${mensaje}`);

    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
    setEnviado(true);
  }

  if (enviado) {
    return (
      <div className="rounded-xl border bg-card p-8 text-center space-y-3">
        <CheckCircle className="w-10 h-10 text-primary mx-auto" />
        <p className="font-medium">¡Gracias por escribir!</p>
        <p className="text-sm text-muted-foreground">
          Se abrió tu cliente de correo con el mensaje listo para enviar.
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setNombre("");
            setEmail("");
            setMensaje("");
            setEnviado(false);
          }}
        >
          Enviar otro mensaje
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="nombre">Nombre</Label>
        <Input
          id="nombre"
          type="text"
          placeholder="Tu nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="tu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="mensaje">Mensaje</Label>
        <Textarea
          id="mensaje"
          placeholder="¿En qué te puedo ayudar?"
          rows={5}
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          required
        />
      </div>

      <Button type="submit" className="w-full" disabled={!contactEmail}>
        Enviar mensaje
      </Button>

      {!contactEmail && (
        <p className="text-xs text-muted-foreground text-center">
          El formulario estará disponible en breve.
        </p>
      )}
    </form>
  );
}
