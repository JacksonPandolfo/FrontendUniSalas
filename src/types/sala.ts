import { BlocoAdmin } from "./bloco"

export enum Mobiliario {
  MESADESENHO = "Mesa de desenho",
  CADEIRABRACO = "Cadeira com braço",
  MESAREUNIAO = "Mesa de reunião",
  MOBILIARIOMOVEL = "Mobiliário móvel",
}

export enum Equipamento {
  CAIXASOM = "Caixa de som",
  PROJETOR = "Projetor",
  COMPUTADOR = "Computador",
  MICROFONE = "Microfone",
  WEBCAM = "Webcam"
}

export type TipoEquipamento = {
    id: string
    salaId: string
    tipoEquipamento: Equipamento
}

export type TipoMobiliario = {
    id: string
    salaId: string
    tipoMobiliario: Mobiliario
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
    bloco: BlocoAdmin
}

export interface UpdateSala {
    numero: number
    temAcessibilidade: boolean
    capacidade: number
    blocoId: string
    statusSala: "LIVRE" | "OCUPADA" | "MANUTENCAO" | "DESATIVADA"
    Equipamentos: string[]
    Mobiliarios: string[]
}