"use client";

import { Toaster } from "sonner";
import CriarAgenda from "../components/agenda/CriarAgenda";
import EntrarAgenda from "../components/agenda/EntrarAgenda";

export default function Inicio() {

  return (
    <div>
      <Toaster richColors position="top-right" toastOptions={{ duration: 2500 }} />
      <div className="flex h-screen flex-col justify-start pt-52 gap-6 bg-gradient-to-b from-indigo-900 to-purple-900 px-36">
        <div className="flex flex-col gap-2">
          <h1 className="text-6xl font-bold text-white">Bem-vindo ao nosso sistema de agenda!</h1>
          <p className="text-white text-xl w-xl">
            Sistema de Agendamento, desenvolvido por Alana Abreu, Rafael Argolo e Mateus Oliveira, como parte das atividades da disciplina de Engenharia de Software.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <CriarAgenda />
          <EntrarAgenda />
        </div>

      </div>
    </div>
  );
}
