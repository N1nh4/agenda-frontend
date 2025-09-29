'use client'

import { Sheet,SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { salvarContatoService } from "@/service/contato";
import { toast } from "sonner";
import useUsuario from "@/data/hook/useUsuario";

interface Props {
    nome: string;
    setNome: React.Dispatch<React.SetStateAction<string>>;
    telefone: string;
    setTelefone: React.Dispatch<React.SetStateAction<string>>;
    setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
    buscarContatos: () => Promise<void>;
}

export default function AdicionarContato(props: Props) {

    const { usuario } = useUsuario();

    async function salvarContato() {
        if (!usuario) return

        const resposta = await salvarContatoService(usuario?.idAgenda, props.nome, props.telefone);

        if (resposta !== 201) {
            toast.error('Não foi possível salvar o contato')
            return
        } 

        console.log("adiciou contato, resposta: ", resposta)

        props.setOpenDialog(false)
        toast.success('Contato salvo com sucesso!')
        props.buscarContatos()
    }


    return (
        <Sheet>
            <SheetTrigger asChild>
                <div className="flex w-full p-3 rounded-sm items-center gap-2 hover:cursor-pointer hover:bg-gray-200">
                <UserPlus size={18} />
                <p>Novo contato</p>
                </div>
            </SheetTrigger>

            <SheetContent>
                <SheetHeader>
                    <SheetTitle className="text-2xl font-bold">Novo contato</SheetTitle>
                    <SheetDescription className="text-md">Complete os dados do novo contato</SheetDescription>
                </SheetHeader>

                <form className="flex flex-col gap-3 px-4">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="nome">Nome:</label>
                        <input
                            id="nome"
                            className="border-2 border-gray-300 rounded-md h-11 w-full px-3"
                            type="text"
                            defaultValue={props.nome}
                            onChange={(e) => props.setNome(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="tel">Telefone:</label>
                        <input
                            id="tel"
                            className="border-2 border-gray-300 rounded-md h-11 w-full px-3"
                            type="tel"
                            value={props.telefone} // usar value em vez de defaultValue
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

                            props.setTelefone(valor); // atualiza o state com a formatação
                            }}
                        />
                    </div>
                </form>

                <SheetFooter>
                    <Button onClick={salvarContato} className="hover:cursor-pointer" type="submit">Salvar</Button>

                    <SheetClose asChild>
                        <Button className="w-full hover:cursor-pointer" variant={"outline"}>
                            Cancelar
                        </Button>
                    </SheetClose>

                </SheetFooter>

            </SheetContent>
            </Sheet>
    )
}