import { EventoAdmin } from "@/types/evento"
import { Horario } from "@/types/horario"
import { TurmaAdmin } from "@/types/turma"
import { UsuarioAdmin } from "@/types/usuario"
import formataHorarioLocal from "@/utils/formataHora"
import { tipoEventoMap } from "@/utils/tipoEventoMap"
import { tipoReservaMap } from "@/utils/tipoReservaMap"
import { IoPeople } from "react-icons/io5"
import { TbCalendarEvent, TbCalendarQuestion, TbClock, TbSunMoon } from "react-icons/tb"

type PropsEvento = {
    tipoReserva: EventoAdmin["tipoReserva"]
    tipoEvento: EventoAdmin["tipoEvento"]
    dataInicio?: EventoAdmin["dataInicio"]
    dataFim?: EventoAdmin["dataFim"]
    horario: Horario["nome"]
    turma?: TurmaAdmin
    ministrante: UsuarioAdmin["nome"]
    horaInicioEvento: Horario["horaInicio"]
    horaFimEvento: Horario["horaFim"]
}

export function CartaoEvento({tipoReserva, tipoEvento, dataInicio, dataFim, horario, turma, ministrante, horaInicioEvento, horaFimEvento}: PropsEvento) {

    return (
        <div className="border-2 rounded-lg border-blue-950 p-2 w-70">
            <h4 className="font-poppins text-center font-bold text-blue-950">Reserva</h4>
            <div className="flex gap-1">
                <TbCalendarEvent className="text-orange-400" size={24}/>
                <p className="font-poppins">
                    {dataInicio && dataFim ? (
                        dataInicio === dataFim ? "Dia: " + new Date(dataInicio).toLocaleDateString("pt-BR", { timeZone: "UTC" })
                        : `Dia: ${new Date(dataInicio).toLocaleDateString().slice(0, 5)} até ${new Date(dataFim).toLocaleDateString("pt-BR", { timeZone: "UTC" }).slice(0, 5)}`
                        ) : (
                            dataInicio ?
                            new Date(dataInicio).toLocaleDateString("pt-BR", { timeZone: "UTC" }).slice(0,5)
                            : dataFim ?
                            new Date(dataFim).toLocaleDateString("pt-BR", { timeZone: "UTC" }).slice(0,5)
                            : null
                        )
                    }
                </p>
            </div>
            <div className="flex gap-1">
                <TbCalendarQuestion className="text-orange-400" size={24}/>
                <p className="font-poppins">Reserva: {tipoReservaMap[tipoReserva]}</p>
            </div>
            <div className="flex gap-1">
                <IoPeople className="text-orange-400" size={24}/>
                <p className="font-poppins">Evento: {tipoEventoMap[tipoEvento]}</p>
            </div>
            <div className="flex gap-1">
                <TbSunMoon className="text-orange-400" size={24} />
                <p className="font-poppins">Turno: {horario}</p>
            </div>
            <div className="flex gap-1">
                <TbClock className="text-orange-400" size={24}/>
                <p className="font-poppins">
                    Horário: {formataHorarioLocal(horaInicioEvento)} - {formataHorarioLocal(horaFimEvento)}
                </p>
            </div>
            <h4 className="font-poppins mt-2 text-center font-bold text-blue-950">Atividade</h4>
            {turma ? (
                <>
                    <p>Curso: {turma.curso.nome}</p>
                    <p>Turma: {turma.nome}</p>
                    <p>Disciplina: {turma.disciplina.nome}</p>
                </>
            ) : ("")}
            <p>Ministrante: {ministrante}</p>
        </div>
    )
}