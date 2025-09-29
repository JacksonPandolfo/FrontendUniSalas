import { SalaAdmin } from "./sala"
import { SetorAdmin } from "./setor"

export interface BlocoAdmin {
    id: string,
    numero: number,
    setorId: string,
    salas: SalaAdmin[]
    setor: SetorAdmin
}

export interface BlocoUsuario {
    numero: number
}

export interface UpdateBloco {
    numero: number,
    setorId: string
}