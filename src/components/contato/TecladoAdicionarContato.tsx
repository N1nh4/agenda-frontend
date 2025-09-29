'use client'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Delete, Plus } from "lucide-react";
import { useState } from "react";
import AdicionarContato from "./AdicionarContato";
import { Button } from "@/components/ui/button";

interface Props {
    buscarContatos: () => Promise<void>
    botaoAdicionarContato?: React.ReactNode
}

export default function TecladoAdicionarContato({ buscarContatos, botaoAdicionarContato }: Props) {

    const [nome, setNome] = useState<string>("");
    const [numero, setNumero] = useState<string>("");
    const [openDialog, setOpenDialog] = useState<boolean>(false);

    function limparCampos() {
        setNome("")
        setNumero("")
    }

    function adicionarNumeroFormatado(digito: string) {
    let valor = numero.replace(/\D/g, "") + digito; // junta e remove tudo que não é número
    if (valor.length <= 2) {
    valor = `(${valor}`;
  } else if (valor.length <= 7) {
    valor = `(${valor.slice(0, 2)}) ${valor.slice(2)}`;
  } else if (valor.length <= 11) {
    valor = `(${valor.slice(0, 2)}) ${valor.slice(2, 7)}-${valor.slice(7)}`;
  } else {
    valor = `(${valor.slice(0, 2)}) ${valor.slice(2, 7)}-${valor.slice(7, 11)}`;
  }

  setNumero(valor);
}


    return (
        <Dialog open={openDialog} onOpenChange={setOpenDialog} >
            <DialogTrigger asChild>
                {
                    botaoAdicionarContato
                        ? botaoAdicionarContato
                        : (
                            <div
                                className="
                                    w-24 h-24 rounded-full flex justify-center items-center group hover:scale-110 transition-transform duration-500 hover:cursor-pointer active:scale-100
                                "
                                style={{ boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)" }}
                            >
                                <Plus
                                    color="green"
                                    size={40}
                                    className="transform transition-transform duration-500 group-hover:rotate-[360deg] group-hover:scale-150"
                                />
                            </div>
                        )
                }
            </DialogTrigger>

            <DialogContent onCloseAutoFocus={limparCampos} className="flex flex-col gap-8">
                <DialogHeader>
                    <DialogTitle>Novo contato</DialogTitle>
                    <DialogDescription>Adicione um novo contato</DialogDescription>
                </DialogHeader>

                <div className="relative">
                   
                    <input
                        className="border-2 border-gray-300 rounded-md h-11 w-full px-5"
                        type="tel"
                        value={numero}
                        onChange={(e) => {
                            let valor = e.target.value.replace(/\D/g, ""); // remove tudo que não é número
                            if (valor.length <= 2) {
                                // Apenas DDD
                                valor = `(${valor}`;
                            } else if (valor.length <= 7) {
                                // DDD + primeiros dígitos
                                valor = `(${valor.slice(0, 2)}) ${valor.slice(2)}`;
                            } else if (valor.length <= 11) {
                                // DDD + celular completo
                                valor = `(${valor.slice(0, 2)}) ${valor.slice(2, 7)}-${valor.slice(7)}`;
                            } else {
                                // Limita a 11 dígitos
                                valor = `(${valor.slice(0, 2)}) ${valor.slice(2, 7)}-${valor.slice(7, 11)}`;
                            }

                            setNumero(valor);
                            }}
                    />
                    <button className="absolute top-3 right-4 hover:cursor-pointer bg-white pl-2" onClick={() => setNumero((prev) => prev.slice(0, -1))}>
                        <Delete size={20} />
                    </button>
                </div>

                {numero.length > 0 && (
                    <AdicionarContato nome={nome} setNome={setNome} telefone={numero} setTelefone={setNumero} setOpenDialog={setOpenDialog} buscarContatos={buscarContatos} />
                )}
                <div className="grid grid-cols-3 gap-2 mx-auto">
                    {["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"].map((item, index) => (
                        <div
                            key={index}
                            className="flex justify-center items-center text-2xl text-center w-28 h-16 border-2 border-gray-300 rounded-md hover:cursor-pointer active:scale-95"
                            onClick={() => adicionarNumeroFormatado(item)}
                        >
                            {item}
                        </div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    )
}