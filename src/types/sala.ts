export interface SalaAdmin {
    id: number
    numero: number
    temAcessibilidade: boolean
    capacidade: number
    blocoId: number
    statusSala: "LIVRE" | "OCUPADA" | "MANUTENCAO" | "DESATIVADA"
}