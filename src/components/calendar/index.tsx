'use client'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import brLocale from '@fullcalendar/core/locales/pt-br'
import { useEffect, useRef } from 'react'
import multiMonthPlugin from '@fullcalendar/multimonth'
import timeGridPlugin from "@fullcalendar/timegrid";
import type { EventContentArg, EventInput } from '@fullcalendar/core'
import { Evento } from "@/types/evento"


const eventos: Evento[] = [
  {
    eventId: 1,
    salaId: "A01 102",
    atividadeId: "GRD-452",
    start: "2025-09-01T13:30",
    end: "2025-09-01T17:30",
    extendedProps: {
      atividade: "Aula teste",
      ministrante: "Jackson Pandolfo",
      sala: "A01 102",
    }
  },
  {
    eventId: 2,
    salaId: "A01 102",
    atividadeId: "GRD-452",
    start: "2025-09-01T19:30",
    end: "2025-09-01T22:30",
    extendedProps: {
      atividade: "Aula teste22",
      ministrante: "Jackson Pandolfo",
      sala: "A01 102",
    }
  }
]
const eventosFullCalendar: EventInput[] = eventos.map((e) => ({
  eventId: e.eventId,
  start: e.start,
  end: e.end,
  extendedProps: e.extendedProps
}))


export function Calendar(){
    const calendarRef = useRef<FullCalendar>(null); ;

    useEffect(() => {
      if (calendarRef.current) {
        const api = calendarRef.current.getApi();

        // pega o elemento raiz do calendário pelo método oficial
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

    return (
            <FullCalendar
                locales={[brLocale]}
                eventTextColor='black'
                locale="pt-br"
                timeZone='local'
                plugins={[dayGridPlugin, multiMonthPlugin, timeGridPlugin]}
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
    )
}

// a custom render function
function renderizaConteudoEvento(eventInfo: EventContentArg) {
  const { atividade, ministrante, sala } = eventInfo.event.extendedProps as {
    atividade: string;
    ministrante: string;
    sala: string
  };
  return (
    <div className='flex flex-col gap-2'>
      <b>{sala}</b>
      <i>{ministrante}</i>
      <p>{atividade}</p>
    </div>

  )
}