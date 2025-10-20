import { CreateEvento, SolicitaReserva } from "@/types/evento";

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

export async function createReserva(reservaData: CreateEvento){
  const res = await fetch(`/api/reservas`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(reservaData),
    credentials: "include"
  })

  if (!res.ok) throw new Error('Erro ao solicitar a reserva');
  const data = await res.json()
  return data
}

export async function createSolicitacao(reservaData: SolicitaReserva){
  const res = await fetch(`/api/reservas`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(reservaData),
    credentials: "include"
  })

  if (!res.ok) throw new Error('Erro ao solicitar a reserva');
  const data = await res.json()
  return data
}
