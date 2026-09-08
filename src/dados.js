export const blocos = ["A", "B", "C", "D", "E", "F"];

export const salas = {
    A: [101, 102, 103],
    B: [201, 202, 203],
    C: [301, 302, 303],
    D: [401, 402, 403],
    E: [501, 502, 503],
    F: [601, 602, 603]
};

const reservasIniciais = [
    {
        solicitante: "Prof. Carlos Eduardo",
        bloco: "A",
        sala: "101",
        data: "2026-09-15",
        turno: "Manhã"
    },
    {
        solicitante: "Profa. Ana Maria",
        bloco: "B",
        sala: "201",
        data: "2026-09-15",
        turno: "Noite"
    }
];

export const reservas = reservasIniciais;