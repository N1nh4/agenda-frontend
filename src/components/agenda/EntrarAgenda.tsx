'use client'

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import useUsuario from "@/data/hook/useUsuario";
import { login } from "@/service/agenda";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function EntrarAgenda() {
    const nav = useRouter();
    const [telefone, setTel] = useState<string>("");
    const [senha, setSenha] = useState<string>("");

    const { setUsuarioContext } = useUsuario();

    async function entrarAgenda() {
        try {
            const resposta = await login(telefone, senha); // backend deve retornar { token, usuario }

            if (!resposta || !resposta.token || !resposta.usuario) {
                toast.error('Credenciais inválidas');
                return;
            }

            // salva no contexto e localStorage
            setUsuarioContext(resposta.usuario, resposta.token);

            toast.success('Logando...');
            nav.push('/minha_agenda');
        } catch (error) {
            console.error(error);
            toast.error('Erro ao tentar entrar');
        }
    }

    const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let valor = e.target.value.replace(/\D/g, "");

        if (valor.length > 10) {
            valor = valor.replace(/^(\d{2})(\d{5})(\d{4}).*/, "($1) $2-$3");
        } else if (valor.length > 5) {
            valor = valor.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, "($1) $2-$3");
        } else if (valor.length > 2) {
            valor = valor.replace(/^(\d{2})(\d{0,5})/, "($1) $2");
        }

        setTel(valor);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <button className="bg-white hover:bg-amber-100 text-indigo-900 h-11 transition-colors mt-4 px-4 w-fit cursor-pointer">
                    Entrar na agenda
                </button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Entrar na agenda</DialogTitle>
                    <DialogDescription>Insira os dados abaixo</DialogDescription>
                </DialogHeader>

                <form className="flex flex-col gap-3 px-4">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="tell">Telefone:</label>
                        <input
                            id="tell"
                            value={telefone}
                            placeholder="Telefone"
                            className="border-2 border-gray-300 rounded-md h-11 w-full px-3"
                            type="tel"
                            onChange={handleTelefoneChange}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="senha">Senha</label>
                        <input
                            id="senha"
                            placeholder="Senha"
                            className="border-2 border-gray-300 rounded-md h-11 w-full px-3"
                            type="password"
                            onChange={(e) => setSenha(e.target.value)}
                        />
                    </div>

                    <Button
                        onClick={(e) => { e.preventDefault(); entrarAgenda(); }}
                        className="bg-purple-900 text-white h-11 rounded-md hover:bg-indigo-900 transition-colors mt-4 cursor-pointer"
                    >
                        Entrar
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
