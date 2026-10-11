import { validarReceita } from "./utilitarias.js";
import { verificarEReceitaPropria } from "./receitas.js";

const NOME_FICHEIRO_EXPORTACAO = "tacho-da-mae.json";

const botaoExportarReceitas = document.querySelector("#exportar-receitas");
const inputImportarReceita = document.querySelector("#importar-receitas");
const mensagemCopia = document.querySelector("#mensagem-copia");

export function iniciarCopiaSeguranca(obterMinhasReceitas, aoImportarReceitas){
    botaoExportarReceitas.addEventListener("click", () => {
        exportarReceitas(obterMinhasReceitas());
    });

    inputImportarReceita.addEventListener("change", () => {
        importarReceitas(obterMinhasReceitas(), aoImportarReceitas);
    });
}

function mostrarMensagemCopia(texto){
    mensagemCopia.textContent = texto;
    mensagemCopia.hidden = false;
}

function criarMensagemImportacao(quantidadeImportadas, quantidadeIgnoradas){
    const palavraImportadas = quantidadeImportadas === 1 ? "receita importada" : "receitas importadas";
    const mensagemImportadas = `${quantidadeImportadas} ${palavraImportadas}.`;

    if (quantidadeIgnoradas === 0){
        return mensagemImportadas;
    }

    const fraseIgnoradas = quantidadeIgnoradas === 1 ? "foi ignorada (repetida ou inválida)" : "foram ignoradas (repetidas ou inválidas)";
    return `${mensagemImportadas} ${quantidadeIgnoradas} ${fraseIgnoradas}.`;
}

function verificarPodeImportar(receitaImportada, minhasReceitas){
    if (!verificarEReceitaPropria(receitaImportada)){
        return false;
    }
    if (validarReceita(receitaImportada).length > 0){
        return false;
    }

    return !minhasReceitas.some(receita => receita.id === receitaImportada.id);
}

function exportarReceitas(minhasReceitas){
    if (minhasReceitas.length === 0){
        mostrarMensagemCopia("Ainda não criou nenhuma receita para exportar.");
        return;
    }

    const receitasExportar = JSON.stringify(minhasReceitas, null, 2);
    const ficheiro = new Blob([receitasExportar], {type: "application/json"});
    const endereco = URL.createObjectURL(ficheiro);

    const linkDownload = document.createElement("a");
    linkDownload.href = endereco;
    linkDownload.download = NOME_FICHEIRO_EXPORTACAO;

    linkDownload.click();
    URL.revokeObjectURL(endereco);

    const mensagemExportacao = minhasReceitas.length === 1 ? `Foi exportada ${minhasReceitas.length} receita.` : `Foram exportadas ${minhasReceitas.length} receitas.`;
    mostrarMensagemCopia(mensagemExportacao);
}

async function importarReceitas(minhasReceitas, aoImportarReceitas){
    const ficheiroImportado = inputImportarReceita.files[0];

    if (!ficheiroImportado){
        return;
    }

    try {
        const ficheiroTexto = await ficheiroImportado.text();
        const receitasImportadas = JSON.parse(ficheiroTexto);

        if (!Array.isArray(receitasImportadas)){
            throw new Error("O ficheiro não tem uma lista de receitas.");
        }

        const receitasValidas = receitasImportadas.filter(receita => verificarPodeImportar(receita, minhasReceitas));
        aoImportarReceitas(receitasValidas);

        const quantidadeIgnoradas = receitasImportadas.length - receitasValidas.length;
        mostrarMensagemCopia(criarMensagemImportacao(receitasValidas.length, quantidadeIgnoradas));
    } catch (erro) {
        console.error(erro);
        mostrarMensagemCopia("Não foi possível importar. Confirme que o ficheiro é uma exportação do Tacho da Mãe.");
    }

    inputImportarReceita.value = "";
}
