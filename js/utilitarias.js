const INGREDIENTES_BASICOS = ["sal", "pimenta", "agua", "azeite"];
const SEM_ACENTO = {
    á: "a", à: "a", â: "a", ã: "a",
    é: "e", ê: "e",
    í: "i",
    ó: "o", ô: "o", õ: "o",
    ú: "u",
    ç: "c"
};
const REGRAS_PLURAL = [
    { plural: "oes", singular: "ao" },
    { plural: "aes", singular: "ao" },
    { plural: "eis", singular: "el" },
    { plural: "res", singular: "r" },
    { plural: "zes", singular: "z" },
    { plural: "ns",  singular: "m" },
    { plural: "s",   singular: "" }
];
const MIN_LETRAS_NOME = 3;
const QUALIDADE_JPEG = 0.7;
const LARGURA_IMAGEM = 400;
const ALTURA_IMAGEM = 300;
const MINUTOS_HORA = 60;

export function formatarTempo(minutos){
    const horas = Math.floor(minutos / MINUTOS_HORA);
    const minutosRestantes = minutos % MINUTOS_HORA;

    if (horas < 1){
        return `${minutosRestantes} min`;
    } else if (minutosRestantes === 0){
        return `${horas} h`;
    } else {
        return `${horas} h ${minutosRestantes} min`;
    }
}

export function limparTexto(texto){
    return texto.toLowerCase().trim();
}

export function guardarArmazenamento(armazenamento, chave, valor){
    try {
        const valorString = JSON.stringify(valor);
        armazenamento.setItem(chave, valorString);
    } catch (erro) {
        console.warn(`Erro: ${erro.message} | ${chave}.`);
    }
}

export function lerArmazenamento(armazenamento, chave, valorDefeito){
    try {
        const valorGuardado = armazenamento.getItem(chave);

        if (valorGuardado === null){
            return valorDefeito;
        }

        return JSON.parse(valorGuardado);
    } catch (erro) {
        return valorDefeito;
    }
}

export function apagarArmazenamento(armazenamento, chave){
    try {
        armazenamento.removeItem(chave);
    } catch (erro) {
        console.warn(`Erro: ${erro.message} | ${chave}.`);
    }
}
export function validarReceita(receita){
    const listaErros = [];

    if (receita.nome.length < MIN_LETRAS_NOME){
        listaErros.push(`O nome precisa de pelo menos ${MIN_LETRAS_NOME} letras.`);
    }
    if (!Number.isInteger(receita.tempo) || receita.tempo <= 0){
        listaErros.push("O tempo tem de ser um número inteiro maior que 0.");
    }
    if (receita.ingredientes.length === 0){
        listaErros.push("Escreva pelo menos um ingrediente.");
    }
    if (receita.preparacao.length === 0){
        listaErros.push("Escreva pelo menos um passo da preparação.");
    }

    return listaErros;
}

export function preencherLista(elementoLista, itens){
    itens.forEach(item => {
        const itemLi = document.createElement("li");
        itemLi.textContent = item;
        elementoLista.appendChild(itemLi);
    });
}

export function separarTexto(texto, separador){
    return texto.split(separador).map(parte => parte.trim()).filter(parte => parte !== "");
}

export function converterTextoParaLista(texto){
    return separarTexto(texto, "\n");
}

export function separarPorVirgulas(texto){
    return separarTexto(texto, ",");
}

export function converterTextoDespensa(texto){
    return separarPorVirgulas(texto).map(ingrediente => normalizarIngrediente(ingrediente));
}

export function reduzirImagem(ficheiro, largura = LARGURA_IMAGEM, altura = ALTURA_IMAGEM){
    return createImageBitmap(ficheiro)
        .then(imagem => {
            const tela = document.createElement("canvas");
            tela.width = largura;
            tela.height = altura;

            const escala = Math.max(largura / imagem.width, altura / imagem.height);
            const novaLargura = imagem.width * escala;
            const novaAltura = imagem.height * escala;

            const x = (largura - novaLargura) / 2;
            const y = (altura - novaAltura) / 2;

            const contexto = tela.getContext("2d");
            contexto.drawImage(imagem, x, y, novaLargura, novaAltura);

            return tela.toDataURL("image/jpeg", QUALIDADE_JPEG);
        })
        .catch(() => {
            throw new Error("O ficheiro escolhido não é uma imagem válida.");
        });
}

export function tirarAcentos(texto){
    return texto.split("").map(letra => SEM_ACENTO[letra] ?? letra).join("");
}

export function normalizarIngrediente(texto){
    const ingredienteLimpo = limparTexto(texto);
    const ingredienteSemAcentos = tirarAcentos(ingredienteLimpo);

    for (const regra of REGRAS_PLURAL){
        if (ingredienteSemAcentos.endsWith(regra.plural)){
            return ingredienteSemAcentos.slice(0, -regra.plural.length) + regra.singular;
        }
    }

    return ingredienteSemAcentos;
}

export function verificarTemIngredientesBase(receita){
    return Boolean(receita.ingredientesBase) && receita.ingredientesBase.length > 0;
}

export function identificarIngredientesEmFalta(receita, despensa){
    const ingredientesBase = receita.ingredientesBase ?? [];
    return ingredientesBase.filter(ingrediente => {
        const ingredienteNormalizado = normalizarIngrediente(ingrediente);
        return !INGREDIENTES_BASICOS.includes(ingredienteNormalizado) && !despensa.includes(ingredienteNormalizado);
    });
}