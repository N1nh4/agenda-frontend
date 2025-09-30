// Service de usuário ajustado para JWT
async function criarUsuarioService(
    nome: string,
    email: string,
    telefone: string,
    idAgenda: string | undefined,
    tipoAgenda: string,
    senha: string
) {
    const token = localStorage.getItem("jwt"); // pega JWT do storage
    if (!token) return; // não continua se não tiver token

    try {
        const resposta = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuario`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                nome,
                email,
                telefone,
                idAgenda,
                tipoAgenda: tipoAgenda ?? "LIST",
                senha
            })
        });

        if (!resposta.ok) return;

        return await resposta.json();
    } catch (e) {
        return;
    }
}

async function logar(telefone: string, senha: string): Promise<string | undefined> {
    try {
        const resposta = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ telefone, senha })
        });

        if (!resposta.ok) return;

        const data = await resposta.json();
        // salva JWT no localStorage
        if (data.token) {
            localStorage.setItem("jwt", data.token);
        }

        return data.token;
    } catch (e) {
        return;
    }
}

async function logout() {
    const token = localStorage.getItem("jwt");
    if (!token) return;

    try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        localStorage.removeItem("jwt"); // remove token no logout
    } catch (e) {
        return;
    }
}

async function enviarFotoUsuario(file: File) {
    const token = localStorage.getItem("jwt");
    if (!token) return;

    try {
        const formData = new FormData();
        formData.append("file", file);

        const resposta = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/uploads/imagem_perfil`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData
        });

        if (!resposta.ok) return;

        const data = await resposta.json();
        console.log("Resposta do upload:", data);
        return data;
    } catch (e) {
        return;
    }
}

async function buscarImagemUsuarioService(imagemUrl: string | undefined) {
    const token = localStorage.getItem("jwt");
    if (!token || !imagemUrl) return;

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${imagemUrl}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) return;

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        return url;
    } catch (e) {
        return;
    }
}

export {
    criarUsuarioService,
    enviarFotoUsuario,
    buscarImagemUsuarioService,
    logar,
    logout
};
