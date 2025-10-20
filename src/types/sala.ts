import { BlocoAdmin } from "./bloco"
import { TipoEquipamento } from "./equipamento"
import { TipoMobiliario } from "./mobiliario"

export interface SalaAdmin {
    id: string
    numero: number
    temAcessibilidade: boolean
    capacidade: number
    blocoId: string
    statusSala: "LIVRE" | "OCUPADA" | "MANUTENCAO" | "DESATIVADA"
    Equipamentos: TipoEquipamento[]
    Mobiliarios: TipoMobiliario[]
    bloco: BlocoAdmin
}

export interface UpdateSala {
    numero: number
    temAcessibilidade: boolean
    capacidade: number
    blocoId: string
    statusSala: "LIVRE" | "OCUPADA" | "MANUTENCAO" | "DESATIVADA"
}