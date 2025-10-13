import { TurmaAdmin } from "./turma"

export enum tipoEventoEnum{
    AULA = "Aula",
    PALESTRA = "Palestra",
    BANCA = "Banca",
    REUNIAO = "Reunião",
    EVENTO = "Evento"
}

export type tipoEvento = "AULA" | "PALESTRA" | "BANCA" | "REUNIAO" | "EVENTO"
export type tipoReserva = "ESPORADICA" | "RECORRENTE"

export interface EventoAdmin{
    id: string
    tipoReserva: tipoReserva
    tipoEvento: tipoEvento
    diaSemana: number
    dataInicio: Date
    dataFim: Date
    horarioId: string
    salaId: string
    turmaId?: string
    ministranteId: string
    solicitanteId: string
    aprovadorId: string

    ministrante: { nome: string }
    turma?: TurmaAdmin
    // { nome: string, curso: {nome: string}, disciplina: {nome: string} }
    horario: { nome: string; horaInicio: string; horaFim: string }
    sala: { numero: number; capacidade: number; statusSala: string; temAcessibilidade: boolean }
}