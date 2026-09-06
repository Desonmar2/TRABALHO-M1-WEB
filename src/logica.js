// ===== logica.js =====
// Modulo de REGRAS PURAS. Nao mexe no HTML, nao le a tela.
// So recebe dados por parametro e devolve dados. E aqui que ficam
// os metodos de array: reduce, filter, map, find, some.


// calcularMetricas(lista) -> { total, manha, tarde, noite }
// Recebe a lista de reservas (ja filtrada, vem do app.js) e conta quantas
// existem no total e por turno. Usa REDUCE pra montar um objeto contador.
//
// reduce: percorre o array acumulando um valor. Aqui o acumulador (contador)
// comeca como {} (2o argumento do reduce) e vai virando { Manha: 1, Noite: 1 }.
//  - se ainda nao vi esse turno -> crio a chave com 0
//  - depois somo 1
//  - return contador -> passa pra proxima volta (obrigatorio)
// No fim, porturno so tem chave dos turnos que apareceram. Por isso o || 0
// no return: se "Tarde" nunca apareceu, porturno["Tarde"] e undefined -> vira 0.
export function calcularMetricas(lista) {
  const porturno = lista.reduce((contador, reserva) => {
    const turno = reserva.turno;

    if (contador[turno] === undefined) {
      contador[turno] = 0;
    }

    contador[turno] = contador[turno] + 1;

    return contador;
  }, {});

     return {
    total: lista.length,
    manha: porturno["Manhã"] || 0,
    tarde: porturno["Tarde"] || 0,
    noite: porturno["Noite"] || 0
  };
}

// aplicarFiltros(lista, filtros) -> lista filtrada
// filtros = { nome, data, bloco, sala } (vem do lerFiltros do ui.js).
// Comeco com resultado = lista (tudo). Cada IF so roda se aquele campo
// foi preenchido; campo vazio ("") -> filtro ignorado, nao restringe nada.
// Cada filter age sobre o resultado do anterior -> os filtros vao se somando
// (nome + data juntos funcionam).
//
// filter: mantem no array novo so os itens em que a funcao retorna true.
//  - nome: includes() (acha parte do texto) + toLowerCase() nos dois lados
//          pra nao diferenciar maiuscula/minuscula
//  - data/bloco/sala: === (tem que ser exatamente igual)
export function aplicarFiltros(lista, filtros) {

    let resultado = lista;

    if( filtros.nome !== ""){
        resultado = resultado.filter(reserva => {
           const nomeReserva = reserva.solicitante.toLowerCase();
           const nomeBuscado = filtros.nome.toLowerCase();
           return nomeReserva.includes(nomeBuscado);
        } )
    }


    if (filtros.data !== "") {
    resultado = resultado.filter(reserva => {
      return reserva.data === filtros.data;
    });
  }

  if (filtros.bloco !== "") {
    resultado = resultado.filter(reserva => {
      return reserva.bloco === filtros.bloco;
    });
  }

  if (filtros.sala !== "") {
    resultado = resultado.filter(reserva => {
      return reserva.sala === filtros.sala;
    });
  }

  return resultado;



}

// listarBlocos(infraestrutura) -> ["Bloco A", "Bloco B", "Bloco C"]
// MAP: transforma cada objeto { bloco, salas } em so a string do bloco.
// Array novo, mesmo tamanho do original. Usado pra encher os <select> de bloco.
export function listarBlocos(infraestrutura) {
  return infraestrutura.map(item => {
    return item.bloco;
  });
}

// salasDoBloco(infraestrutura, nomeBloco) -> ["Sala 101", "Sala 102", ...]
// FIND: devolve O OBJETO (nao true/false) cujo bloco bate com o nome.
// Se achou -> retorna .salas dele. Se nao achou (nome vazio) -> retorna [].
// E o que faz a cascata: troca o bloco -> pega as salas dele -> recarrega o select de sala.
export function salasDoBloco(infraestrutura, nomeBloco) {
  const blocoEncontrado = infraestrutura.find(item => {
    return item.bloco === nomeBloco;
  });

  if (blocoEncontrado === undefined) {
    return [];
  }

  return blocoEncontrado.salas;
}


// existeColisao(lista, novaReserva) -> true / false
// Regra de negocio do trabalho: nao pode a MESMA sala + bloco + data + turno.
// SOME: pergunta "existe pelo menos um item em que a funcao retorna true?".
// Pra cada reserva ja existente:
//  - se qualquer campo (bloco, sala, data, turno) for diferente -> return false (essa nao bate)
//  - se todos forem iguais -> return true (achei conflito, some para na hora)
// Usado no submit: se der true, mostra alerta na modal e NAO fecha.
export function existeColisao(lista, novaReserva) {
  const conflito = lista.some(reserva => {
    if (reserva.bloco !== novaReserva.bloco) {
      return false;
    }
    if (reserva.sala !== novaReserva.sala) {
      return false;
    }
    if (reserva.data !== novaReserva.data) {
      return false;
    }
    if (reserva.turno !== novaReserva.turno) {
      return false;
    }
    return true;
  });

  return conflito;
}

// proximoId(lista) -> numero
// Gera o id da proxima reserva: pega o maior id que existe hoje e soma 1.
// Lista vazia -> comeca em 1. (for...of percorre item por item.)
export function proximoId(lista) {
  if (lista.length === 0) {
    return 1;
  }

  let maior = 0;
  for (const reserva of lista) {
    if (reserva.id > maior) {
      maior = reserva.id;
    }
  }

  return maior + 1;
}


