import { Equipamento } from "./equipamento"
import { Mobiliario } from "./mobiliario"
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
    acessibilidade: boolean
    diaSemana: number
    dataInicio: Date
    dataFim: Date
    horarioId: string
    horaInicial: Date
    horaFinal: Date
    salaId: string
    turmaId?: string
    qtdPessoas: number
    ministranteId: string
    solicitanteId: string
    aprovadorId: string
    statusReserva: statusReserva
    equipamentos: Equipamento[]
    mobiliarios: Mobiliario[]
    setorPreferidoId?: string

    ministrante: { nome: string, sobrenome: string }
    solicitante: { nome: string, sobrenome: string }
    setor?: {nome: string, descricao: string}
    aprovador: {nome: string, sobrenome: string }
    turma?: TurmaAdmin
    horario: { nome: string; horaInicio: string; horaFim: string }
    sala: { numero: number; capacidade: number; statusSala: string; temAcessibilidade: boolean; bloco: { numero: number; setor: { nome: string; }} }

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
    horarioId: string | null
    horaInicial: Date
    horaFinal: Date
    turmaId?: string
    qtdPessoas: number
    ministranteId: string
    solicitanteId: string
    aprovadorId: string
    statusReserva: statusReservaEnum
    equipamentos: Equipamento[]
    mobiliarios: Mobiliario[]
    setorPreferidoId?: string
}

export type UpdateReservaDto = Partial<EventoAdmin>;