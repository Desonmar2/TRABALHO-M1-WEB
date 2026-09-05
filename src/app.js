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
const pesquisa = document.querySelector("nav form input");
const botaoBuscar = document.querySelector("nav form button");


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

        return 
            reserva.bloco == novaReserva.bloco &&
            reserva.sala == novaReserva.sala &&
            reserva.data == novaReserva.data &&
            reserva.turno == novaReserva.turno;

    });


    if (salaOcupada) {
        alertaErro.textContent = "esta sala já está reservada para esse dia e turno.";
        alertaErro.classList.remove("d-none");

        return;
    }


    reservas.push(novaReserva);
    alertaErro.classList.add("d-none");

    mostrarReservas();
    atualizarEstatisticas();

    formReserva.reset();
    sala.innerHTML = `
        <option value="">Selecione o bloco</option>
    `;
    const modal = bootstrap.Modal.getInstance(
        document.getElementById("modalReserva")
    );
    modal.hide();

});

function mostrarReservas() {
    listaReservas.innerHTML = "";

    if (reservas.length == 0) {
        alertaVazio.classList.remove("d-none");
        return;

    }

alertaVazio.classList.add("d-none");

reservas.forEach(function (reserva) {
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

botaoBuscar.addEventListener("click", function() {
    const texto = pesquisa.value.trim().toLowerCase();

    if (texto == "") {
        mostrarReservas(reservas);
        return;
    }

    const resultado = reservas.filter(function(reserva) {

        return reserva.solicitante.toLowerCase().includes(texto) ||
               reserva.bloco.toLowerCase().includes(texto) ||
               reserva.sala.toString().includes(texto) ||
               reserva.data.includes(texto) ||
               reserva.turno.toLowerCase().includes(texto);

    });

    mostrarReservas(resultado);

});

pesquisa.addEventListener("input", function() {

    if (pesquisa.value == "") {
        mostrarReservas(reservas);
    }

});