export interface SalaAdmin {
    id: number
    numero: number
    temAcessibilidade: boolean
    capacidade: number
    blocoId: number
    statusSala: "Livre" | "Ocupada" | "Manutencao" | "Desativada"
}