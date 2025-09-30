async function criarAgendaService(tipo: string): Promise<{resposta: number, idAgenda: number} | undefined> {
    try {
        const resposta = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/agenda`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(tipo)
        })
        
        if (!resposta.ok) {
            return
        }

        const json = await resposta.json();

        return { resposta: resposta.status, idAgenda: json.id }
    } catch(e) {
        return
    }
}

async function login(telefone: string, senha: string) {
    try {
        const resposta = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({telefone, senha})
        })

        if (!resposta.ok) {
            return
        }

        const json = await resposta.json();

        return json
    } catch(e) {
        return
    }
}

export { 
    login,
    criarAgendaService
}