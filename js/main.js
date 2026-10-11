import { iniciarTema } from "./tema.js";
import { carregarReceitas } from "./api.js";
import { criarFavoritos } from "./favoritos.js";
import { criarGestorReceitas } from "./receitas.js";
import { filtrarEOrdenarReceitas, TODAS_CATEGORIAS } from "./filtros.js";
import { criarCartao } from "./cartoes.js";
import { abrirPreparacao, pedirConfirmacaoRemover, iniciarModais } from "./modais.js";
import { iniciarFormulario } from "./formulario.js";
import { iniciarCopiaSeguranca } from "./copiaSeguranca.js";
import { iniciarFunil } from "./funil.js";
import { formatarTempo, limparTexto, lerArmazenamento, guardarArmazenamento, converterTextoDespensa } from "./utilitarias.js";

const CHAVE_DESPENSA = "tacho-despensa";

const listaReceitas = document.querySelector("#lista-receitas");
const filtroPesquisa = document.querySelector("#pesquisa");
const filtroCategoria = document.querySelector("#categoria");
const filtroOrdem = document.querySelector("#ordem");
const filtroFavorito = document.querySelector("#so-favoritas");
const filtroDespensa = document.querySelector("#despensa");
const filtroReceitasPossiveis = document.querySelector("#so-ingredientes-despensa");
const elementoResumo = document.querySelector("#resumo-filtro");
const botaoReporRemovidas = document.querySelector("#repor-removidas");
const botaoLimparFiltros = document.querySelector("#limpar-filtros");

const favoritos = criarFavoritos();
const gestorReceitas = criarGestorReceitas();

async function iniciarListaReceitas(){
    listaReceitas.innerHTML = `<p class="mensagem">A carregar receitas...</p>`;

    try {
        gestorReceitas.definirReceitasBase(await carregarReceitas());
        mostrarReceitas();
    } catch (erro) {
        console.error(erro);
        mostrarErroCarregamento();
    }
}

function mostrarErroCarregamento(){
    const caixaErro = document.createElement("div");
    caixaErro.className = "mensagem mensagem-erro";

    const texto = document.createElement("p");
    texto.textContent = "Não foi possível carregar as receitas.";

    const botaoTentarNovamente = document.createElement("button");
    botaoTentarNovamente.type = "button";
    botaoTentarNovamente.className = "botao-tema";
    botaoTentarNovamente.textContent = "Tentar novamente";
    botaoTentarNovamente.addEventListener("click", iniciarListaReceitas);

    caixaErro.append(texto, botaoTentarNovamente);
    listaReceitas.replaceChildren(caixaErro);
}

function lerCriteriosFiltro(){
    return {
        pesquisa: limparTexto(filtroPesquisa.value),
        categoria: filtroCategoria.value,
        ordem: filtroOrdem.value,
        apenasFavoritas: filtroFavorito.checked,
        apenasPossiveis: filtroReceitasPossiveis.checked,
        ingredientesDespensa: converterTextoDespensa(filtroDespensa.value),
        verificarSeEFavorito: favoritos.verificarSeEFavorito
    };
}

function mostrarReceitas(){
    const criterios = lerCriteriosFiltro();
    const receitasVisiveis = filtrarEOrdenarReceitas(gestorReceitas.obterReceitasDisponiveis(), criterios);
    listaReceitas.innerHTML = "";

    if (receitasVisiveis.length === 0){
        listaReceitas.innerHTML = `<p class="mensagem">Nenhuma receita encontrada.</p>`;
    } else {
        for (const receita of receitasVisiveis){
            listaReceitas.appendChild(criarCartao(receita, {
                eFavorito: favoritos.verificarSeEFavorito(receita.id),
                ingredientesDespensa: criterios.ingredientesDespensa,
                aoClicarFavorito: () => alternarFavorito(receita),
                aoClicarRemover: () => pedirConfirmacaoRemover(receita),
                aoClicarPreparacao: () => abrirPreparacao(receita)
            }));
        }
    }

    mostrarResumoFiltro(receitasVisiveis);
    mostrarBotaoReporRemovidas();
}

function mostrarResumoFiltro(receitasVisiveis){
    const quantidade = receitasVisiveis.length;

    if (quantidade === 0){
        elementoResumo.textContent = "0 receitas";
        return;
    }

    const somaTempo = receitasVisiveis.reduce((soma, receita) => soma + receita.tempo, 0);
    const mediaTempo = formatarTempo(Math.round(somaTempo / quantidade));
    const palavraReceita = quantidade === 1 ? "receita" : "receitas";
    const quantidadeFavoritos = favoritos.contarFavoritos();
    const palavraFavorito = quantidadeFavoritos === 1 ? "favorita" : "favoritas";

    elementoResumo.textContent = `${quantidade} ${palavraReceita} · tempo médio ${mediaTempo} · ${quantidadeFavoritos} ${palavraFavorito}`;
}

function mostrarBotaoReporRemovidas(){
    const quantidadeRemovidas = gestorReceitas.contarRemovidas();
    botaoReporRemovidas.hidden = quantidadeRemovidas === 0;
    botaoReporRemovidas.textContent = `Repor receitas removidas (${quantidadeRemovidas})`;
}

function alternarFavorito(receita){
    favoritos.adicionarOuRemover(receita.id);
    mostrarReceitas();
}

function adicionarReceitas(receitasNovas){
    gestorReceitas.adicionarReceitas(receitasNovas);
    mostrarReceitas();
}

function removerReceita(receita){
    if (!receita){
        return;
    }

    gestorReceitas.removerReceita(receita);

    if (favoritos.verificarSeEFavorito(receita.id)){
        favoritos.adicionarOuRemover(receita.id);
    }

    mostrarReceitas();
}

function reporRemovidas(){
    gestorReceitas.reporRemovidas();
    mostrarReceitas();
}

function contarFiltrosAtivos(){
    const criterios = lerCriteriosFiltro();

    return [
        criterios.pesquisa !== "",
        criterios.categoria !== TODAS_CATEGORIAS,
        criterios.apenasFavoritas,
        criterios.apenasPossiveis,
        criterios.ingredientesDespensa.length > 0
    ].filter(Boolean).length;
}

function limparFiltros(){
    filtroPesquisa.value = "";
    filtroCategoria.value = TODAS_CATEGORIAS;
    filtroFavorito.checked = false;
    filtroReceitasPossiveis.checked = false;
    filtroDespensa.value = "";
    guardarArmazenamento(localStorage, CHAVE_DESPENSA, "");
    mostrarReceitas();
    funil.atualizarContador();
}

filtroPesquisa.addEventListener("input", mostrarReceitas);
filtroCategoria.addEventListener("change", mostrarReceitas);
filtroOrdem.addEventListener("change", mostrarReceitas);
filtroFavorito.addEventListener("change", mostrarReceitas);
filtroReceitasPossiveis.addEventListener("change", mostrarReceitas);

filtroDespensa.addEventListener("input", () => {
    guardarArmazenamento(localStorage, CHAVE_DESPENSA, filtroDespensa.value);
    mostrarReceitas();
});

botaoReporRemovidas.addEventListener("click", reporRemovidas);
botaoLimparFiltros.addEventListener("click", limparFiltros);

filtroDespensa.value = lerArmazenamento(localStorage, CHAVE_DESPENSA, "");

iniciarTema();
iniciarModais(removerReceita);
iniciarFormulario(receita => adicionarReceitas([receita]));
iniciarCopiaSeguranca(gestorReceitas.obterMinhasReceitas, adicionarReceitas);
const funil = iniciarFunil(contarFiltrosAtivos);
iniciarListaReceitas();
