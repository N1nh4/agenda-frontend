async function criarAgendaService(tipo: string): Promise<{resposta: number, idAgenda: number} | undefined> {
  try {
    const token = localStorage.getItem("jwt");
    if (!token) {
      console.error("JWT não encontrado. Faça login antes.");
      return;
    }

    const resposta = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/agenda`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ tipoAgenda: tipo })
    });

    if (!resposta.ok) {
      console.error("Erro ao criar agenda:", resposta.status);
      return;
    }

    const json = await resposta.json();
    return { resposta: resposta.status, idAgenda: json.id };
  } catch (e) {
    console.error("Erro inesperado ao criar agenda:", e);
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

    if (!resposta.ok) {
      console.error("Erro ao logar:", resposta.status);
      return;
    }

    const json = await resposta.json();

    if (json.token) {
      localStorage.setItem("jwt", json.token);
    }

    return json;
  } catch (e) {
    console.error("Erro inesperado ao logar:", e);
    return;
  }
}


export { login, criarAgendaService }
