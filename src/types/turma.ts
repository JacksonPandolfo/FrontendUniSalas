export interface TurmaAdmin {
    id: number
    nome: string
    vagas: number
    cursoId: number
    disciplinaId: number
    ministranteId?: number
}