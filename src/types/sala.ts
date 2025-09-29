import { BlocoAdmin } from "./bloco"

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
    //setor: SetorAdmin
    bloco: BlocoAdmin
}

export interface UpdateSala {
    numero: number
    temAcessibilidade: boolean
    capacidade: number
    blocoId: string
    statusSala: "MANUTENCAO" | "DESATIVADA"
    Equipamentos: TipoEquipamento[]
    Mobiliarios: TipoMobiliario[]
}