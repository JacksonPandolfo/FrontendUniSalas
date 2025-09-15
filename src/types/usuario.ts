type Cargo = "ADMINISTRADOR" | "ATENDIMENTO" | "MINISTRANTE" | "FUNCIONARIO"
export interface UsuarioAdmin {
    id: string
    nome: string
    sobrenome: string
    email: string
    dataNascimento: Date
    cargo: Cargo
    senha: string
}