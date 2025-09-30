"use client";

import "../../globals.css";
import Calendario from "@/components/Calendario";
import { UsuarioContextoProvider } from "@/data/context/UsuarioContexto";
import { useEffect, useState } from "react";
import { getContatosService } from "@/service/contato";
import { Contato } from "@/core/contato";
import { User, Mail, Phone, Users, LoaderIcon, ImageUpIcon } from "lucide-react";
import useUsuario from "@/data/hook/useUsuario";
import { toast } from "sonner";
import { buscarImagemUsuarioService, enviarFotoUsuario } from "@/service/usuario";

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <UsuarioContextoProvider>
      <LayoutInterno>{children}</LayoutInterno>
    </UsuarioContextoProvider>
  );
}

function LayoutInterno({ children }: { children: React.ReactNode }) {
  const { usuario } = useUsuario()
  const [contatos, setContatos] = useState<Contato[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [imagemUsuario, setImagemUsuario] = useState<string | undefined>("");

  async function buscar() {
    setLoading(true);
    try {
      const resposta = await getContatosService(usuario?.idAgenda);
      if (!resposta) {
        toast.error("Não foi possível buscar os contatos");
        setContatos([]);
      } else {
        setContatos(resposta);
      }
    } catch (err) {
      toast.error("Erro ao buscar contatos");
      setContatos([]);
    } finally {
      setLoading(false);
    }
  }

  async function enviarImagemPerfil(file: File) {
    if (!usuario) return;
    enviarFotoUsuario(file)
  }

  async function buscarImagemUsuario() {
    if (!usuario) return;
    const imagemUsuario = await buscarImagemUsuarioService(usuario.imagemUrl);
    setImagemUsuario(imagemUsuario);
  }
  
  // Buscar contatos quando usuário estiver carregado
  useEffect(() => {
    if (!usuario) return;
    buscar();
    buscarImagemUsuario();
  }, [usuario]);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="flex flex-col min-w-[300px] z-10 bg-gradient-to-b from-indigo-600 to-indigo-400 p-6 gap-6 shadow-lg">
        <h1 className="text-3xl font-bold text-white mb-2 tracking-wide">Minha Agenda</h1>

        {/* Usuário */}
        <div className="flex flex-col items-center mb-4">
          <div>
            <div title={`${usuario?.imagemUrl == "" ? "Foto de perfil" : "Alterar foto de perfil"}`} className="relative group hover:cursor-pointer h-48 w-48 rounded-full hover:bg-gray-600/30 bg-white shadow-lg flex items-center justify-center mb-2 overflow-hidden border-4 border-indigo-300">
              {
                usuario?.imagemUrl ? (
                  <img
                    src={imagemUsuario}
                    alt="Foto de perfil"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={80} className="text-indigo-400" />
                )
              }
              <div className="hidden absolute group-hover:block rounded-full w-fit h-fit">

                {/* input escondido */}
                <input
                  id="upload"               // precisa de um id para o label associar
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      enviarImagemPerfil(e.target.files[0]);
                    }
                  }}
                />

                {/* label age como botão */}
                <label
                  htmlFor="upload"
                  className="
                    cursor-pointer 
                    flex items-center justify-center
                    w-20 h-20 rounded-full bg-gray-600/40 
                    hover:bg-gray-400/60 transition
                  "
                >
                  <ImageUpIcon
                    size={32}
                    color="white"
                    className="text-indigo-400"
                  />
                </label>
              </div>

            </div>

          </div>
          <span className="text-white text-3xl font-semibold">{usuario?.nome || "Usuário"}</span>
        </div>

        {/* Contato e email */}
        <div className="flex flex-col gap-4 px-2">
          <div className="flex items-center gap-2 text-white">
            <Mail size={18} className="opacity-80" />
            <span className="font-medium">
              {usuario?.email ? (
                <p>{usuario.email}</p>
              ) : (
                <LoaderIcon size={18} className="animate-spin" />
              )}
            </span>
          </div>

          <div className="flex items-center gap-2 text-white">
            <Phone size={18} className="opacity-80" />
            <span className="font-medium">
              {usuario?.telefone ? (
                <p>{usuario.telefone}</p>
              ) : (
                <LoaderIcon size={18} className="animate-spin" />
              )}
            </span>
          </div>

          <div className="flex items-center gap-2 bg-indigo-800 rounded-lg px-3 py-2 mt-2 shadow text-white">
            <Users size={18} />
            <span className="font-semibold">Contatos:</span>
            <span className="ml-1">
              {loading ? (
                <LoaderIcon size={18} className="animate-spin" />
              ) :  (
                contatos?.length || 0
              )}
            </span>
          </div>
        </div>

        {/* Calendário */}
        <Calendario />
      </aside>

      {/* Main */}
      <main className="w-full h-screen py-6 overflow-hidden bg-gradient-to-br from-indigo-50 to-amber-50">
        {children}
      </main>
    </div>
  );
}
