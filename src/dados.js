export const blocos = ["A", "B", "C", "D", "E", "F"];

const salasDisponiveis = [];

for (let numero = 100; numero <= 300; numero++) {
    salasDisponiveis.push(numero);
}

export const salas = {
    A: salasDisponiveis,
    B: salasDisponiveis,
    C: salasDisponiveis,
    D: salasDisponiveis,
    E: salasDisponiveis,
    F: salasDisponiveis
};

export const reservas = JSON.parse(localStorage.getItem("reservas")) || [];