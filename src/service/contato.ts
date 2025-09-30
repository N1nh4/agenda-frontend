import { Contato } from "@/core/contato";

// Função auxiliar para pegar token JWT
function getToken() {
    return localStorage.getItem("jwt");
}

async function getContatosService(idAgenda?: string): Promise<Contato[] | undefined> {
    if (!idAgenda) return;
    const token = getToken();
    if (!token) return;

    const idAgendaInt = parseInt(idAgenda);

    try {
        const resposta = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/minha_agenda/contatos/agenda/${idAgendaInt}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (!resposta.ok) return;

        return await resposta.json();
    } catch (e) {
        return;
    }
}

async function salvarContatoService(idAgenda: string, nome: string, telefone: string): Promise<number | undefined> {
    const token = getToken();
    if (!token) return;

    try {
        const resposta = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/minha_agenda/contatos`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ idAgenda, nome, telefone })
        });

        if (!resposta.ok) return;

        return resposta.status;
    } catch (e) {
        return;
    }
}

async function atualizarContatoService(id: string | undefined, nome: string, telefone: string): Promise<number | undefined> {
    if (!id) return;
    const token = getToken();
    if (!token) return;

    try {
        const resposta = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/minha_agenda/contatos/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ nome, telefone })
        });

        if (!resposta.ok) return;

        return resposta.status;
    } catch (e) {
        return;
    }
}

async function excluirContatoService(id: string | undefined): Promise<number | undefined> {
    if (!id) return;
    const token = getToken();
    if (!token) return;

    try {
        const resposta = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/minha_agenda/contatos/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (!resposta.ok) return;

        return resposta.status;
    } catch (e) {
        return;
    }
}

async function buscarContatosPorIdsService(busca: string): Promise<Contato[] | undefined> {
    const token = getToken();
    if (!token) return;

    try {
        const resposta = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/minha_agenda/contatos/filtrar/${busca}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (!resposta.ok) return;

        const dados: Contato[] = await resposta.json();
        return dados;

    } catch (e) {
        return;
    }
}

async function deletarContatosPorIdsService(ids: number[]): Promise<number | undefined> {
    if (ids.length === 0) return 204;
    const token = getToken();
    if (!token) return;

    try {
        const resposta = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/minha_agenda/contatos/deletar/ids`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(ids)
        });

        if (!resposta.ok) return;

        return resposta.status;
    } catch (e) {
        return;
    }
}

export {
    getContatosService,
    salvarContatoService,
    atualizarContatoService,
    excluirContatoService,
    buscarContatosPorIdsService,
    deletarContatosPorIdsService
};
