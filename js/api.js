export async function carregarReceitas(){
    const resposta = await fetch("dados.json");
    
    if (!resposta.ok){
        throw new Error(`Não foi possível carregar as receitas (erro ${resposta.status}).`);
    }

    const receitas = await resposta.json();

    return receitas;
}