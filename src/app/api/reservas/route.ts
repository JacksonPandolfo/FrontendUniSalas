const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function getEventos() {
  const res = await fetch(`${API_URL}/reserva`);
  if (!res.ok) throw new Error('Erro ao carregar salas');
  return res.json();
}

export async function getEventosSala(salaId: string){
    const res = await fetch(`${API_URL}/reserva/${salaId}`);
    if (!res.ok) throw new Error('Erro ao carregar salas');
    return res.json();
}

export async function getEventosSalaComData(salaId: string, dataInicio: Date, dataFim: Date){
  console.log(dataFim)
  const formatDate = (date: Date) => {
    const d = new Date(date)
    const ano = d.getFullYear()
    const mes = String(d.getMonth() + 1).padStart(2, "0")
    const dia = String(d.getDate()).padStart(2, "0")

    return `${ano}-${mes}-${dia}`
  }
  console.log(formatDate(dataInicio))
  console.log(formatDate(dataFim))
  const res = await fetch(`${API_URL}/reserva/byDate/${salaId}/${formatDate(dataInicio)}/${formatDate(dataFim)}`);
  if (!res.ok) throw new Error('Erro ao carregar salas');
  return res.json();
}