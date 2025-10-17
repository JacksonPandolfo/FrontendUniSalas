import { Equipamento, Mobiliario } from "./sala"
import { TurmaAdmin } from "./turma"

export enum tipoEventoEnum{
    AULA = "Aula",
    PALESTRA = "Palestra",
    BANCA = "Banca",
    REUNIAO = "Reunião",
    EVENTO = "Evento"
}

export enum tipoReservaEnum{
    ESPORADICA = "Esporadica",
    RECORRENTE = "Recorrente",
}

export enum statusReservaEnum{
    APROVADA = "Aprovada",
    PENDENTE = "Pendente",
    CANCELADA = "Cancelada"
}

export type tipoEvento = "AULA" | "PALESTRA" | "BANCA" | "REUNIAO" | "EVENTO"
export type tipoReserva = "ESPORADICA" | "RECORRENTE"
export type statusReserva = "APROVADA" | "PENDENTE" | "CANCELADA"

export interface EventoAdmin{
    id: string
    tipoReserva: tipoReserva
    tipoEvento: tipoEvento
    diaSemana: number
    dataInicio: Date
    dataFim: Date
    horarioId: string
    horaInicial: Date
    horaFinal: Date
    salaId: string
    turmaId?: string
    ministranteId: string
    solicitanteId: string
    aprovadorId: string
    statusReserva: statusReserva

    ministrante: { nome: string }
    turma?: TurmaAdmin
    horario: { nome: string; horaInicio: string; horaFim: string }
    sala: { numero: number; capacidade: number; statusSala: string; temAcessibilidade: boolean }
}

export interface CreateEvento{
    tipoReserva: tipoReservaEnum
    tipoEvento: tipoEventoEnum
    diaSemana: number
    dataInicio: Date
    dataFim: Date
    horarioId?: string
    horaInicial: Date
    horaFinal: Date
    salaId: string
    turmaId?: string
    ministranteId: string
    solicitanteId: string
    aprovadorId: string
    statusReserva: statusReservaEnum
}

export interface SolicitaReserva{
    tipoReserva: tipoReservaEnum
    tipoEvento: tipoEventoEnum
    acessibilidade: boolean
    diaSemana: number
    dataInicio: Date
    dataFim: Date
    horarioId?: string
    horaInicial: Date
    horaFinal: Date
    turmaId?: string
    qtdParticipantes: number
    ministranteId: string
    solicitanteId: string
    aprovadorId: string
    statusReserva: statusReservaEnum
    equipamentos: Equipamento[]
    mobiliarios: Mobiliario[]
    setorPreferido?: string
}