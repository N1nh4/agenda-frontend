'use client'

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import useUsuario from "@/data/hook/useUsuario";
import { criarAgendaService } from "@/service/agenda";
import { criarUsuarioService, logar } from "@/service/usuario";
import { Eye, EyeClosed } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function CriarAgenda() {

    const [tipoAgenda, setTipoAgenda] = useState<string>("LIST");
    const nav = useRouter();

    const { usuario, setUsuario } = useUsuario();
    const [nome, setNome] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [telefone, setTelefone] = useState<string>("");
    const [senha, setSenha] = useState<string>("");
    const [mostrarSenha, setMostrarSenha] = useState<boolean>(false);

    useEffect(() => {
        console.log("🔄 Contexto atualizado:", usuario);
    }, [usuario]);

    async function criarAgendaUsuario() {
        console.log("🚀 Iniciando criação da agenda...");
        const resposta = await criarAgendaService(tipoAgenda)
        console.log("📌 Resposta criarAgendaService:", resposta);

        const codigohttp = resposta?.resposta
        const idAgenda = resposta?.idAgenda

        if (codigohttp !== 201) {
            console.error("❌ Erro ao criar agenda. Código:", codigohttp);
            toast.error('Não foi possível criar a agenda')
            return
        }

        console.log("✅ Agenda criada com sucesso. ID Agenda:", idAgenda);

        const respostaUsuario = await criarUsuarioService(
            nome,
            email,
            telefone,
            idAgenda?.toString(),
            tipoAgenda,
            senha
        )

        console.log("📌 Resposta criarUsuarioService:", respostaUsuario);
        console.log("👤 Usuário antes do setUsuario:", usuario);

        if (respostaUsuario != null && respostaUsuario.id) {
            setUsuario({
                id: respostaUsuario.id,
                idAgenda: respostaUsuario.idAgenda,
                nome: respostaUsuario.nome,
                email: respostaUsuario.email,
                telefone: respostaUsuario.telefone,
                tipoAgenda: respostaUsuario.tipoAgenda,
                imagemUrl: respostaUsuario.imagemUrl ?? ""
            });

            console.log("✅ Usuário setado no contexto:", respostaUsuario);

            toast.success('Agenda criada com sucesso! Redirecionando...')

            console.log("🔑 Tentando logar...");
            const respostaLogar = await logar(respostaUsuario.telefone, senha)
            console.log("📌 Resposta logar:", respostaLogar);

            if (respostaLogar !== 200) {
                console.error("❌ Erro ao logar. Código:", respostaLogar);
                toast.error('Não foi possível logar')
                return
            }

            console.log("➡️ Redirecionando para /minha_agenda ...");
            nav.push('/minha_agenda')
            return
        }

        if (respostaUsuario == 400) {
            console.error("❌ Campos inválidos.");
            toast.error('Preencha todos os campos corretamente')
            return
        }

        console.error("❌ Erro inesperado ao criar usuário.");
        toast.error('Não foi possível criar o usuário')
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
        setTelefone(valor);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <button
                    className="bg-white hover:bg-amber-100 text-indigo-900 h-11 transition-colors mt-4 px-4 w-fit cursor-pointer"
                >
                    Criar agenda
                </button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Criar nova agenda</DialogTitle>
                    <DialogDescription>
                        Preencha os dados abaixo para criar uma nova agenda
                    </DialogDescription>
                </DialogHeader>

                <form className="flex flex-col gap-3 px-4">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="nome">Nome:</label>
                        <input
                            id="nome"
                            placeholder="Nome do usuário"
                            className="border-2 border-gray-300 rounded-md h-11 w-full px-3"
                            type="text"
                            onChange={(e) => setNome(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="email">Email:</label>
                        <input
                            id="email"
                            placeholder="exemplo@email.com"
                            className="border-2 border-gray-300 rounded-md h-11 w-full px-3"
                            type="email"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="tel">Telefone:</label>
                        <input
                            id="tel"
                            placeholder="(99) 99999-9999"
                            className="border-2 border-gray-300 rounded-md h-11 w-full px-3"
                            type="tel"
                            value={telefone}
                            onChange={handleTelefoneChange}
                        />
                    </div>

                    <div className="relative flex flex-col gap-2">
                        <label htmlFor="senha">Senha:</label>
                        <input
                            id="senha"
                            placeholder="Min. 8 caracteres"
                            className="border-2 border-gray-300 rounded-md h-11 w-full px-3"
                            type={mostrarSenha ? "text" : "password"}
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                        />
                        {mostrarSenha ? (
                            <Eye
                                className="absolute hover:cursor-pointer right-4 top-[53px] transform -translate-y-1/2"
                                onClick={() => setMostrarSenha(false)}
                            />
                        ) : (
                            <EyeClosed
                                className="absolute hover:cursor-pointer right-4 top-[53px] transform -translate-y-1/2"
                                onClick={() => setMostrarSenha(true)}
                            />
                        )}
                    </div>

                    <div className="flex flex-col gap-2">
                        <label>Selecione o tipo de agenda</label>
                        <select
                            defaultValue="selecionar"
                            onChange={(e) => setTipoAgenda(e.target.value)}
                            className="border-2 border-gray-300 rounded-md h-11 w-full px-3"
                        >
                            <option disabled value="selecionar">Selecione uma opção</option>
                            <option value="LIST">Agenda Lista</option>
                            <option value="MAP">Agenda Map</option>
                        </select>
                    </div>

                    <Button
                        onClick={(e) => { e.preventDefault(); criarAgendaUsuario() }}
                        className="bg-purple-900 text-white h-11 rounded-md hover:bg-indigo-900 transition-colors mt-4 cursor-pointer"
                    >
                        Criar agenda
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
