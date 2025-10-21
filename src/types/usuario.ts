export enum Cargo {
    ADMINISTRADOR = "ADMINISTRADOR",
    ATENDIMENTO = "ATENDIMENTO",
    MINISTRANTE = "MINISTRANTE",
    FUNCIONARIO = "FUNCIONARIO"
}

export interface UsuarioAdmin {
    id: string
    nome: string
    sobrenome: string
    dataNascimento: Date
    cargos: Cargo[]
    email: string
    senha: string
}

export interface CreateUsuario {
    nome: string
    sobrenome: string
    dataNascimento: Date
    telefone: string
    cargos: Cargo[]
    email: string
    senha: string
}

export interface UsuarioPayload {
    sub: string,
    nome: string,
    sobrenome: string,
    email: string,
    roles: string[]
}

export type CargoUsuario = Pick<UsuarioAdmin, "cargos">