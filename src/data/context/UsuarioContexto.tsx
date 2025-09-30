'use client'

import { Usuario } from "@/core";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface UsuarioContextoType {
  usuario: Usuario | null;
  token: string | null;
  setUsuarioContext: (usuario: Usuario, token: string) => void;
  logout: () => void;
}

export const UsuarioContexto = createContext<UsuarioContextoType | undefined>(undefined);

export const UsuarioContextoProvider = ({ children }: { children: ReactNode }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Carregar do localStorage ao iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem('usuario');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      setUsuario(JSON.parse(storedUser));
      setToken(storedToken);
    }
  }, []);

  const setUsuarioContext = (usuario: Usuario, token: string) => {
    setUsuario(usuario);
    setToken(token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    localStorage.setItem('token', token);
  };

  const logout = () => {
    setUsuario(null);
    setToken(null);
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
  };

  return (
    <UsuarioContexto.Provider value={{ usuario, token, setUsuarioContext, logout }}>
      {children}
    </UsuarioContexto.Provider>
  );
};

// Hook para acessar o contexto
export default function useUsuario() {
  const context = useContext(UsuarioContexto);
  if (!context) throw new Error("useUsuario deve ser usado dentro de UsuarioContextoProvider");
  return context;
}
