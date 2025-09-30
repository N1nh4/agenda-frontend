async function criarAgendaService(tipo: string): Promise<{resposta: number, idAgenda: number} | undefined> {
    try {
        const token = localStorage.getItem("jwt");
        if (!token) return;

        const resposta = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/agenda`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // envia JWT
            },
            body: JSON.stringify(tipo)
        });

        if (!resposta.ok) return;

        const json = await resposta.json();
        return { resposta: resposta.status, idAgenda: json.id };
    } catch (e) {
        return;
    }
}


async function login(telefone: string, senha: string) {
    try {
        const resposta = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ telefone, senha })
        });

        if (!resposta.ok) return;

        const json = await resposta.json();
        
        // armazenar token no localStorage
        if (json.token) {
            localStorage.setItem("jwt", json.token);
        }

        return json;
    } catch (e) {
        return;
    }
}


export { 
    login,
    criarAgendaService
}