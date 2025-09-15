import { BlocoAdmin } from "./bloco"
import { SetorAdmin } from "./setor"

export type TipoEquipamento = {
    id: string
    salaId: string
    tipoEquipamento: string
}

export type TipoMobiliario = {
    id: string
    salaId: string
    tipoMobiliario: string
}

export interface SalaAdmin {
    id: string
    numero: number
    temAcessibilidade: boolean
    capacidade: number
    blocoId: string
    statusSala: "LIVRE" | "OCUPADA" | "MANUTENCAO" | "DESATIVADA"
    Equipamentos: TipoEquipamento[]
    Mobiliarios: TipoMobiliario[]
    setor: SetorAdmin
    bloco: BlocoAdmin
}