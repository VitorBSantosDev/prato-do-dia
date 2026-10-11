import { lerArmazenamento, guardarArmazenamento } from "./utilitarias.js";

const CHAVE_FAVORITOS = "prato-favoritos";

export function criarFavoritos(){
    let listaFavoritos = lerArmazenamento(localStorage, CHAVE_FAVORITOS, []);

    function adicionarOuRemover(id){
        if (listaFavoritos.includes(id)){
            listaFavoritos = listaFavoritos.filter(favorito => favorito !== id);
        } else {
            listaFavoritos = [...listaFavoritos, id];
        }

        guardarArmazenamento(localStorage, CHAVE_FAVORITOS, listaFavoritos);
    }

    function verificarSeEFavorito(id){
        return listaFavoritos.includes(id);
    }

    function contarFavoritos(){
        return listaFavoritos.length;
    }

    return { adicionarOuRemover, verificarSeEFavorito, contarFavoritos };
}
