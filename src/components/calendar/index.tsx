'use client'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import brLocale from '@fullcalendar/core/locales/pt-br'
import { useEffect, useRef } from 'react'
import multiMonthPlugin from '@fullcalendar/multimonth'

// const events = [
//   { title: 'Meeting', start: new Date() }
// ]

export function Calendar(){
    const calendarRef = useRef<FullCalendar>(null); ;
    // const [currentBlock, setCurrentBlock] = useState<0>(0)

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
        <div className='w-full h-full'>
            <FullCalendar
                locale={brLocale}
                timeZone='local'
                plugins={[dayGridPlugin, multiMonthPlugin]}
                height="100%"
                ref={calendarRef}
                titleFormat={ {year: 'numeric', month: 'long'} }
                headerToolbar={{
                    left: 'prev,next prevYear,nextYear today',
                    center: 'title',
                    right: 'dayGridWeek,dayGridMonth',
                }}
                contentHeight="auto"
                expandRows={true}
                aspectRatio={2.8}
                initialView='dayGridMonth'
                weekends={true}
                // events={events}
                // eventContent={renderEventContent}
                fixedWeekCount={false}
                dayHeaderFormat={{ weekday: 'long'}}
                firstDay={1}
                hiddenDays={[0]}
                />
    </div>
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