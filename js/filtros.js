import { limparTexto, identificarIngredientesEmFalta, verificarTemIngredientesBase } from "./utilitarias.js";

export const TODAS_CATEGORIAS = "Todas";

export function filtrarEOrdenarReceitas(receitas, criterios){
    const receitasFiltradas = receitas.filter(receita => verificarPassaNosFiltros(receita, criterios));
    return ordenarReceitas(receitasFiltradas, criterios.ordem);
}

function verificarPassaNosFiltros(receita, criterios){
    if (!limparTexto(receita.nome).includes(criterios.pesquisa)){
        return false;
    }
    if (criterios.categoria !== TODAS_CATEGORIAS && receita.categoria !== criterios.categoria){
        return false;
    }
    if (criterios.apenasFavoritas && !criterios.verificarSeEFavorito(receita.id)){
        return false;
    }
    if (criterios.apenasPossiveis && !verificarConsegueFazer(receita, criterios.ingredientesDespensa)){
        return false;
    }

    return true;
}

function verificarConsegueFazer(receita, ingredientesDespensa){
    return verificarTemIngredientesBase(receita) && identificarIngredientesEmFalta(receita, ingredientesDespensa).length === 0;
}

function ordenarReceitas(receitas, ordem){
    const receitasOrdenadas = [...receitas];

    switch (ordem){
        case "rapidas":
            receitasOrdenadas.sort((receitaA, receitaB) => receitaA.tempo - receitaB.tempo);
            break;
        case "demoradas":
            receitasOrdenadas.sort((receitaA, receitaB) => receitaB.tempo - receitaA.tempo);
            break;
        default:
            receitasOrdenadas.sort((receitaA, receitaB) => receitaA.nome.localeCompare(receitaB.nome));
            break;
    }

    return receitasOrdenadas;
}
