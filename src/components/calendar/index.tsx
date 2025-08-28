'use client'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import brLocale from '@fullcalendar/core/locales/pt-br'
import { useEffect, useRef } from 'react'
import multiMonthPlugin from '@fullcalendar/multimonth'
import timeGridPlugin from "@fullcalendar/timegrid";

// const events = [
//   { title: 'Meeting', start: new Date() }
// ]


export function Calendar(){
    const calendarRef = useRef<FullCalendar>(null); ;
    // // const [currentBlock, setCurrentBlock] = useState<0>(0)

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

    //useEffect para atualizar o tamanho do calendário quando a sidebar é aberta ou fechada aguardando transição 600ms
    // useEffect(() => {
    //     if (calendarRef.current) {
    //         const api = calendarRef.current.getApi()
    //         const timeout = setTimeout(() => {
    //         api.updateSize();
    //     }, 600)
    //     return () => clearTimeout(timeout);
    //     }
    // }, [isOpen]);

    return (
            <FullCalendar
                locales={[brLocale]}
                locale="pt-br"
                timeZone='local'
                plugins={[dayGridPlugin, multiMonthPlugin, timeGridPlugin]}
                height="100%"
                // ref={calendarRef}
                titleFormat={ {year: 'numeric', month: 'long'} }
                dayHeaderFormat={{ weekday: 'long'}}
                headerToolbar={{
                    left: 'prev,next prevYear,nextYear today',
                    center: 'title',
                    right: 'timeGridDay,timeGridWeek,dayGridMonth',
                }}
                contentHeight="auto"
                expandRows={true}
                aspectRatio={2.8}
                initialView='timeGridWeek'
                weekends={true}
                // events={events}
                // eventContent={renderEventContent}
                fixedWeekCount={false}
                firstDay={1}
                hiddenDays={[0]}
                views={ {
                  timeGridWeek: {
                    type: 'timeGrid',
                    duration: { days: 6 },
                    titleFormat: {day: 'numeric', month: 'short'},
                    buttonText: 'Semana'
                  },
                  timeGridDay: {
                    type: 'timeGrid',
                    titleFormat: {day: 'numeric', month: 'long'},
                    buttonText: 'Dia'
                  }
                }}
            />
    )
}

// a custom render function
// function renderEventContent(eventInfo) {
//   return (
//     <>
//       <b>{eventInfo.timeText}</b>
//       <i>{eventInfo.event.title}</i>
//     </>
//   )
// }