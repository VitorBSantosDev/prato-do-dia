import { lerArmazenamento, guardarArmazenamento } from "./utilitarias.js";

const CHAVE_MINHAS_RECEITAS = "prato-minhas-receitas";
const CHAVE_REMOVIDAS = "prato-removidas";
const PREFIXO_RECEITA_PROPRIA = "minha-";

export function criarIdReceitaPropria(){
    return `${PREFIXO_RECEITA_PROPRIA}${Date.now()}`;
}

export function verificarEReceitaPropria(receita){
    return Boolean(receita.id) && receita.id.startsWith(PREFIXO_RECEITA_PROPRIA);
}

export function criarGestorReceitas(){
    let receitasBase = [];
    let minhasReceitas = lerArmazenamento(localStorage, CHAVE_MINHAS_RECEITAS, []);
    let removidas = lerArmazenamento(localStorage, CHAVE_REMOVIDAS, []);

    function definirReceitasBase(lista){
        receitasBase = lista;
    }

    function obterReceitasDisponiveis(){
        return [...receitasBase, ...minhasReceitas].filter(receita => !removidas.includes(receita.id));
    }

    function obterMinhasReceitas(){
        return [...minhasReceitas];
    }

    function contarRemovidas(){
        return removidas.length;
    }

    function adicionarReceitas(receitasNovas){
        minhasReceitas = [...minhasReceitas, ...receitasNovas];
        guardarArmazenamento(localStorage, CHAVE_MINHAS_RECEITAS, minhasReceitas);
    }

    function removerReceita(receitaRemover){
        if (verificarEReceitaPropria(receitaRemover)){
            minhasReceitas = minhasReceitas.filter(receita => receita.id !== receitaRemover.id);
            guardarArmazenamento(localStorage, CHAVE_MINHAS_RECEITAS, minhasReceitas);
            return;
        }

        removidas = [...removidas, receitaRemover.id];
        guardarArmazenamento(localStorage, CHAVE_REMOVIDAS, removidas);
    }

    function reporRemovidas(){
        removidas = [];
        guardarArmazenamento(localStorage, CHAVE_REMOVIDAS, removidas);
    }

    return {
        definirReceitasBase,
        obterReceitasDisponiveis,
        obterMinhasReceitas,
        contarRemovidas,
        adicionarReceitas,
        removerReceita,
        reporRemovidas
    };
}
