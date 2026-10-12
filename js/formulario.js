import { validarReceita, converterTextoParaLista, separarPorVirgulas, reduzirImagem, lerArmazenamento, guardarArmazenamento, apagarArmazenamento, preencherLista } from "./utilitarias.js";
import { criarIdReceitaPropria } from "./receitas.js";

const CHAVE_RASCUNHO = "prato-rascunho";
const IMAGEM_PADRAO = "img/sem-imagem.svg";
const DURACAO_MENSAGEM_MS = 5000;

const formAdicionarReceita = document.querySelector("#form-adicionar-receita");
const caixaErros = document.querySelector("#erros");
const mensagemSucesso = document.querySelector("#mensagem-sucesso");

let temporizadorSucesso;

export function iniciarFormulario(aoAdicionarReceita){
    formAdicionarReceita.addEventListener("input", guardarRascunho);
    formAdicionarReceita.tempo.addEventListener("beforeinput", bloquearNaoDigitos);

    formAdicionarReceita.addEventListener("submit", async (evento) => {
        evento.preventDefault();

        const receitaNova = lerReceitaDoFormulario();
        const erros = validarReceita(receitaNova);

        if (erros.length > 0){
            mostrarErros(erros);
            return;
        }

        const ficheiro = formAdicionarReceita.imagem.files[0];

        if (ficheiro){
            try {
                receitaNova.imagem = await reduzirImagem(ficheiro);
            } catch (erro) {
                formAdicionarReceita.imagem.value = "";
                mostrarErros([erro.message]);
                return;
            }
        }

        aoAdicionarReceita(receitaNova);
        limparFormulario();
        mostrarSucesso(`A receita "${receitaNova.nome}" foi adicionada com sucesso.`);
    });

    reporRascunho();
}

function lerReceitaDoFormulario(){
    return {
        id: criarIdReceitaPropria(),
        nome: formAdicionarReceita.nome.value.trim(),
        categoria: formAdicionarReceita.categoria.value,
        imagem: IMAGEM_PADRAO,
        tempo: Number(formAdicionarReceita.tempo.value),
        ingredientes: converterTextoParaLista(formAdicionarReceita.ingredientes.value),
        ingredientesBase: separarPorVirgulas(formAdicionarReceita.ingredientesBase.value),
        preparacao: converterTextoParaLista(formAdicionarReceita.preparacao.value)
    };
}

function bloquearNaoDigitos(evento){
    const temCaracteresNaoDigitos = evento.data !== null && !/^\d+$/.test(evento.data);

    if (temCaracteresNaoDigitos){
        evento.preventDefault();
    }
}

function limparFormulario(){
    caixaErros.hidden = true;
    formAdicionarReceita.reset();
    apagarArmazenamento(sessionStorage, CHAVE_RASCUNHO);
}

function mostrarErros(listaMensagens){
    caixaErros.textContent = "";
    preencherLista(caixaErros, listaMensagens);
    caixaErros.hidden = false;
    caixaErros.scrollIntoView({ block: "start" });
    mensagemSucesso.hidden = true;
    clearTimeout(temporizadorSucesso);
}

function mostrarSucesso(texto){
    mensagemSucesso.textContent = texto;
    mensagemSucesso.hidden = false;

    clearTimeout(temporizadorSucesso);
    temporizadorSucesso = setTimeout(() => {
        mensagemSucesso.hidden = true;
    }, DURACAO_MENSAGEM_MS);
}

function guardarRascunho(){
    const rascunhoGuardado = {
        nome: formAdicionarReceita.nome.value,
        categoria: formAdicionarReceita.categoria.value,
        tempo: formAdicionarReceita.tempo.value,
        ingredientes: formAdicionarReceita.ingredientes.value,
        ingredientesBase: formAdicionarReceita.ingredientesBase.value,
        preparacao: formAdicionarReceita.preparacao.value
    };

    guardarArmazenamento(sessionStorage, CHAVE_RASCUNHO, rascunhoGuardado);
}

function reporRascunho(){
    const rascunho = lerArmazenamento(sessionStorage, CHAVE_RASCUNHO, null);

    if (rascunho === null){
        return;
    }

    formAdicionarReceita.nome.value = rascunho.nome;
    formAdicionarReceita.categoria.value = rascunho.categoria;
    formAdicionarReceita.tempo.value = rascunho.tempo;
    formAdicionarReceita.ingredientes.value = rascunho.ingredientes;
    formAdicionarReceita.ingredientesBase.value = rascunho.ingredientesBase ?? "";
    formAdicionarReceita.preparacao.value = rascunho.preparacao;
}
