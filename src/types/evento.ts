export interface Evento{
    eventId: number,
    salaId: string,
    atividadeId: string
    start: string,
    end: string,
    extendedProps: {
        atividade: string,
        ministrante: string,
        sala: string,
    }
}