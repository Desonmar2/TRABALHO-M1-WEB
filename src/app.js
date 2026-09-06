// ===== app.js =====
// PONTO DE ENTRADA. E o unico arquivo que o HTML chama:
//   <script type="module" src="src/app.js">
// O browser baixa dados.js, logica.js e ui.js sozinho, seguindo estes import.
// O que o app.js faz:
//   1. guarda o estado (o array 'estado' = unica fonte da verdade)
//   2. registra os eventos (filtros, cascata, submit, excluir)
//   3. orquestra: todo evento termina chamando atualizarTela()

import { infraestrutura , agendamentosIniciais,  } from './dados.js';
import { calcularMetricas, aplicarFiltros, listarBlocos, salasDoBloco, existeColisao, proximoId } from './logica.js';
import { alternarAlertaVazio, renderizarLista, renderizarMetricas, lerFiltros, popularSelect,
         mostrarErroModal, limparErroModal, resetarFormulario, fecharModal} from './ui.js';

// [...agendamentosIniciais] = copia do array de dados.js (nao mexo no original).
// 'let' porque o excluir reatribui: estado = estado.filter(...).
let estado = [... agendamentosIniciais];


// atualizarTela() = funcao central. A tela e sempre um reflexo do estado.
// le os filtros -> aplica no estado -> desenha lista + metricas + alerta vazio
// SEMPRE a partir da listaVisivel (lista ja filtrada), nunca do estado direto.
function atualizarTela() {

    const filtros = lerFiltros();
    const listaVisivel = aplicarFiltros(estado, filtros);

    renderizarLista(listaVisivel);
    renderizarMetricas(calcularMetricas(listaVisivel));
    alternarAlertaVazio(listaVisivel.length === 0);
}


// --- carga inicial dos <select> ---
// listarBlocos devolve ["Bloco A","Bloco B","Bloco C"]; os selects de sala
// comecam vazios (so a opcao neutra) e sao preenchidos pela cascata.
const nomesDosBlocos = listarBlocos(infraestrutura);

popularSelect("filtroBloco", nomesDosBlocos, "Todos");
popularSelect("filtroSala", [], "Todas");
popularSelect("bloco", nomesDosBlocos, "Selecione");
popularSelect("sala", [], "Selecione o bloco");


// --- eventos dos filtros ---
// input = dispara a cada tecla (busca em tempo real no campo de texto)
// change = dispara quando muda a opcao do <select>
// passo 'atualizarTela' sem () = "chame essa funcao quando o evento acontecer"
document.getElementById("filtroNome").addEventListener("input", atualizarTela);
document.getElementById("filtroData").addEventListener("input", atualizarTela);
document.getElementById("filtroSala").addEventListener("change", atualizarTela);

// cascata: trocar o bloco recarrega as salas daquele bloco e re-filtra
document.getElementById("filtroBloco").addEventListener("change", () => {
    const blocoEscolhido = document.getElementById("filtroBloco").value;
    const salas = salasDoBloco(infraestrutura, blocoEscolhido);
    popularSelect("filtroSala", salas, "Todas");
    atualizarTela();
});

// cascata do formulario da modal: mesma ideia, so recarrega o select de sala
document.getElementById("bloco").addEventListener("change", () => {
    const blocoEscolhido = document.getElementById("bloco").value;
    const salas = salasDoBloco(infraestrutura, blocoEscolhido);
    popularSelect("sala", salas, "Selecione");
});


// --- submit do formulario de nova reserva ---
// evento.preventDefault() = impede o comportamento padrao do form (recarregar
// a pagina). Sem isso nada funciona.
document.getElementById("formReserva").addEventListener("submit", (evento) => {
    evento.preventDefault();

    const novaReserva = {
        solicitante: document.getElementById("solicitante").value,
        bloco: document.getElementById("bloco").value,
        sala: document.getElementById("sala").value,
        data: document.getElementById("data").value,
        turno: document.getElementById("turno").value,
    };

    // COM colisao: mostra o alerta vermelho dentro da modal e para (return).
    // A modal NAO fecha (requisito 3.3 do enunciado).
    if (existeColisao(estado, novaReserva)) {
        const mensagem = `Conflito de Agendamento: A ${novaReserva.sala} do ${novaReserva.bloco} já está ocupada no turno da ${novaReserva.turno} na data selecionada.`;
        mostrarErroModal(mensagem);
        return;
    }

    // SEM colisao: da o id, adiciona no estado, limpa erro, fecha modal via JS,
    // reseta o formulario e redesenha a tela.
    novaReserva.id = proximoId(estado);
    estado.push(novaReserva);

    limparErroModal();
    fecharModal();
    resetarFormulario();
    atualizarTela();
});


// --- excluir reserva (DELEGACAO DE EVENTOS) ---
// Escuto o clique no container #listaReservas (fixo no HTML), nao em cada botao.
// Motivo: os botoes sao recriados toda vez que renderizarLista roda (innerHTML
// e reescrito); um listener preso no botao sumiria junto.
// evento.target = o elemento clicado. Se nao for um .btn-excluir, ignoro.
// dataset.id = o data-id do botao (vem como texto -> Number() converte).
// filter cria um array novo SEM a reserva daquele id (mantem os id diferentes).
document.getElementById("listaReservas").addEventListener("click", (evento) => {
    const elementoClicado = evento.target;

    if (elementoClicado.classList.contains("btn-excluir") === false) {
        return;
    }

    const idTexto = elementoClicado.dataset.id;
    const id = Number(idTexto);

    estado = estado.filter(reserva => {
        return reserva.id !== id;
    });

    atualizarTela();
});


// --- campo de busca da navbar (topo) ---
// Nao tem logica propria: so copia o texto pro #filtroNome e manda re-renderizar.
// input = filtra a cada tecla. submit = quando aperta Enter / clica Buscar
// (o preventDefault evita recarregar a pagina).
document.getElementById("buscaTopo").addEventListener("input", (evento) => {
    document.getElementById("filtroNome").value = evento.target.value;
    atualizarTela();
});

document.getElementById("formBuscaTopo").addEventListener("submit", (evento) => {
    evento.preventDefault();
    document.getElementById("filtroNome").value = document.getElementById("buscaTopo").value;
    atualizarTela();
});


// primeira pintura da tela ao carregar a pagina
atualizarTela();



