import { useContext } from "react";
import { UsuarioContexto } from "../context/UsuarioContexto";

const useUsuario = () => {
    const contexto = useContext(UsuarioContexto)

    if (!contexto) {
        throw new Error('useUsuario deve ser usado dentro de um UsuarioContextoProvider')
    }

    return contexto
}

export default useUsuario