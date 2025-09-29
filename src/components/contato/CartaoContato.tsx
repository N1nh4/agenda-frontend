import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import AtualizarContato from "./AtualizarContato";
import { Contato } from "@/core/contato";
import { excluirContatoService } from "@/service/contato";
import { toast } from "sonner";

interface Props {
    contato: Contato
    atualizarContatos: () => void
}

export default function CartaoContato({ contato, atualizarContatos }: Props) {

    async function excluirContato() {
        const resposta = await excluirContatoService(contato.id)
        
        if (resposta !== 204) {
            toast.error('Não foi possível excluir o contato')
            return
        }

        toast.success('Contato excluído com sucesso!')
        atualizarContatos()
    }

    return (
        <div
            className="
                flex flex-col gap-2 p-4
                h-[150px] relative
                rounded-md border-2 border-gray-300
            "
        >
            <div className="flex">
                <div className="flex flex-col justify-between gap-4">
                    <p className="text-3xl font-bold">{contato.nome}</p>
                    <p className="">Telefone: {contato.telefone}</p>
                </div>
                
                <div className="flex items-center gap-2 absolute right-3 bottom-3">
                    <AtualizarContato
                        buscarContatos={atualizarContatos}
                        contato={contato}
                        botaoEditar={
                            <Button variant="outline" className="w-8 h-8 hover:bg-sky-500 hover:text-white hover:cursor-pointer" title="Editar contato">
                                <Edit size={10} />
                            </Button>
                        }
                    />

                    <Button onClick={excluirContato} className="w-8 h-8 bg-red-500 hover:bg-red-700 hover:cursor-pointer" title="Excluir contato">
                        <Trash size={10} />
                    </Button>
                </div>
            </div>
        </div>
    )
}