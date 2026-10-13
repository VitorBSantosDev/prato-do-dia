import { validarReceita, criarMensagemTemporaria } from "./utilitarias.js";
import { verificarEReceitaPropria } from "./receitas.js";

const NOME_FICHEIRO_EXPORTACAO = "prato-do-dia.json";
const DURACAO_MENSAGEM_MS = 7000;

const botaoExportarReceitas = document.querySelector("#exportar-receitas");
const inputImportarReceita = document.querySelector("#importar-receitas");
const mensagemCopia = criarMensagemTemporaria(document.querySelector("#mensagem-copia"), DURACAO_MENSAGEM_MS);

export function iniciarCopiaSeguranca(obterMinhasReceitas, aoImportarReceitas){
    botaoExportarReceitas.addEventListener("click", () => {
        exportarReceitas(obterMinhasReceitas());
    });

    inputImportarReceita.addEventListener("change", () => {
        importarReceitas(obterMinhasReceitas(), aoImportarReceitas);
    });
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
        mensagemCopia.mostrarMensagemTemporaria("Ainda não criou nenhuma receita para exportar.");
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
    mensagemCopia.mostrarMensagemTemporaria(mensagemExportacao);
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
        mensagemCopia.mostrarMensagemTemporaria(criarMensagemImportacao(receitasValidas.length, quantidadeIgnoradas));
    } catch (erro) {
        console.error(erro);
        mensagemCopia.mostrarMensagemTemporaria("Não foi possível importar. Confirme que o ficheiro é uma exportação do Prato do Dia.");
    }

    inputImportarReceita.value = "";
}
