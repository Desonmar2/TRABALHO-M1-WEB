// ===== ui.js =====
// Modulo da INTERFACE. E o unico que toca no HTML (document.getElementById,
// innerHTML, classList...). Nao tem regra de negocio aqui: recebe tudo pronto
// por parametro e so desenha / mostra / esconde.


// renderizarLista(lista) -> desenha os cards dentro de #listaReservas
// lista = array de reservas (ja filtrado, vem do app.js).
// map transforma cada reserva numa string de HTML (template string com crase),
// join("") cola tudo num texto so, e innerHTML joga na pagina de uma vez.
// O botao leva data-id="${reserva.id}" -> o app.js le esse id no clique pra excluir.
export function renderizarLista(lista) {
    const container = document.getElementById("listaReservas") // linha 129 do HTML injeta a lista
     




    container.innerHTML = 
    lista.map(reserva => `
      <div class="reserva-card d-flex justify-content-between align-items-center">
            <div>
          <strong>${reserva.solicitante}</strong><br>
          ${reserva.bloco} — ${reserva.sala}<br>
          <span class="text-secondary">${formatarData(reserva.data)} · ${reserva.turno}</span>
        </div>
        <button class="btn btn-danger btn-sm btn-excluir" data-id="${reserva.id}">Excluir</button>
      </div>
    `)
    .join("");
}
// lista.map(reserva  => ... ) .join("");  map transforma em cada objeto em string de html
// join("") cola tudo no em um texto  e container.innerHTLM desenha na pagina//

export function alternarAlertaVazio(vazio) {
  document.getElementById("alertaVazio").classList.toggle("d-none", !vazio);
  document.getElementById("listaReservas").classList.toggle("d-none", vazio);
}
// vazio é um bolleano, ele lica com o ByID elerta e lista acima,
//  classList.toggle("d-none", condiçao) !vazio ou vazio
// vazio= true  !vazio = false  se lista some quando esta vazia.



// renderizarMetricas(metricas) -> escreve os numeros nos 4 cartoes do topo
// metricas = objeto que vem do calcularMetricas: { total, manha, tarde, noite }.
// textContent troca so o texto de dentro do <h2> (mais seguro/rapido que innerHTML
// quando e so um numero).
export function renderizarMetricas(metricas) {
  document.getElementById("totalReservas").textContent = metricas.total;
  document.getElementById("totalManha").textContent = metricas.manha;
  document.getElementById("totalTarde").textContent = metricas.tarde;
  document.getElementById("totalNoite").textContent = metricas.noite;
}


// lerFiltros() -> { nome, data, bloco, sala }
// Le o .value dos 4 campos de busca e devolve num objeto.
// .value de input/select = o que esta digitado/selecionado; vazio = "".
// O app.js pega esse objeto e passa pro aplicarFiltros.
export function lerFiltros() {
  return {
    nome: document.getElementById("filtroNome").value,
    data: document.getElementById("filtroData").value,
    bloco: document.getElementById("filtroBloco").value,
    sala: document.getElementById("filtroSala").value,
  };
}

// popularSelect(idSelect, listaDeTextos, textoPrimeiraOpcao)
// Funcao generica que enche qualquer <select> com <option>.
//  - idSelect: id do select (ex: "filtroBloco")
//  - listaDeTextos: array de strings (ex: ["Bloco A", "Bloco B"])
//  - textoPrimeiraOpcao: a opcao neutra do topo ("Todos", "Selecione"...)
// Monto a string de options num for e jogo tudo de uma vez no innerHTML.
// A 1a opcao tem value="" -> e o "vazio" que o aplicarFiltros ignora.
export function popularSelect(idSelect, listaDeTextos, textoPrimeiraOpcao) {
  const select = document.getElementById(idSelect);

  let html = `<option value="">${textoPrimeiraOpcao}</option>`;

  for (const texto of listaDeTextos) {
    html = html + `<option value="${texto}">${texto}</option>`;
  }

  select.innerHTML = html;
}

// mostrarErroModal(mensagem) -> escreve a msg no alerta vermelho e o exibe
// (tira a classe d-none do <div id="alertaErro"> que fica dentro da modal).
// Chamado quando existeColisao retorna true.
export function mostrarErroModal(mensagem) {
  const alerta = document.getElementById("alertaErro");
  alerta.textContent = mensagem;
  alerta.classList.remove("d-none");
}

// limparErroModal() -> esvazia o texto e esconde de novo o alerta vermelho.
export function limparErroModal() {
  const alerta = document.getElementById("alertaErro");
  alerta.textContent = "";
  alerta.classList.add("d-none");
}

// resetarFormulario() -> limpa os campos da modal depois de salvar.
// .reset() zera todos os inputs/selects; e como o select de sala e dinamico,
// volto ele pro estado vazio na mao.
export function resetarFormulario() {
  document.getElementById("formReserva").reset();
  popularSelect("sala", [], "Selecione o bloco");
}

// fecharModal() -> fecha a modal VIA CODIGO (nao pelo botao).
// bootstrap e global (vem do bootstrap.bundle.min.js no HTML).
// getOrCreateInstance pega a instancia da modal e .hide() fecha.
export function fecharModal() {
  const elementoModal = document.getElementById("modalReserva");
  const modal = bootstrap.Modal.getOrCreateInstance(elementoModal);
  modal.hide();
}

// formatarData("2026-09-15") -> "15/09/2026"
// split("-") quebra a string em ["2026","09","15"]; Number() converte cada pedaco.
// new Date(ano, mes - 1, dia): mes - 1 porque no Date janeiro = 0.
// Quebro a string em vez de new Date("2026-09-15") porque a string ISO e lida
// como meia-noite UTC e no fuso do Brasil "volta" um dia (mostraria 14/09).
// toLocaleDateString("pt-BR") -> formato dd/mm/aaaa.
export function formatarData(dataTexto) {
 const partes = dataTexto.split("-");

  const ano = Number(partes[0]);
  const mes = Number(partes[1]);
  const dia = Number(partes[2]);

  const data = new Date(ano, mes - 1, dia);

  return data.toLocaleDateString("pt-BR");
 }














