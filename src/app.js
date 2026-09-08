import { blocos, salas, reservas } from "./dados.js";

const bloco = document.getElementById("bloco");
const sala = document.getElementById("sala");

blocos.forEach(function (item) {
    bloco.innerHTML += `
        <option value="${item}">Bloco ${item}</option>
    `;
});

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
const filtroNome = document.getElementById("filtroNome");
const filtroSala = document.getElementById("filtroSala");
const filtroData = document.getElementById("filtroData");
const filtroBloco = document.getElementById("filtroBloco");


formReserva.addEventListener("submit", function (event) {
    event.preventDefault(); 

    const novaReserva = {
        solicitante: solicitante.value,
        bloco: bloco.value,
        sala: sala.value,
        data: dataReserva.value,
        turno: turno.value
    };

    const salaOcupada = reservas.some(function (reserva) {

        return reserva.bloco == novaReserva.bloco &&
            reserva.sala == novaReserva.sala &&
            reserva.data == novaReserva.data &&
            reserva.turno == novaReserva.turno



    });

    if (salaOcupada) {
        alertaErro.textContent =
        `Conflito de Agendamento: A Sala ${novaReserva.sala} do Bloco ${novaReserva.bloco} já está ocupada no turno da ${novaReserva.turno} na data selecionada.`;
        alertaErro.classList.remove("d-none");

        return;
    }

reservas.push(novaReserva);
alertaErro.classList.add("d-none");
formReserva.reset();

sala.innerHTML = `
    <option value="">Selecione o bloco</option>
`;

filtroNome.value = "";
filtroData.value = "";
filtroBloco.value = "";

filtroSala.innerHTML = `
    <option value="">Todas</option>
`;

mostrarReservas();

    const modal = bootstrap.Modal.getInstance(
        document.getElementById("modalReserva")
    );
    modal.hide();
});

function mostrarReservas(lista = reservas) {

    listaReservas.innerHTML = "";

    if (lista.length == 0) {
        alertaVazio.classList.remove("d-none");
        atualizarEstatisticas(lista);
        return;
    }

alertaVazio.classList.add("d-none");

listaReservas.innerHTML = lista.map(function (reserva) {

    const dataObjeto = new Date(reserva.data + "T00:00:00");
    const dataFormatada = dataObjeto.toLocaleDateString("pt-BR");
    const indice = reservas.indexOf(reserva);

        return `
            <div class="card mb-2">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h5>${reserva.solicitante}</h5>
                            <p class="mb-1">
                                Bloco ${reserva.bloco} - Sala ${reserva.sala}
                            </p>
                            <p class="mb-0">
                                ${dataFormatada} - ${reserva.turno}
                            </p>
                        </div>
                        <button
                            class="btn btn-danger btn-sm btnExcluir"
                            data-indice="${indice}">
                            Excluir
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join("");

    document.querySelectorAll(".btnExcluir").forEach(function (botao) {
        botao.addEventListener("click", function () {

            const indice = Number(botao.dataset.indice);
            reservas.splice(indice, 1);
            filtrarReservas();

        });

    });

    atualizarEstatisticas(lista);
}

function atualizarEstatisticas(lista = reservas) {

    const totais = lista.reduce(function(acumulador, reserva) {
        acumulador.total++;

        if (reserva.turno == "Manhã") {
            acumulador.manha++;
        }
        if (reserva.turno == "Tarde") {
            acumulador.tarde++;
        }
        if (reserva.turno == "Noite") {
            acumulador.noite++;
        }
        return acumulador;

    }, {
        total: 0,
        manha: 0,
        tarde: 0,
        noite: 0
    });

    document.getElementById("totalReservas").textContent = totais.total;
    document.getElementById("totalManha").textContent = totais.manha;
    document.getElementById("totalTarde").textContent = totais.tarde;
    document.getElementById("totalNoite").textContent = totais.noite;
}

blocos.forEach(function (item) {
    filtroBloco.innerHTML += `<option value="${item}">Bloco ${item}</option>`;
});

filtroBloco.addEventListener("change", function () {
    filtroSala.innerHTML = `<option value="">Todas</option>`;

    if (filtroBloco.value != "") {
        salas[filtroBloco.value].forEach(function (numero) {
            filtroSala.innerHTML += `<option value="${numero}">Sala ${numero}</option>`;
        });
    }

    filtrarReservas();
});

function filtrarReservas() {
    const nome = filtroNome.value.trim().toLowerCase();
    const data = filtroData.value;
    const blocoEscolhido = filtroBloco.value;
    const salaEscolhida = filtroSala.value;

    const resultado = reservas.filter(function (reserva) {
        const bateNome =
            nome === "" || reserva.solicitante.toLowerCase().includes(nome);
        const bateData =
            data === "" || reserva.data === data;
        const bateBloco =
            blocoEscolhido === "" || reserva.bloco === blocoEscolhido;
        const bateSala =
            salaEscolhida === "" || reserva.sala === salaEscolhida;

        return bateNome && bateData && bateBloco && bateSala;
    });

    mostrarReservas(resultado);
}

filtroNome.addEventListener("input", filtrarReservas);
filtroData.addEventListener("input", filtrarReservas);
filtroSala.addEventListener("change", filtrarReservas);

mostrarReservas();
atualizarEstatisticas();
