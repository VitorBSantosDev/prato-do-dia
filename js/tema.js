import { lerArmazenamento, guardarArmazenamento } from "./utilitarias.js";

const CHAVE_TEMA = "prato-tema";

export function iniciarTema(){
    const botaoTema = document.querySelector("#tema");
    const html = document.documentElement;

    function obterTemaAtual(){
        if (html.dataset.theme){
            return html.dataset.theme;
        }
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }

    function aplicarTema(tema){
        html.dataset.theme = tema;
        botaoTema.textContent = tema === "dark" ? "☀ Modo claro" : "☾ Modo escuro";
    }

    const temaGuardado = lerArmazenamento(localStorage, CHAVE_TEMA, null);
    aplicarTema(temaGuardado || obterTemaAtual());

    botaoTema.addEventListener("click", () => {
        const novoTema = obterTemaAtual() === "dark" ? "light" : "dark";
        aplicarTema(novoTema);
        guardarArmazenamento(localStorage, CHAVE_TEMA, novoTema);
    });
}
