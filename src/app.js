import { blocos, salas, reservas } from "./dados.js";

const bloco = document.getElementById("bloco");
const sala = document.getElementById("sala");

// Preenche o <select> de blocos com as opções que vêm do arquivo de dados
blocos.forEach(function (item) {
    bloco.innerHTML += `
        <option value="${item}">Bloco ${item}</option>
    `;
});

// Quando o usuário escolhe um bloco, monta a lista de salas daquele bloco
bloco.addEventListener("change", function () {
    sala.innerHTML = `<option value="">Selecione a sala</option>`;

    if (bloco.value != "") {
        salas[bloco.value].forEach(function (numero) {
            sala.innerHTML += `
                <option value="${numero}">Sala ${numero}</option>
            `;
        });
    }
});

const formReserva = document.getElementById("formReserva");
const solicitante = document.getElementById("solicitante");
const dataReserva = document.getElementById("data");
const turno = document.getElementById("turno");
const listaReservas = document.getElementById("listaReservas");
const alertaVazio = document.getElementById("alertaVazio");
const alertaErro = document.getElementById("alertaErro");
const pesquisa = document.querySelector("nav form input");
const botaoBuscar = document.querySelector("nav form button");
const filtroNome = document.getElementById("filtroNome");
const filtroSala = document.getElementById("filtroSala");
const filtroData = document.getElementById("filtroData");
const filtroBloco = document.getElementById("filtroBloco");



// Cuida do envio do formulário de nova reserva
formReserva.addEventListener("submit", function (event) {
    event.preventDefault(); // evita que a página recarregue

    // Junta tudo que o usuário preencheu num único objeto
    const novaReserva = {
        solicitante: solicitante.value,
        bloco: bloco.value,
        sala: sala.value,
        data: dataReserva.value,
        turno: turno.value
    };

    // Verifica se já existe uma reserva pro mesmo bloco, sala, data e turno
    const salaOcupada = reservas.some(function (reserva) {

         return reserva.bloco == novaReserva.bloco &&
         reserva.sala == novaReserva.sala &&
         reserva.data == novaReserva.data &&
         reserva.turno == novaReserva.turno



    });

    // Se a sala já estiver ocupada, mostra o erro e para por aqui
    if (salaOcupada) {
        alertaErro.textContent = "esta sala já está reservada para esse dia e turno.";
        alertaErro.classList.remove("d-none");

        return;
    }

    // Deu tudo certo: guarda a reserva, salva e atualiza a tela
    reservas.push(novaReserva);
    salvarReservas();
    alertaErro.classList.add("d-none");

    mostrarReservas();
    atualizarEstatisticas();

    // Limpa o formulário e fecha o modal
    formReserva.reset();
    sala.innerHTML = `
        <option value="">Selecione o bloco</option>
    `;
    const modal = bootstrap.Modal.getInstance(
        document.getElementById("modalReserva")
    );
    modal.hide();

});

// Salva a lista de reservas no localStorage pra não perder ao fechar a página
function salvarReservas() {
    localStorage.setItem("reservas", JSON.stringify(reservas));
}

// Desenha na tela a lista de reservas (por padrão mostra todas)
function mostrarReservas(lista = reservas) {
    listaReservas.innerHTML = "";

    // Se não tiver nada pra mostrar, exibe o aviso de "vazio" e para
    if (lista.length == 0) {
        alertaVazio.classList.remove("d-none");
        return;

    }

alertaVazio.classList.add("d-none");

// Cria um cartão para cada reserva
lista.forEach(function (reserva) {
// Vira a data de 2026-09-06 para 06/09/2026
const dataFormatada = reserva.data.split("-").reverse().join("/");

listaReservas.innerHTML += `
        <div class="border rounded p-3 mb-2">
            <h5>${reserva.solicitante}</h5>
            <p class="mb-1">
                Bloco ${reserva.bloco} - Sala ${reserva.sala}
            </p>
            <p class="mb-0">
                ${dataFormatada} - ${reserva.turno}
            </p>
        </div>
     `;
});
}

// Atualiza os contadores do topo: total geral e total por turno
function atualizarEstatisticas() {
    document.getElementById("totalReservas").textContent =
        reservas.length;

    document.getElementById("totalManha").textContent =
        reservas.filter(function (reserva) {
            return reserva.turno == "Manhã";
        }).length;

    document.getElementById("totalTarde").textContent =
        reservas.filter(function (reserva) {
            return reserva.turno == "Tarde";
        }).length;

    document.getElementById("totalNoite").textContent =
        reservas.filter(function (reserva) {
            return reserva.turno == "Noite";
        }).length;

}

// Busca da barra de navegação: filtra reservas por qualquer campo
botaoBuscar.addEventListener("click", function() {
    const texto = pesquisa.value.trim().toLowerCase();

    // Campo vazio: mostra todas as reservas
    if (texto == "") {
        mostrarReservas(reservas);
        return;
    }

    // Mantém só as reservas em que o texto digitado aparece em algum campo
    const resultado = reservas.filter(function(reserva) {

        return reserva.solicitante.toLowerCase().includes(texto) ||
               reserva.bloco.toLowerCase().includes(texto) ||
               reserva.sala.toString().includes(texto) ||
               reserva.data.includes(texto) ||
               reserva.turno.toLowerCase().includes(texto);

    });

    mostrarReservas(resultado);

});


// Se o usuário apagar tudo do campo de busca, volta a mostrar todas
pesquisa.addEventListener("input", function() {

    if (pesquisa.value == "") {
        mostrarReservas(reservas);
    }

});



// Preenche o <select> de bloco da área de filtros
blocos.forEach(function (item) {
    filtroBloco.innerHTML += `<option value="${item}">Bloco ${item}</option>`;
});


// Ao trocar o bloco no filtro, atualiza as salas disponíveis e refiltra
filtroBloco.addEventListener("change", function () {
    filtroSala.innerHTML = `<option value="">Todas</option>`;

    if (filtroBloco.value != "") {
        salas[filtroBloco.value].forEach(function (numero) {
            filtroSala.innerHTML += `<option value="${numero}">Sala ${numero}</option>`;
        });
    }

    filtrarReservas();
});

// Aplica os filtros de nome, data, bloco e sala ao mesmo tempo
function filtrarReservas() {
    const nome = filtroNome.value.trim().toLowerCase();
    const data = filtroData.value;
    const blocoEscolhido = filtroBloco.value;
    const salaEscolhida = filtroSala.value;

    const resultado = reservas.filter(function (reserva) {
        // Cada "bate..." é true quando o filtro está vazio ou quando casa com a reserva
        const bateNome =
            nome === "" || reserva.solicitante.toLowerCase().includes(nome);

        const bateData =
            data === "" || reserva.data === data;

        const bateBloco =
            blocoEscolhido === "" || reserva.bloco === blocoEscolhido;

        const bateSala =
            salaEscolhida === "" || reserva.sala === salaEscolhida;

        // Só passa quem atende a todos os filtros
        return bateNome && bateData && bateBloco && bateSala;
    });

    mostrarReservas(resultado);
}

// Refaz o filtro sempre que um dos campos muda
filtroNome.addEventListener("input", filtrarReservas);
filtroData.addEventListener("input", filtrarReservas);
filtroSala.addEventListener("change", filtrarReservas);


// Ao abrir a página, já mostra as reservas e os números do topo
mostrarReservas();
atualizarEstatisticas();
