'use client'
import FullCalendar from '@fullcalendar/react'
import { RRule, Weekday } from 'rrule'
import rrulePlugin from '@fullcalendar/rrule'
import dayGridPlugin from '@fullcalendar/daygrid'
import brLocale from '@fullcalendar/core/locales/pt-br'
import { useEffect, useRef, useState } from 'react'
import multiMonthPlugin from '@fullcalendar/multimonth'
import timeGridPlugin from "@fullcalendar/timegrid";
import type { EventContentArg, EventInput } from '@fullcalendar/core'
import { EventoAdmin } from "@/types/evento"
import { SalaAdmin } from '@/types/sala'
import { getEventosSala } from '@/app/api/reservas/route'
import { getSetores } from '@/app/api/setores/route'
import { getBlocosSetor } from '@/app/api/blocos/route'
import { getSalasBloco } from '@/app/api/salas/route'
import { SetorAdmin } from '@/types/setor'
import { BlocoAdmin } from '@/types/bloco'
import { TbArrowAutofitDown, TbArrowAutofitUp } from 'react-icons/tb'
import { tipoEventoMap } from '@/utils/tipoEventoMap'
import { diaSemanaMap } from '@/utils/diaSemanaMap'

function renderizaConteudoEvento(eventInfo: EventContentArg) {
  const { atividade, ministrante, turma, horaInicio, horaFim, nomeHorario } = eventInfo.event.extendedProps as {
    turma: string
    atividade: string;
    ministrante: string;
    horaInicio: string
    horaFim: string
    nomeHorario: string
  };
  const api = eventInfo.view.calendar
  const view = api.view.type

  function renderizaCor(nomeHorario: string){

    switch (nomeHorario) {
      case "Manhã":
        return "bg-blue-300"
        case "Manhã 2":
          return "bg-yellow-300"
          case "Tarde":
            return "bg-green-400"
            case "Vespertino":
              return "bg-orange-400"
              case "Noite":
                return "bg-blue-950"
                default:
                  break;
                }
  }

  return (
    <div className={`flex flex-col border-2 border-blue-950 ${renderizaCor(nomeHorario)} ${nomeHorario === "Noite" ? "text-white" : ""} h-full rounded-lg p-2 w-full`}>
      {view === "dayGridMonth" && <p className={`font-poppins rounded-lg`}>{horaInicio.slice(11, 16)} - {horaFim.slice(11, 16)}</p>}
      <p className={`font-poppins ${nomeHorario === "Noite" ? "text-white" : ""}`}>Atividade: {tipoEventoMap[atividade]}</p>
      <p className={`font-poppins ${nomeHorario === "Noite" ? "text-white" : ""}`}>{turma}</p>
      <p className={`font-poppins ${nomeHorario === "Noite" ? "text-white" : ""}`}>Ministrante: {ministrante}</p>
    </div>

  )
}

function criarDataLocal(isoString: string, hora: string) {
  const d = new Date(isoString);
  const year = d.getUTCFullYear();
  const month = d.getUTCMonth(); // 0-indexed
  const day = d.getUTCDate();

  const [h, m] = hora.slice(11, 16).split(":").map(Number);

  return new Date(year, month, day, h, m);
}

function criarDataLocalRecorrente(isoString: string, hora: string) {
  const d = new Date(isoString);
  const year = d.getFullYear();
  const month = d.getMonth(); // 0-indexed
  const day = d.getDate();

  const [h, m] = hora.slice(11, 16).split(":").map(Number);

  return new Date(year, month, day, h, m);
}

function gerarEventosPorHorario(dataInicial: Date, dataFinal: Date, horaInicial: string, horaFinal: string, tipoReserva: string, diaSemana: number){
  const dataHoraEventos: {start: Date, end: Date}[] = []

  const dataInicio = new Date(dataInicial)
  const dataFim = new Date(dataFinal)

  if (tipoReserva === "ESPORADICA") {
    const start = criarDataLocal(dataInicio.toISOString(), horaInicial)
    const end = criarDataLocal(dataFim.toISOString(), horaFinal)
    console.log(start, end)

    dataHoraEventos.push({ start, end })

  } else if(tipoReserva === "RECORRENTE" && diaSemana !== undefined) {

    for (let d = dataInicio; d <= dataFim; d.setDate(d.getDate() + 1)) {
      if(d.getDay() !== diaSemana) continue
      const start = criarDataLocalRecorrente(d.toISOString(), horaInicial)
      const end = criarDataLocalRecorrente(d.toISOString(), horaFinal)

      dataHoraEventos.push({ start, end })
    }
  }
  return dataHoraEventos
}

export function Calendar(){
  const calendarRef = useRef<FullCalendar>(null); ;
  const [setores, setSetores] = useState<SetorAdmin[]>([])
  const [blocos, setBlocos] = useState<BlocoAdmin[]>([])
  const [salas, setSalas] = useState<SalaAdmin[]>([])
  const [eventos, setEventos] = useState<EventoAdmin[]>([])

  const [setorSelecionado, setSetorSelecionado] = useState<string | null>(null)
  const [blocoSelecionado, setBlocoSelecionado] = useState<string | null>(null)
  const [salaSelecionada, setSalaSelecionada] = useState<string | null>(null)

  const [openSelectSetor, setSelectSetor] = useState(false)
  const [openSelectBloco, setSelectBloco] = useState(false)
  const [openSelectSala, setSelectSala] = useState(false)

  const [dataInicial, setDataInicial] = useState<Date>(new Date())
  const [dataFinal, setDataFinal] = useState<Date>(new Date())



  const eventosFullCalendar: EventInput[] = eventos.flatMap(e => {
    return gerarEventosPorHorario(
      e.dataInicio,
      e.dataFim,
      e.horario.horaInicio,
      e.horario.horaFim,
      e.tipoReserva,
      e.diaSemana
    ).map((ev) => ({
      eventId: e.id,
      start: ev.start,
      end: ev.end,
      extendedProps: {
        turma: e.turma?.disciplina.nome,
        atividade: e.tipoEvento,
        ministrante: e.ministrante.nome,
        horaInicio: e.horario.horaInicio,
        horaFim: e.horario.horaFim,
        nomeHorario: e.horario.nome
      }
    }))
  })

  useEffect(() => {
    handleMudancaData()
  }, [])

  useEffect(() => {
    carregarSetores()
  }, [])

  useEffect(() => {
    if (calendarRef.current) {
      const api = calendarRef.current.getApi();
      const calendarElement = api.el;
      if (calendarElement) {
        const observer = new ResizeObserver(() => {
          api.updateSize();
        });
        observer.observe(calendarElement.parentElement!);
        return () => observer.disconnect();
      }
    }
  }, []);


  async function carregarSetores() {
    try {
      const setores = await getSetores()
      setSetores(setores)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    if(setorSelecionado !== null){
      carregarBlocos(setorSelecionado)
    }
  }, [setorSelecionado])

  async function carregarBlocos(setorId: string) {
    try {
      const blocos = await getBlocosSetor(setorId)
      setBlocos(blocos)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    if(blocoSelecionado !== null){
      carregarSalas(blocoSelecionado)
    }
  }, [blocoSelecionado])

  async function carregarSalas(blocoId: string) {
    try {
      const salas = await getSalasBloco(blocoId)
      setSalas(salas)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    if(salaSelecionada !== null){
      carregarEventosSala(salaSelecionada)
    }
  }, [salaSelecionada, dataInicial, dataFinal])

  async function carregarEventosSala(salaId: string) {
   try {
       const eventos = await getEventosSala(salaId)
       setEventos(eventos)
       console.log(eventos)
     } catch (err) {
       console.log(err)
     } finally {
     }
   }

  const handleSetorChange = (setorId: string) => {
    if(setorId !== "Setor"){
      setSetorSelecionado(setorId)
    } else{
      setSetorSelecionado(null)
    }
  };
  const handleBlocoChange = (blocoId: string) => {
    if(blocoId !== "Bloco"){
      setBlocoSelecionado(blocoId)
    } else {
      setBlocoSelecionado(null)
    }
  };
  const handleSalaChange = (salaId: string) => {
    if(salaId !== "Sala") {
      setSalaSelecionada(salaId)
    } else {
      setSalaSelecionada(null)
    }
  };

  const handleMudancaData = () => {
    const api = calendarRef.current?.getApi()
    if (api) {
      const view = api.view
      if (dataInicial.getTime() !== view.currentStart.getTime()) {
        setDataInicial(new Date(view.currentStart))
      }
      if (dataFinal.getTime() !== view.currentEnd.getTime()) {
        setDataFinal(new Date(view.currentEnd))
      }
    }
  }

  return (
    <div className='p-2 flex flex-col items-center'>
      <div className='flex items-center gap-2'>
        <div className="relative">
          <button className="flex items-center justify-between border rounded font-poppins font-bold text-blue-950 p-1 pl-2 w-20 text-left hover:cursor-pointer"
                  onClick={() => setSelectSetor(!openSelectSetor)}
          >
            {setorSelecionado ? setores.find(s => s.id === setorSelecionado)?.nome : "Setor" }
            {openSelectSetor ? <TbArrowAutofitUp /> : <TbArrowAutofitDown />}
          </button>
          <div className={`absolute z-50 bg-white border rounded mt-1 max-h-60 overflow-y-auto w-20 ${openSelectSetor ? "" : "hidden"} `}>
            <div className="cursor-pointer font-poppins p-1 hover:bg-blue-950 hover:text-white font-bold text-blue-950 text-center"
                  onClick={() => handleSetorChange("Setor")}>
              Setor
            </div>
            {setores
              .sort((a, b) => a.nome.localeCompare(b.nome))
              .map((setor) => (
                <div
                  key={setor.id}
                  onClick={() => {
                    handleSetorChange(setor.id)
                    setSelectSetor(false)
                  }}
                  className="cursor-pointer font-poppins p-1 hover:bg-blue-950 hover:text-white font-bold text-blue-950 text-center"
                >
                  {setor.nome}
                </div>
              ))}
          </div>
        </div>
        <div className="relative">
          <button className="flex items-center justify-between border rounded font-poppins font-bold text-blue-950 p-1 pl-2 w-20 text-left hover:cursor-pointer"
                  onClick={() => setSelectBloco(!openSelectBloco)}
          >
            {blocoSelecionado ? String(blocos.find(b => b.id === blocoSelecionado)?.numero).padStart(2, "0") : "Bloco" }
            {openSelectBloco ? <TbArrowAutofitUp /> : <TbArrowAutofitDown />}
          </button>
          <div className={`absolute z-50 bg-white border rounded mt-1 max-h-60 overflow-y-auto w-20 ${openSelectBloco ? "" : "hidden"}`}>
            <div className="cursor-pointer font-poppins p-1 hover:bg-blue-950 hover:text-white font-bold text-blue-950 text-center"
                  onClick={() => handleBlocoChange("Bloco")}>
              Bloco
            </div>
            {blocos
              .sort((a, b) => {
                    if(a.numero < b.numero) return -1
                    if(a.numero > b.numero) return 1
                    return 0
                  })
              .map((bloco) => (
                <div
                  key={bloco.id}
                  onClick={() => {
                    handleBlocoChange(bloco.id)
                    setSelectBloco(false)
                  }}
                  className="cursor-pointer font-poppins p-1 hover:bg-blue-950 hover:text-white font-bold text-blue-950 text-center"
                >
                  {String(bloco.numero).padStart(2, "0")}
                </div>
              ))}
          </div>
        </div>
        <div className="relative">
          <button className="flex items-center justify-between border rounded font-poppins font-bold text-blue-950 p-1 pl-2 w-20 text-left hover:cursor-pointer"
                  onClick={() => setSelectSala(!openSelectSala)}
          >
            {salaSelecionada ? salas.find(s => s.id === salaSelecionada)?.numero : "Sala" }
            {openSelectSala ? <TbArrowAutofitUp /> : <TbArrowAutofitDown />}
          </button>
          <div className={`absolute z-50 bg-white border rounded mt-1 max-h-60 overflow-y-auto w-20 ${openSelectSala ? "" : "hidden"}`}>
            <div className="cursor-pointer font-poppins p-1 hover:bg-blue-950 hover:text-white font-bold text-blue-950 text-center"
                  onClick={() => handleSalaChange("Sala")}>
              Sala
            </div>
            {salas
              .sort((a, b) => {
                if(a.numero < b.numero) return -1
                if(a.numero > b.numero) return 1
                return 0
              })
              .map((sala) => (
                <div
                  key={sala.id}
                  onClick={() => {
                    handleSalaChange(sala.id)
                    setSelectSala(false)
                  }}
                  className="cursor-pointer font-poppins p-1 hover:bg-blue-950 hover:text-white font-bold text-blue-950 text-center"
                >
                  {sala.numero}
                </div>
              ))}
          </div>
        </div>
      </div>
      <FullCalendar
        locales={[brLocale]}
        eventTextColor='black'
        locale="pt-br"
        timeZone="local"
        plugins={[dayGridPlugin, multiMonthPlugin, timeGridPlugin, rrulePlugin]}
        height="100%"
        ref={calendarRef}
        titleFormat={ {year: 'numeric', month: 'long'} }
        dayHeaderFormat={{ weekday: 'long'}}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'timeGridDay,timeGridWeek,dayGridMonth',
        }}
        contentHeight="auto"
        expandRows={true}
        aspectRatio={2.8}
        initialView='timeGridWeek'
        weekends={true}
        events={eventosFullCalendar}
        eventContent={renderizaConteudoEvento}
        fixedWeekCount={false}
        firstDay={1}
        datesSet={handleMudancaData}
        allDaySlot={false}
        slotLabelFormat={{
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }}
        views={ {
          timeGridWeek: {
            type: 'timeGrid',
            duration: { days: 7 },
            titleFormat: {day: 'numeric', month: 'short'},
            buttonText: 'Semana'
          },
          timeGridDay: {
            type: 'timeGrid',
            allDaySlot: false,
            titleFormat: {day: 'numeric', month: 'long'},
            buttonText: 'Dia'
          }
        }}
        />
    </div>
  )
}
