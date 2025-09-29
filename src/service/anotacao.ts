

async function salvarAnotacaoService(idAgenda: string | undefined, titulo: string, conteudo: string): Promise<number | undefined> {
    if (!idAgenda) {
        return undefined;
    }
    try {
        const resposta = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/minha_agenda/anotacoes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ titulo, conteudo, agendaId: idAgenda })
        });
        if (!resposta.ok) {
            return undefined;
        }
        return resposta.status;
    } catch (error) {
        return undefined;
    }
}


async function listarAnotacoesService(idAgenda: string | undefined) {
    if (!idAgenda) {
        return [];
    }
    console.log("ID da agenda para listar anotações:", idAgenda);
    try {
        const resposta = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/minha_agenda/anotacoes/agenda/${idAgenda}`, {
        method: 'GET',
        credentials: 'include', // envia cookies de sessão (JSESSIONID)
        });

        if (!resposta.ok) {
        console.error("Erro ao buscar anotações. Status:", resposta.status);
        return [];
        }

        // Converte a resposta JSON do backend para um array de anotações
        const dados = await resposta.json();
        return dados;
    } catch (erro) {
        console.error("Erro na requisição de anotações:", erro);
        return [];
  }
}

async function atualizarAnotacaoService(
    id: string,
    titulo: string,
    conteudo: string
    ) {
    try {
        const resposta = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/minha_agenda/anotacoes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ titulo, conteudo, agendaId: undefined }) // agendaId não precisa para atualizar
        });

        if (!resposta.ok) return undefined;
        return resposta.json();
    } catch (erro) {
        console.error('Erro ao atualizar anotação:', erro);
        return undefined;
    }
}


async function deletarAnotacaoService(id: string): Promise<boolean> {
    try {
        const resposta = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/minha_agenda/anotacoes/${id}`, {
        method: 'DELETE',
        credentials: 'include'
        });
        return resposta.ok;
    } catch (erro) {
        console.error('Erro ao deletar anotação:', erro);
        return false;
    }
    }


export { salvarAnotacaoService, listarAnotacoesService, atualizarAnotacaoService, deletarAnotacaoService };