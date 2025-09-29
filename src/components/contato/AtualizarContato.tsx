import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Contato } from "@/core/contato";
import { atualizarContatoService } from "@/service/contato";
import { Delete } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

interface Props {
    contato: Contato
    botaoEditar: React.ReactNode
    buscarContatos: () => void
}

export default function AtualizarContato({ botaoEditar, contato, buscarContatos }: Props) {

    const [nome, setNome] = useState<string>(contato.nome);
    const [telefone, setTelefone] = useState<string>(contato.telefone);
    const [openDialog, setOpenDialog] = useState<boolean>(false);


    async function atualizarContato() {
        const resposta = await atualizarContatoService(contato?.id, nome, telefone);

        if (resposta !== 200) {
            toast.error('Não foi possível atualizar o contato')
        }

        toast.success('Contato atualizado com sucesso!')
        setOpenDialog(false)
        buscarContatos()
        
    }

    return (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
                {botaoEditar}
            </DialogTrigger>

            <DialogContent className="flex flex-col gap-4">
                <DialogHeader>
                    <DialogTitle>Editar Contato</DialogTitle>
                    <DialogDescription>Atualize os dados do contato</DialogDescription>
                </DialogHeader>

                <form className="flex flex-col gap-3 px-4">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="nome">Nome:</label>
                        <input
                            id="nome"
                            className="border-2 border-gray-300 rounded-md h-11 w-full px-3"
                            type="text"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-2 relative">
                        <label htmlFor="tel">Telefone:</label>
                        <input
                            id="tel"
                            className="border-2 border-gray-300 rounded-md h-11 w-full px-3"
                            type="number"
                            value={telefone}
                            onChange={(e) => setTelefone(e.target.value)}
                        />

                        <button className="absolute top-[44px] right-4 hover:cursor-pointer bg-white pl-2" onClick={(e) => { e.preventDefault(); setTelefone(telefone.slice(0, -1)); }}>
                            <Delete size={20} />
                        </button>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mx-auto mt-5">
                        {["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"].map((item, index) => (
                            <div
                                key={index}
                                className="flex justify-center items-center text-2xl text-center w-28 h-16 border-2 border-gray-300 rounded-md hover:cursor-pointer active:scale-95"
                                onClick={() => setTelefone(telefone + item)}
                            >
                                {item}
                            </div>
                        ))}
                    </div>

                </form>

                <div className="flex flex-col gap-2 mt-4">
                    <Button onClick={atualizarContato} className="w-full hover:cursor-pointer" type="submit">Salvar</Button>

                    <DialogClose asChild>
                        <Button className="w-full hover:cursor-pointer" variant={"outline"}>
                            Cancelar
                        </Button>
                    </DialogClose>
                </div>

            </DialogContent>
        </Dialog>
    )
}