type Cargo = "ADMINISTRADOR" | "ATENDIMENTO" | "MINISTRANTE" | "FUNCIONARIO"
export interface UsuarioAdmin {
    id: number
    nome: string
    sobrenome: string
    email: string
    dataNascimento: Date
    cargo: Cargo
    senha: string
}