import { BlocoAdmin } from "./bloco"

export interface SetorAdmin{
    id: number,
    nome: string,
    descricao: string,
    blocos: BlocoAdmin[]
}

export interface SetorUsuario {
    nome: string
    descricao: string
}