import { EventoAdmin } from "@/types/evento"
import { Horario } from "@/types/horario"
import { TurmaAdmin } from "@/types/turma"
import { UsuarioAdmin } from "@/types/usuario"

type PropsEvento = {
    id: EventoAdmin["id"]
    tipoReserva: EventoAdmin["tipoReserva"]
    tipoEvento: EventoAdmin["tipoEvento"]
    dataInicio: EventoAdmin["dataInicio"]
    dataFim: EventoAdmin["dataFim"]
    horario: Horario["nome"]
    nomeTurma: TurmaAdmin["nome"]
    ministrante: UsuarioAdmin["nome"]
    horaInicioEvento: Horario["horaInicio"]
    horaFimEvento: Horario["horaFim"]
}

export function CartaoEvento({id, tipoReserva, tipoEvento, dataInicio, dataFim, horario, nomeTurma, ministrante, horaInicioEvento, horaFimEvento}: PropsEvento) {
    const dataInicioFormatada = new Date(dataInicio)
    const dataFimFormatada = new Date(dataFim)
    const horaInicioFormatada = horaInicioEvento.slice(11,16)
    const horaFimFormatada = horaFimEvento.slice(11,16)
    const formatarPalavra = (palavra: string) => {
        const primeiraLetra = palavra.charAt(0).toUpperCase()
        const restoPalavra = palavra.slice(1).toLowerCase()
        return primeiraLetra + restoPalavra
    }

    return (
        <div className="border-2 p-2" key={id}>
            <p>{formatarPalavra(tipoReserva)}</p>
            <p>{formatarPalavra(tipoEvento)}</p>
            <p>{dataInicioFormatada.toLocaleDateString()}</p>
            <p>{dataFimFormatada.toLocaleDateString()}</p>
            <p>{horario}</p>
            {nomeTurma ? (
                <p>Turma: {nomeTurma}</p>
            ) : ("")}
            <p>Ministrante: {ministrante}</p>
            <p>{horaInicioFormatada}</p>
            <p>{horaFimFormatada}</p>

        </div>
    )
}