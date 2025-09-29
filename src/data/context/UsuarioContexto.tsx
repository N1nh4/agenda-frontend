'use client'

import { Usuario } from "@/core";
import { createContext, useEffect, useState } from "react";

export interface UsuarioContextoProps {
    usuario: Usuario | null
}

export const UsuarioContexto = createContext<UsuarioContextoProps | undefined>({
    usuario: {} as Usuario
});

export const UsuarioContextoProvider = ({ children }: { children: React.ReactNode}) => {

    const [usuario, setUsuario] = useState<Usuario>({
        id: "",
        idAgenda: "",
        nome: "",
        email: "",
        telefone: "",
        tipoAgenda: "",
        imagemUrl: ""
    });

    async function info() {
        try {
            const resposta = await fetch('${process.env.NEXT_PUBLIC_API_URL}/auth/me', { credentials: "include" });
            if (!resposta.ok) return; // se não estiver logado
            const json = await resposta.json();

            console.log("usuario", json);

            setUsuario({
                id: json.id,
                idAgenda: json.idAgenda,
                nome: json.nome,
                email: json.email,
                telefone: json.telefone,
                tipoAgenda: json.tipoAgenda,
                imagemUrl: json.imagemUrl
            });
        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        info();
    }, []);

    return (
        <UsuarioContexto.Provider value={{ usuario }}>
            {children}
        </UsuarioContexto.Provider>
    );
}
