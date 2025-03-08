// Função para obter a pontuação passada pela URL
function obterPontuacao() {
    const urlParams = new URLSearchParams(window.location.search);
    return parseInt(urlParams.get("score"), 10); // Pegando o valor de score da URL
}

// Função para salvar o novo recorde no localStorage
function salvarRecorde(nome, saldo, data) {
    let recordes = JSON.parse(localStorage.getItem("recordes")) || [];

    // Criação do novo recorde
    const novoRecorde = { nome, saldo, data };

    // Adicionando o novo recorde à lista
    recordes.push(novoRecorde);

    // Ordenando os recordes de maior para menor
    recordes.sort((a, b) => b.saldo - a.saldo);

    // Mantendo apenas os 10 melhores
    recordes = recordes.slice(0, 10);

    // Salvando os recordes no localStorage
    localStorage.setItem("recordes", JSON.stringify(recordes));

    // Recarregar a tabela
    exibirRecordes();
}

// Função para exibir os recordes
function exibirRecordes() {
    const recordes = JSON.parse(localStorage.getItem("recordes")) || [];

    // Garantir que o elemento da tabela existe antes de tentar manipulá-lo
    const tabela = document.getElementById("tabela-recordes");

    if (!tabela) {
        console.error("Tabela não encontrada!");
        return;
    }

    const tbody = tabela.getElementsByTagName("tbody")[0];
    if (!tbody) {
        console.error("Corpo da tabela não encontrado!");
        return;
    }

    tbody.innerHTML = ""; // Limpa a tabela antes de preencher com os novos dados

    recordes.forEach((recorde, index) => {
        const linha = tbody.insertRow();
        linha.innerHTML = `
            <td>${index + 1}</td>
            <td>${recorde.nome}</td>
            <td>${recorde.saldo}</td>
            <td>${recorde.data}</td>
        `;
    });
}

// Função para verificar se a pontuação deve ser salva
function verificarRecorde() {
    const pontuacao = obterPontuacao(); // Pega a pontuação da URL
    if (pontuacao) {
        const nome = prompt("Digite seu nome para salvar o recorde:");
        const data = new Date().toLocaleDateString();

        // Salva o recorde se o nome for preenchido
        if (nome) {
            salvarRecorde(nome, pontuacao, data);
        }
    }
}

// Ao carregar a página, verificamos o recorde e exibimos os dados
document.addEventListener("DOMContentLoaded", () => {
    verificarRecorde();
    exibirRecordes();
});
