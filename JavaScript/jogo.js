// Variáveis globais 
var acertos = 0, perdidos = 0, errados = 0;
var intervalo = 3000, janela = 1000;
var dificuldade = 1, intervaloMinimo = 500;
var toupeirasAtivas = 0, maxToupeiras = 2;
var jogoAtivo = false, saldo = 0;

// Inicialização ao carregar a página
window.onload = function () {
    let startButton = document.getElementById('start');
    let gramado = document.getElementById('idGramado');

    if (startButton) startButton.addEventListener('click', toggleJogo);
    if (gramado) {
        gramado.addEventListener('mousedown', marteloBaixo);
        gramado.addEventListener('mouseup', marteloCima);
    }

    for (let i = 0; i < 5; i++) {
        let buraco = document.getElementById('buraco' + i);
        if (buraco) buraco.addEventListener('click', martelada);
    }
};

// Iniciar ou parar o jogo
function toggleJogo() {
    jogoAtivo ? pararJogo() : iniciarJogo();
}

// Função para iniciar o jogo
function iniciarJogo() {
    jogoAtivo = true;
    document.getElementById('start').textContent = "Stop";
    console.log("Jogo iniciado!");

    // Resetar pontuação
    acertos = 0; perdidos = 0; errados = 0;
    mostraPontuacao();

    sobeToupeira();
}

// Função para parar o jogo
function pararJogo() {
    jogoAtivo = false;
    document.getElementById('start').textContent = "Start";
    console.log("Jogo parado!");

    // Verifique o valor de saldo antes de salvar
    if (saldo > 0) {
        localStorage.setItem("lastScore", saldo);
    }
    verificarRecorde();
}

// Lógica de surgimento das toupeiras
function sobeToupeira() {
    if (!jogoAtivo || toupeirasAtivas >= maxToupeiras) return;

    let buraco;
    do {
        buraco = Math.floor(Math.random() * 5);
    } while (document.getElementById('buraco' + buraco).src.includes('hole-mole'));

    let objBuraco = document.getElementById('buraco' + buraco);
    if (!objBuraco) return;

    objBuraco.src = '../HTML/Imagens/hole-mole.png';
    toupeirasAtivas++;

    setTimeout(() => {
        if (objBuraco.src.includes('hole-mole')) {
            objBuraco.src = '../HTML/Imagens/hole.png';
            perdidos++;
            mostraPontuacao();
        }
        toupeirasAtivas--;
    }, janela);

    setTimeout(sobeToupeira, Math.max(intervalo - (dificuldade * 1000), intervaloMinimo));
}

// Atualiza a pontuação na tela
function mostraPontuacao() {
    saldo = Math.max(acertos - perdidos - errados, 0);
    ['acertos', 'perdidos', 'errados', 'saldo'].forEach(display => {
        mostraPontuacaoDe(display, eval(display));
    });
}

function mostraPontuacaoDe(display, valor) { 
    let container = document.getElementById(display);
    
    if (!container) {
        console.error(`Elemento com id '${display}' não encontrado.`);
        return;
    }

    let objCentena = container.children[0];
    let objDezena = container.children[1];
    let objUnidade = container.children[2];

    let unidade = valor % 10;
    let dezena = Math.floor((valor % 100) / 10);
    let centena = Math.floor(valor / 100);

    console.log(`Atualizando visor: ${centena}${dezena}${unidade}`);

    objUnidade.src = `../HTML/Imagens/caractere_${unidade}.gif`;
    objDezena.src = `../HTML/Imagens/caractere_${dezena}.gif`;
    objCentena.src = `../HTML/Imagens/caractere_${centena}.gif`;
}


// Animação do martelo
function marteloBaixo() {
    document.getElementById('idGramado').style.cursor = 'url(../HTML/Imagens/hammerDown.png), default';
}

function marteloCima() {
    document.getElementById('idGramado').style.cursor = 'url(../HTML/Imagens/Hammer.png), default';
}

// Função para lidar com a martelada
function martelada(evento) {
    if (!evento.target.src.includes('hole-mole')) {
        errados += 1;
    } else {
        acertos += 1;
        evento.target.src = '../HTML/Imagens/hole.png';
        toupeirasAtivas--;
    }
    mostraPontuacao();
}

function verificarRecorde() {
    let recordes = JSON.parse(localStorage.getItem('recordes')) || [];
    if (recordes.length < 10 || saldo > recordes[recordes.length - 1].saldo) {
        let nome = prompt("Parabéns! Você fez um novo recorde. Digite seu nome:");
        if (nome) {
            let novoRecorde = { nome, saldo, data: new Date().toLocaleDateString() };
            recordes.push(novoRecorde);
            recordes.sort((a, b) => b.saldo - a.saldo);
            if (recordes.length > 10) recordes = recordes.slice(0, 10);
            localStorage.setItem('recordes', JSON.stringify(recordes));
            alert("Recorde salvo!");
        }
    } else {
        alert("Você não conseguiu bater o recorde, mas continue tentando!");
    }
}

function exibirRecordes() {
    let recordes = JSON.parse(localStorage.getItem('recordes')) || [];
    let tabela = document.getElementById('tabelaRecordes').getElementsByTagName('tbody')[0];
    tabela.innerHTML = '';
    recordes.forEach((recorde, index) => {
        let linha = tabela.insertRow();
        [index + 1, recorde.nome, recorde.saldo, recorde.data].forEach((valor, i) => {
            linha.insertCell(i).textContent = valor;
        });
    });
}
