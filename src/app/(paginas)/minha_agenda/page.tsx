'use client'

import { Contato } from "@/core/contato";
import { buscarContatosPorIdsService, deletarContatosPorIdsService, getContatosService } from "@/service/contato";
import { Edit, LogOut, Search, Trash, TrashIcon, UserPlus, View } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import CartaoContato from "../../../components/contato/CartaoContato";
import TecladoAdicionarContato from "../../../components/contato/TecladoAdicionarContato";
import { Button } from "@/components/ui/button";
import { logout } from "@/service/usuario";
import useUsuario from "@/data/hook/useUsuario";
import { listarAnotacoesService, salvarAnotacaoService, atualizarAnotacaoService, deletarAnotacaoService } from "@/service/anotacao";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function Home() {
  const [contatos, setContatos] = useState<Contato[]>([]);
  const [loading, setLoading] = useState(false);
  const [anotacao, setAnotacao] = useState("");
  const [anotacaoSelecionada, setAnotacaoSelecionada] = useState<string | null>(null);
  const [titulo, setTitulo] = useState("");
  const [modoEdicao, setModoEdicao] = useState(false);
  const [anotacoes, setAnotacoes] = useState<{id: string, titulo: string, conteudo: string, createdAt: string}[]>([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [anotacaoModal, setAnotacaoModal] = useState<{titulo: string, conteudo: string} | null>(null);

  const [resultadoBusca, setResultadoBusca] = useState<Contato[]>([]);
  const [busca, setBusca] = useState("");

  const router = useRouter();
  const { usuario } = useUsuario();

  async function buscarContatos() {
    setLoading(true);
    const resposta = await getContatosService(usuario?.idAgenda);

    if (resposta === undefined) {
      toast.error('Não foi possível buscar os contatos');
      setLoading(false);
      return;
    }

    setContatos(resposta);
    setLoading(false);
  }

  async function buscarContatosPorNome(valorBusca: string) {
    if (!usuario?.idAgenda || !busca.trim()){

      buscarContatos();
      return;
    }

    try {
      const resposta = await buscarContatosPorIdsService(valorBusca);
   
      if (!resposta) {
        toast.error('Não foi possível buscar os contatos');
        return;
      }

      setContatos(resposta); 
    } catch (error) {
      toast.error('Erro ao buscar contatos');
    }
  }

  async function deletarTodosContatosMostrados() {
    if (contatos.length === 0) {
      toast.error("Nenhum contato para deletar.");
      return;
    }

    const ids = contatos.map(c => Number(c.id));
    const resposta = await deletarContatosPorIdsService(ids);

    if (resposta === 200) {
      toast.success("Contatos deletados com sucesso!");
      buscarContatos();
    } else {
      toast.error("Erro ao deletar contatos.");
    }

  }

  async function carregarAnotacoes() {
    const lista = await listarAnotacoesService(usuario?.idAgenda);
    setAnotacoes(lista);
  }

  useEffect(() => {
    if (usuario?.idAgenda) {
      buscarContatos();
      carregarAnotacoes();
    }
  }, [usuario]);

  async function handleSalvarAnotacao() {
    if (!titulo.trim() || !anotacao.trim()) {
      toast.error("Preencha o título e o conteúdo.");
      return;
    }

    if (modoEdicao && anotacaoSelecionada) {
      // Atualizar anotação existente
      const resposta = await atualizarAnotacaoService(anotacaoSelecionada, titulo, anotacao);
      if (!resposta) {
        toast.error('Não foi possível atualizar a anotação');
        return;
      }
      toast.success('Anotação atualizada!');
    } else {
      // Criar nova anotação
      const resposta = await salvarAnotacaoService(usuario?.idAgenda, titulo, anotacao);
      if (resposta !== 201) {
        toast.error('Não foi possível salvar a anotação');
        return;
      }
      toast.success('Anotação salva!');
    }

    setTitulo("");
    setAnotacao("");
    setModoEdicao(false);
    setAnotacaoSelecionada(null);
    carregarAnotacoes();
  }

  async function handleDeletarAnotacao(id: string) {
    const ok = await deletarAnotacaoService(id);
    if (ok) {
      toast.success("Anotação deletada!");
      carregarAnotacoes();
      if (anotacaoSelecionada === id) {
        setTitulo("");
        setAnotacao("");
        setModoEdicao(false);
        setAnotacaoSelecionada(null);
      }
    } else {
      toast.error("Erro ao deletar anotação.");
    }
  }

  function handleEditarAnotacao(item: {id: string, titulo: string, conteudo: string}) {
    setTitulo(item.titulo);
    setAnotacao(item.conteudo);
    setAnotacaoSelecionada(item.id);
    setModoEdicao(true);
  }

  function handleCancelarEdicao() {
    setTitulo("");
    setAnotacao("");
    setModoEdicao(false);
    setAnotacaoSelecionada(null);
  }

  function abrirModalAnotacao(item: {titulo: string, conteudo: string}) {
    setAnotacaoModal(item);
    setModalAberto(true);
  }

  function fecharModalAnotacao() {
    setModalAberto(false);
    setAnotacaoModal(null);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-amber-50">
      {/* Cabeçalho */}
      <header className="w-full bg-indigo-700 text-white flex items-center justify-between px-8 py-4 shadow-md fixed top-0 z-10">
        <h1 className="text-2xl font-bold">Minha Agenda</h1>
      </header>

      <div className="absolute top-3 right-4 z-20">
        <Button
          onClick={() => {
            usuario!.id = "";
            usuario!.idAgenda = "";
            usuario!.nome = "";
            usuario!.email = "";
            usuario!.telefone = "";
            usuario!.tipoAgenda = "";
            toast.success('Saindo...')
            logout()
            router.push('/')
          }}
          className="bg-indigo-500 hover:cursor-pointer"
        >
          <LogOut/>
          Sair
        </Button>
      </div>

      {/* Conteúdo principal */}
      <main className="flex flex-col xl:flex-row pt-24 px-6 gap-8">
        {/* Lista de contatos */}
        <section className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-indigo-900">Contatos</h2>
            <TecladoAdicionarContato
              botaoAdicionarContato={
                <span
                  className="bg-indigo-800  text-white font-semibold px-4 py-2 rounded-lg shadow flex items-center gap-2 cursor-pointer transition-all duration-200"
                  tabIndex={0}
                  role="button"
                >
                  <UserPlus size={20} />
                  Adicionar contato
                </span>
              }
              buscarContatos={buscarContatos}
            />
          </div>

          <div className="mb-4 gap-2 flex flex-col">
           
            <input 
              type="text"
              placeholder="Buscar contato..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300" 
              value={busca}
              onChange={async e => {
                const valor = e.target.value;
                setBusca(valor);
                
                if (!valor.trim()) {
                  // Se o campo estiver vazio, mostra todos os contatos
                  await buscarContatos();
                } else {
                  // Caso contrário, faz a busca pelo texto digitado
                  await buscarContatosPorNome(valor);
                }
                
              }}
              
            />

            <button
              className="mt-2 border bg-red-500 w-fit text-white border-gray-300 px-4 py-2 rounded-lg font-semibold transition-all text-start cursor-pointer"
              onClick={deletarTodosContatosMostrados}
            >
            
              Apagar todos os contatos mostrados abaixo
              <TrashIcon className="inline-block ml-2 " size={16} />
            </button>
              

          </div>
          <div className={`grid gap-6 ${contatos.length === 0 ? "justify-center" : "md:grid-cols-2 xl:grid-cols-3"}`}>
            {loading ? (
              <div className="flex flex-col gap-6 items-center">
                <p className="text-2xl text-center text-black animate-pulse">
                  Carregando...
                </p>
              </div>
            ) : contatos.length === 0 ? (
              <div className="flex flex-col gap-6 items-center">
                <p className="text-2xl text-center text-black animate-pulse">
                  Nada por aqui ainda... Adicione um contato!
                </p>
              </div>
            ) : (
              contatos.map((contato) => (
                <CartaoContato
                  key={contato.id}
                  contato={contato}
                  atualizarContatos={buscarContatos}
                />
              ))
            )}
          </div>
        </section>

        {/* Anotações */}
        <aside className="xl:w-[35%] rounded-xl shadow-lg p-8 flex flex-col gap-4 h-[85vh]">
          <h2 className="text-xl font-semibold text-indigo-900 mb-2">Anotações da Agenda</h2>
          <label htmlFor="titulo">Título:</label>
          <input
            id="titulo"
            type="text"
            className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            placeholder="Digite o título da sua anotação aqui..."
            value={titulo}
            onChange={e => setTitulo(e.target.value)}
          />

          <textarea
            className="w-full min-h-36 flex-1 p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300"
            placeholder="Digite sua anotação aqui..."
            value={anotacao}
            onChange={e => setAnotacao(e.target.value)}
          />

          <div className="flex gap-2">
            <button
              className="bg-indigo-700 hover:cursor-pointer hover:bg-indigo-800 text-white px-4 py-2 rounded-lg font-semibold transition-all"
              onClick={handleSalvarAnotacao}
              disabled={!titulo || !anotacao}
            >
              {modoEdicao ? "Atualizar anotação" : "Salvar anotação"}
            </button>
            {modoEdicao && (
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 hover:cursor-pointer px-4 py-2 rounded-lg font-semibold transition-all"
                onClick={handleCancelarEdicao}
              >
                Cancelar
              </button>
            )}
          </div>

          <div className="mt-4 flex flex-col h-screen relative">
            <h3 className="text-lg font-semibold text-indigo-800 mb-2">Minhas Anotações</h3>
            <div className="flex flex-1 flex-col max-h-[35vh] gap-4 overflow-y-auto border rounded-lg p-3 bg-gray-50">
              {anotacoes.length === 0 ? (
                <p className="text-gray-500 text-center">Nenhuma anotação encontrada.</p>
              ) : (
                anotacoes.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white border rounded-lg shadow-sm p-3 hover:shadow-md transition flex flex-col"
                  >
                    <p className="text-gray-800 font-semibold truncate">{item.titulo}</p>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="text-gray-700 text-sm flex items-center gap-1 hover:cursor-pointer"
                            onClick={() => abrirModalAnotacao(item)}
                          >
                            Ver
                          </Button>
                        </DialogTrigger>

                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle className="text-lg font-semibold">{anotacaoModal?.titulo}</DialogTitle>
                          </DialogHeader>
                          <div className="mt-2">
                            <p className="whitespace-pre-wrap">{anotacaoModal?.conteudo}</p>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="outline"
                        className="text-indigo-700 text-sm flex items-center gap-1 hover:cursor-pointer"
                        onClick={() => handleEditarAnotacao(item)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        className="text-red-600 text-sm flex items-center gap-1 hover:cursor-pointer"
                        onClick={() => handleDeletarAnotacao(item.id)}
                      >
                        Deletar
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}