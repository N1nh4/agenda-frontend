import { Contato } from "@/core/contato";

async function getContatosService(idAgenda?: string): Promise<Contato[] | undefined> {
    if (!idAgenda) {
        return
    }

    const idAgendaInt = parseInt(idAgenda);

    try {
        const resposta = await fetch(`http://localhost:8081/minha_agenda/contatos/agenda/${idAgendaInt}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include"
        })

        if (!resposta.ok) {
            return
        }

        return await resposta.json();
    } catch(e) {
        return
    }
}

async function salvarContatoService(idAgenda: string, nome: string, telefone: string): Promise<number | undefined> {
    try {
        const resposta = await fetch('http://localhost:8081/minha_agenda/contatos', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({idAgenda, nome, telefone})
        })


        if (!resposta.ok) {
            return
        }

        return resposta.status
    } catch(e) {
        return
    }
}

async function atualizarContatoService(id: string | undefined, nome: string, telefone: string): Promise<number | undefined> {
    try {
        const resposta = await fetch(`http://localhost:8081/minha_agenda/contatos/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({nome, telefone})
        }
        )

        if (!resposta.ok) {
            return
        }

        return resposta.status
    } catch(e) {
        return
    }
}

async function excluirContatoService(id: string | undefined): Promise<number | undefined> {
    try {
        const resposta = await fetch(`http://localhost:8081/minha_agenda/contatos/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include"
        })

        if (!resposta.ok) {
            return
        }

        return resposta.status
    } catch(e) {
        return
    }
}

async function buscarContatosPorIdsService(busca: string): Promise<Contato[] | undefined> {
    try {
        const resposta = await fetch(`http://localhost:8081/minha_agenda/contatos/filtrar/${busca}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
        })

        if (!resposta.ok) {
            return;
        }

        const dados: Contato[] = await resposta.json();
        return dados;
        
    } catch (e) {
        return;
    }
}

async function deletarContatosPorIdsService(ids: number[]): Promise<number | undefined> {
    if (ids.length === 0) {
        return 204; // No Content
    }    

    try {
        const resposta = await fetch(`http://localhost:8081/minha_agenda/contatos/deletar/ids`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(ids)
        })

        if (!resposta.ok) {
            return;
        }

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
}