import { SalaAdmin } from "./sala"

export interface BlocoAdmin {
    id: number,
    numero: number,
    setorId: number,
    salas: SalaAdmin[]
}

export interface BlocoUsuario {
    numero: number
}