export type tipoEvento = "AULA" | "PALESTRA" | "BANCA" | "REUNIAO" | "EVENTO"
export type tipoReserva = "ESPORADICA" | "RECORRENTE"

export interface EventoAdmin{
    id: number
    tipoReserva: tipoReserva
    tipoEvento: tipoEvento
    dataInicio: Date
    dataFim: Date
    horarioId: number
    salaId: number
    turmaId?: number
    ministranteId: number
    solicitanteId: number
    aprovadorId: number

    ministrante: { nome: string }
    turma?: { nome: string }
    horario: { nome: string; horaInicio: string; horaFim: string }
    sala: { numero: number; capacidade: number; statusSala: string; temAcessibilidade: boolean }
}