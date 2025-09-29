async function criarUsuarioService(nome: string, email: string, telefone: string, idAgenda: string | undefined, tipoAgenda: string, senha: string) {
    try {
        const resposta = await fetch('${process.env.NEXT_PUBLIC_API_URL}/usuario', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nome: nome,
                email: email,
                telefone: telefone,
                idAgenda: idAgenda,
                tipoAgenda: tipoAgenda != null ? tipoAgenda : "LIST",
                senha: senha
            })
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

async function logar(telefone: string, senha: string): Promise<number | undefined> {
    try {
        const resposta = await fetch('${process.env.NEXT_PUBLIC_API_URL}/auth/login', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                telefone: telefone,
                senha: senha
            }),
        })
    
        if (!resposta.ok) {
            return
        }
        return resposta.status
    } catch(e) {
        return
    }
}

async function logout() {
    const resposta = await fetch('${process.env.NEXT_PUBLIC_API_URL}/auth/logout', {
        method: "POST",
        credentials: "include"
    })
}

async function enviarFotoUsuario(file: File) {
    try {
        const formData = new FormData();
        formData.append("file", file);
        const resposta = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/uploads/imagem_perfil`, {
            method: "POST",
            credentials: "include",
            body: formData,
        });

        const data = await resposta.json();
        console.log("Resposta do upload:", data);

        if (!resposta.ok) {
            return;
        }
    } catch (e) {
        return;
    }
    
}

async function buscarImagemUsuarioService(imagemUrl: string | undefined) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${imagemUrl}`, {
        method: "GET",
        credentials: "include", // envia cookies de sessão
    });
    
    if (!response.ok) return;

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    return url;
};
export {
    criarUsuarioService,
    enviarFotoUsuario,
    buscarImagemUsuarioService,
    logar,
    logout
}