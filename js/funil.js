const PROPORCAO_FIM_LISTA = 0.4;

export function iniciarFunil(contarFiltrosAtivos){
    const filtros = document.querySelector("#filtros");
    const espacoFiltros = document.querySelector(".espaco-filtros");
    const listaReceitas = document.querySelector("#lista-receitas");
    const botaoFunil = document.querySelector("#botao-funil");
    const contador = document.querySelector("#contador-filtros");
    const fundo = document.querySelector("#fundo-filtros");

    function verificarEstaAberto(){
        return filtros.classList.contains("aberto");
    }

    function mostrarBotaoFunil(){
        if (verificarEstaAberto()){
            return;
        }

        const filtrosEstaoForaDoEcra = espacoFiltros.getBoundingClientRect().bottom < 0;
        const estaNaZonaDasReceitas = listaReceitas.getBoundingClientRect().bottom > window.innerHeight * PROPORCAO_FIM_LISTA;
        botaoFunil.dataset.visivel = String(filtrosEstaoForaDoEcra && estaNaZonaDasReceitas);
    }

    function atualizarContador(){
        const quantidadeFiltrosAtivos = contarFiltrosAtivos();
        contador.textContent = quantidadeFiltrosAtivos > 0 ? quantidadeFiltrosAtivos : "";
    }

    function abrirPainel(){
        espacoFiltros.style.setProperty("--altura-filtros", `${espacoFiltros.offsetHeight}px`);
        filtros.classList.add("aberto");
        fundo.hidden = false;
        botaoFunil.setAttribute("aria-expanded", "true");
    }

    function fecharPainel(){
        filtros.classList.remove("aberto");
        fundo.hidden = true;
        botaoFunil.setAttribute("aria-expanded", "false");
        espacoFiltros.style.removeProperty("--altura-filtros");
        mostrarBotaoFunil();
    }

    function verReceitas(){
        fecharPainel();

        if (listaReceitas.getBoundingClientRect().top < 0){
            document.querySelector(".barra-resumo-filtro").scrollIntoView();
        }
    }

    botaoFunil.addEventListener("click", () => {
        verificarEstaAberto() ? fecharPainel() : abrirPainel();
    });
    fundo.addEventListener("click", fecharPainel);
    document.querySelector("#fechar-filtros").addEventListener("click", fecharPainel);
    document.querySelector("#ver-receitas").addEventListener("click", verReceitas);
    document.addEventListener("keydown", evento => {
        if (evento.key === "Escape" && verificarEstaAberto()){
            fecharPainel();
        }
    });

    filtros.addEventListener("input", atualizarContador);
    filtros.addEventListener("change", atualizarContador);
    window.addEventListener("scroll", mostrarBotaoFunil);
    window.addEventListener("resize", mostrarBotaoFunil);

    atualizarContador();
    mostrarBotaoFunil();

    return { atualizarContador };
}
