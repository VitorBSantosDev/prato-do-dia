import { lerArmazenamento, guardarArmazenamento } from "./utilitarias.js";

const CHAVE_FAVORITOS = "prato-favoritos";

export function criarGestorFavoritos(){
    let listaFavoritos = lerArmazenamento(localStorage, CHAVE_FAVORITOS, []);

    function removerFavorito(id){
        listaFavoritos = listaFavoritos.filter(favorito => favorito !== id);
        guardarArmazenamento(localStorage, CHAVE_FAVORITOS, listaFavoritos);
    }

    function alternarFavorito(id){
        if (verificarSeEFavorito(id)){
            removerFavorito(id);
            return;
        }

        listaFavoritos = [...listaFavoritos, id];
        guardarArmazenamento(localStorage, CHAVE_FAVORITOS, listaFavoritos);
    }

    function verificarSeEFavorito(id){
        return listaFavoritos.includes(id);
    }

    function contarFavoritos(){
        return listaFavoritos.length;
    }

    return { alternarFavorito, removerFavorito, verificarSeEFavorito, contarFavoritos };
}
