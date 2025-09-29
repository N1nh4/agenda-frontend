export default interface Usuario {
    id: string,
    idAgenda: string,
    nome: string,
    email: string,
    telefone: string,
    tipoAgenda: string,
    imagemUrl?: string
}