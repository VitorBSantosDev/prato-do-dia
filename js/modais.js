import { preencherLista } from "./utilitarias.js";

const ECRA_TELEMOVEL = "(max-width: 600px), (pointer: coarse) and (max-height: 500px)";

const modalPreparacao = document.querySelector("#modal-preparacao");
const modalTitulo = document.querySelector("#modal-titulo");
const modalPassos = document.querySelector("#modal-passos");
const modalImagem = document.querySelector("#modal-imagem");
const botaoModalFechar = document.querySelector("#modal-fechar");
const modalConfirmar = document.querySelector("#modal-confirmar");
const confirmarTexto = document.querySelector("#confirmar-texto");
const botaoConfirmarCancelar = document.querySelector("#confirmar-cancelar");
const botaoConfirmarSim = document.querySelector("#confirmar-sim");

let receitaPorRemover = null;

export function abrirPreparacao(receita){
    modalImagem.src = receita.imagem;
    modalImagem.alt = receita.nome;
    modalTitulo.textContent = receita.nome;
    modalPassos.textContent = "";
    preencherLista(modalPassos, receita.preparacao);
    modalPreparacao.showModal();

    if (window.matchMedia(ECRA_TELEMOVEL).matches){
        modalPreparacao.scrollTop = 0;
    }
}

export function pedirConfirmacaoRemover(receita){
    receitaPorRemover = receita;
    confirmarTexto.textContent = `A receita "${receita.nome}" vai ser removida da aplicação.`;
    modalConfirmar.showModal();
}

export function iniciarModais(aoConfirmarRemocao){
    botaoModalFechar.addEventListener("click", () => {
        modalPreparacao.close();
    });

    botaoConfirmarCancelar.addEventListener("click", () => {
        modalConfirmar.close();
    });

    botaoConfirmarSim.addEventListener("click", () => {
        aoConfirmarRemocao(receitaPorRemover);
        receitaPorRemover = null;
        modalConfirmar.close();
    });

    fecharAoClicarFora(modalPreparacao);
    fecharAoClicarFora(modalConfirmar);
}

function fecharAoClicarFora(dialog){
    dialog.addEventListener("click", (evento) => {
        if (evento.target === dialog){
            dialog.close();
        }
    });
}
