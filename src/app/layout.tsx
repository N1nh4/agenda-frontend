"use client";

import "./globals.css";

import { UsuarioContextoProvider } from "@/data/context/UsuarioContexto";

export default function RootLayout({ children }: { children: React.ReactNode }) {

  return (
    <html lang="pt-BR">
      <body className="antialiased">
        <UsuarioContextoProvider>
          {children}
        </UsuarioContextoProvider>
      </body>
    </html>
  );
}