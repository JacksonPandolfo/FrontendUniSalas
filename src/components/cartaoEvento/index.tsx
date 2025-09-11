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
    return (
        <div key={id}>
            <p>{tipoReserva}</p>
            <p>{tipoEvento}</p>
            <p>{dataInicioFormatada.toLocaleDateString()}</p>
            <p>{dataFimFormatada.toLocaleDateString()}</p>
            <p>{horario}</p>
            <p>{nomeTurma}</p>
            <p>{ministrante}</p>
            <p>{horaInicioFormatada}</p>
            <p>{horaFimFormatada}</p>

        </div>
    )
}