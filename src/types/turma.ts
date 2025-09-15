import { Curso } from "./curso"
import { Disciplina } from "./disciplina"

export interface TurmaAdmin {
    id: string
    nome: string
    vagas: number
    cursoId: string
    curso: Curso
    disciplina: Disciplina
    disciplinaId: string
    ministranteId?: string
}