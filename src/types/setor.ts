import { BlocoAdmin } from "./bloco"

export interface SetorAdmin{
    id: string,
    nome: string,
    descricao: string,
    blocos: BlocoAdmin[]
}

export interface SetorUsuario {
    nome: string
    descricao: string
}

export interface UpdateSetor {
    nome?: string,
    descricao?: string
}