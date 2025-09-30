'use client'

import { useContext } from "react";
import { UsuarioContexto } from "../context/UsuarioContexto";

// Hook para acessar o contexto do usuário
export default function useUsuario() {
  const context = useContext(UsuarioContexto);

  if (!context) {
    throw new Error(
      "useUsuario deve ser usado dentro de UsuarioContextoProvider"
    );
  }

  return context;
}
