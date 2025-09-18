export async function getEventos() {
  const res = await fetch(`/api/reserva`);
  if (!res.ok) throw new Error('Erro ao carregar salas');
  return res.json();
}

export async function getEventosSala(salaId: string){
    const res = await fetch(`/api/reservas/${salaId}`);
    if (!res.ok) throw new Error('Erro ao carregar salas');
    return res.json();
}

export async function getEventosSalaComData(salaId: string, dataInicio: Date, dataFim: Date){
  console.log("Cheguei com data")
  const formatDate = (date: Date) => {
    const d = new Date(date)
    const ano = d.getFullYear()
    const mes = String(d.getMonth() + 1).padStart(2, "0")
    const dia = String(d.getDate()).padStart(2, "0")

    return `${ano}-${mes}-${dia}`
  }

  const res = await fetch(`/api/reservas/${salaId}/${formatDate(dataInicio)}/${formatDate(dataFim)}`);
  if (!res.ok) throw new Error('Erro ao carregar salas');
  return res.json();
}