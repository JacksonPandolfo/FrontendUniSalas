export type TipoEquipamento = {
    id: number
    salaId: number
    tipoEquipamento: string
}

export type TipoMobiliario = {
    id: number
    salaId: number
    tipoMobiliario: string
}

export interface SalaAdmin {
    id: number
    numero: number
    temAcessibilidade: boolean
    capacidade: number
    blocoId: number
    statusSala: "LIVRE" | "OCUPADA" | "MANUTENCAO" | "DESATIVADA"
    Equipamentos: TipoEquipamento[]
    Mobiliarios: TipoMobiliario[]
}