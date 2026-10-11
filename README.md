# Prato do Dia

## Sobre o projeto

Projeto desenvolvido no âmbito do módulo de Programação em Javascript no programa UPSKILL - Digital Skills & Jobs resultante da parceria entre o Instituto do Emprego e Formação Profissional, a Universidade Politécnica do Cávado e Ave e a Deloitte.

É uma aplicação web de receitas tradicionais que permite ao utilizador navegar pelas receitas guardadas, marcar como favoritas, adicionar as suas próprias receitas, e ver o que consegue cozinhar com os ingredientes que tem em casa.

## GitHub pages

[vitorbsantosdev.github.io/prato-do-dia](https://vitorbsantosdev.github.io/prato-do-dia/)

## Correr localmente

Para correr o programa localmente, siga os seguintes passos pela ordem apresentada:

1. **Clonar o repositório:** no Git Bash, introduza o comando:

   ```bash
   git clone https://github.com/VitorBSantosDev/prato-do-dia.git
   ```

2. **Abrir a pasta** `prato-do-dia` no VS Code.
3. **Instalar a extensão Live Server**, se ainda não estiver instalada.
4. **Abrir com o Live Server:** botão direito no `index.html` → "Open with Live Server".

Nota: não abra o ficheiro `index.html` com duplo clique, uma vez que o `fetch` do ficheiro `dados.json` e os `import` dos módulos só funcionam através de um servidor, e com o ficheiro aberto diretamente o browser bloqueia-os.

## Funcionalidades

* pesquisa por nome, filtro por categoria e ordenação (nome, mais rápidas, mais demoradas);
* favoritos (♥), com o filtro "Só favoritas";
* resumo com o número de receitas, o tempo médio e o número de favoritas;
* modo de preparação numa janela (modal), com a imagem da receita;
* adicionar receitas próprias, com validação e fotografia opcional (reduzida automaticamente);
* remover receitas, com uma janela de confirmação, e repor as removidas;
* **despensa:** escrever o que tens em casa e ver as receitas que consegues fazer, e o que falta;
* rascunho do formulário (não se perde ao recarregar a página);
* modo claro e escuro;
* adaptado para telemóvel e tablet;
* botões flutuantes para voltar ao topo e para adicionar uma receita;
* botão de filtro (funil) que abre os filtros num painel quando se está a percorrer as receitas, com o número de filtros ativos;
* botão "Limpar" para repor todos os filtros;
* mensagem de erro com botão "Tentar novamente" se as receitas não carregarem.

## Tecnologias

- HTML5, CSS3 (variáveis, Flexbox, Grid, media queries) e JavaScript ES6+;
- módulos ES (`import`/`export`);
- `fetch` + `async/await` para ler o `dados.json`, e Promises com `.then()/.catch()` para as imagens;
- `localStorage` e `sessionStorage`;
- `<dialog>` para as janelas modais;
- `canvas` para reduzir as fotografias.

## Estrutura dos ficheiros

```
├── index.html
├── style.css
├── dados.json
├── img/
└── js/
    ├── main.js
    ├── api.js
    ├── receitas.js
    ├── filtros.js
    ├── cartoes.js
    ├── formulario.js
    ├── modais.js
    ├── copiaSeguranca.js
    ├── favoritos.js
    ├── funil.js
    ├── tema.js
    └── utilitarias.js
```

| Ficheiro | Responsabilidade |
|---|---|
| `main.js` | ponto de entrada: lê, limpa e conta os filtros escolhidos, desenha a lista e o resumo, e liga os restantes módulos |
| `api.js` | carrega as receitas do `dados.json` com `fetch` |
| `receitas.js` | gere os dados das receitas (iniciais, próprias e removidas), guardados numa closure, e sabe identificar as receitas próprias |
| `filtros.js` | filtra e ordena as receitas (função pura, sem acesso ao HTML) |
| `cartoes.js` | cria o cartão de uma receita (favorito, etiqueta da despensa, ingredientes e botões) |
| `formulario.js` | formulário de adicionar receita: leitura, validação, fotografia, mensagens e rascunho |
| `modais.js` | janelas do modo de preparação e da confirmação de remoção |
| `copiaSeguranca.js` | exportar e importar as receitas próprias num ficheiro `.json` |
| `favoritos.js` | lista de favoritos, guardada numa closure |
| `funil.js` | botão de filtro (funil): mostra-o quando os filtros saem do ecrã, abre e fecha o painel e atualiza o contador de filtros ativos |
| `tema.js` | modo claro e escuro |
| `utilitarias.js` | funções reutilizáveis: tempo, texto, validação, armazenamento, imagens e despensa |

Os módulos não importam o `main.js`: é o `main.js` que lhes entrega as funções a chamar (por exemplo, `iniciarFormulario(aoAdicionarReceita)`), o que evita dependências circulares.

## Como os dados são guardados

* **as receitas iniciais** vêm do `dados.json` (apenas leitura);
* **as receitas novas, as removidas, os favoritos, a despensa e o tema** ficam guardadas no **`localStorage`** (permanente, só neste browser);
* **o rascunho do formulário** fica no **`sessionStorage`** (desaparece ao fechar o separador).

As receitas novas são guardadas no `localStorage` em vez do ficheiro `dados.json` porque o browser não pode alterar ficheiros, e o GitHub Pages não tem servidor.

As chaves utilizadas são `prato-favoritos`, `prato-minhas-receitas`, `prato-removidas`, `prato-despensa`, `prato-tema` e `prato-rascunho`.

## Requisitos do projeto

Onde cada um dos requisitos do enunciado é cumprido no código:

| Requisito | Como é cumprido | Onde |
| --- | --- | --- |
| **1. Lógica e controlo de fluxo** | `if/else` e cláusulas de guarda nos filtros e na validação; `switch` na ordenação das receitas; operadores ternários no botão de favorito e no singular/plural das mensagens; ciclos `for...of` e `forEach`; `map`, `filter`, `some` e `reduce` (soma dos tempos para o tempo médio) | `filtros.js` (`filtrarEOrdenarReceitas`), `main.js` (`mostrarResumoFiltro`), `cartoes.js`, `utilitarias.js` |
| **2. Manipulação de dados simples** | formatação do tempo (`75` → "1 h 15 min"); pesquisa sem distinção de maiúsculas (`toLowerCase`, `trim`); validação do formulário (`Number.isInteger` no tempo, comprimento do nome); conversão de texto para número (`Number`); normalização de ingredientes (acentos, singular/plural); booleanos das checkboxes (`.checked`) | `utilitarias.js` (`formatarTempo`, `limparTexto`, `validarReceita`, `tirarAcentos`, `normalizarIngrediente`) |
| **3. Manipulação de dados complexos** | arrays de objetos (receitas); ordenação feita sobre uma cópia (`[...receitasFiltradas]`); junção de arrays com spread (`[...receitas, ...minhasReceitas]`); adicionar e remover itens sem alterar o array original (spread e `filter`) | `receitas.js` (`adicionarReceitas`, `removerReceita`), `filtros.js`, `favoritos.js`, `copiaSeguranca.js` |
| **4. Manipulação do DOM** | cartões criados com `document.createElement`, template strings, `innerHTML`, `textContent` e `appendChild`; listas de ingredientes, passos e erros geradas dinamicamente; `classList` e `hidden` para mostrar estados | `cartoes.js` (`criarCartao`), `main.js` (`mostrarReceitas`), `modais.js` (`abrirPreparacao`), `utilitarias.js` (`preencherLista`) |
| **5. Reatividade e eventos** | `input` (pesquisa, despensa, rascunho do formulário), `change` (selects, checkboxes, importar), `click` (favorito, ver preparação, remover, repor, limpar filtros, tentar novamente, funil, modais, exportar, tema), `submit` (adicionar receita), `scroll` e `resize` (mostrar o botão do funil) e `keydown` (fechar o painel com Esc); propagação de eventos no formulário e nos filtros; badges de estado ("Tem tudo" / "Falta") e contador de filtros ativos | `main.js`, `cartoes.js`, `formulario.js`, `modais.js`, `copiaSeguranca.js`, `tema.js`, `funil.js` |
| **6. Scope e closures** | `criarFavoritos`, `criarGestorReceitas` e `iniciarFunil` guardam os dados em variáveis privadas, acessíveis só pelas funções que devolvem; `const`/`let` usados conforme o valor muda ou não; constantes e variáveis privadas a cada módulo (sem `export`), como `temporizadorSucesso`, `receitaPorRemover` e `PREFIXO_RECEITA_PROPRIA` (os outros módulos usam `criarIdReceitaPropria` e `verificarEReceitaPropria` sem conhecer o prefixo); as funções entregues aos módulos (como `obterMinhasReceitas`) devolvem sempre a lista atual | `favoritos.js`, `receitas.js`, `formulario.js`, `modais.js`, `main.js`, `funil.js` |
| **7. Assincronismo** | `fetch` do `dados.json` com `async/await` e `try/catch` (mensagem para o utilizador, detalhe técnico na consola e botão "Tentar novamente"); Promise com `.then()/.catch()` para reduzir a fotografia (`createImageBitmap` + `canvas`); `await` dessa Promise no envio do formulário; leitura do ficheiro importado com `await ficheiro.text()`; `setTimeout`/`clearTimeout` na mensagem de sucesso | `api.js` (`carregarReceitas`), `utilitarias.js` (`reduzirImagem`), `formulario.js`, `copiaSeguranca.js` |
| **8. Modularização** | código dividido em 12 módulos ligados com `import`/`export`, cada um com uma responsabilidade; funções utilitárias reutilizáveis num ficheiro próprio | `js/` |
| **Persistência de dados** | `localStorage` para favoritos, receitas novas, receitas removidas, despensa e tema; `sessionStorage` para o rascunho do formulário; as mesmas funções (`guardarArmazenamento`, `lerArmazenamento`, `apagarArmazenamento`) servem os dois, recebendo o armazenamento como parâmetro | `utilitarias.js`, `receitas.js`, `favoritos.js`, `formulario.js`, `tema.js`, `main.js` |

## Boas práticas (Clean Code e SOLID)

- **Nomes que revelam a intenção:** funções com verbo (`filtrarEOrdenarReceitas`, `verificarTemIngredientesBase`, `criarIdReceitaPropria`), variáveis em camelCase e constantes em UPPER_SNAKE_CASE.
- **Sem números mágicos:** valores com nome, como `DURACAO_MENSAGEM_MS`, `MIN_LETRAS_NOME` e `PREFIXO_RECEITA_PROPRIA`.
- **Funções pequenas e cláusulas de guarda:** cada função faz uma coisa; os casos especiais saem logo no início (`if (...) return;`).
- **DRY e fonte única de verdade:** código repetido extraído para funções (`mostrarErros`, `preencherLista`, `separarTexto`, `adicionarReceitas`) e valores partilhados numa só constante (`TODAS_CATEGORIAS`).
- **Funções puras:** a filtragem e a ordenação (`filtrarEOrdenarReceitas`) recebem os dados e os critérios e devolvem o resultado, sem tocar no HTML, o que as torna fáceis de testar.
- **Responsabilidade única (S):** cada módulo trata de uma parte da aplicação.
- **Aberto/fechado (O):** as regras do plural, os acentos e os ingredientes básicos estão em listas; acrescentar um caso não obriga a mudar as funções.
- **Inversão de dependências (D):** as funções de armazenamento recebem o armazenamento como parâmetro, e os módulos recebem do `main.js` as funções a chamar em vez de o importarem.
- **Segregação de interfaces (I):** cada módulo recebe só o que usa; por exemplo, o `iniciarFunil` recebe apenas a função que conta os filtros ativos, e o "Limpar" é tratado no `main.js`.
- **Liskov (L):** não se aplica, porque o projeto não usa classes nem herança.

## Autor

**Vitor Santos**
[linkedin.com/in/vitor-b-santos](https://linkedin.com/in/vitor-b-santos) · [github.com/VitorBSantosDev](https://github.com/VitorBSantosDev)
