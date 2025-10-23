import { SolicitaReserva, UpdateReservaDto } from "@/types/evento";

export async function getEventos() {
  const res = await fetch(`/api/reserva`);
  if (!res.ok) throw new Error('Erro ao carregar as reservas');
  return res.json();
}

export async function getEventosSala(salaId: string){
    const res = await fetch(`/api/reservas/${salaId}`);
    if (!res.ok) throw new Error('Erro ao carregar as reservas da sala');
    return res.json();
}

export async function getEventosByUsuario(usuarioId: string){
    const res = await fetch(`/api/reservas/usuario/${usuarioId}`);
    if (!res.ok) throw new Error('Erro ao carregar as reservas do usuário');
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
  if (!res.ok) throw new Error('Erro ao carregar as reservas da sala');
  return res.json();
}

//vai virar update
export async function updateReservaById(reservaData: UpdateReservaDto){
  const res = await fetch(`/api/reservas`, {
    method: "PATCH",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(reservaData),
    credentials: "include"
  })

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Erro ao atualizar a reserva');
  }

  return res.json();
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

export async function deleteSolicitacaoById(reservaId: string){
  const res = await fetch(`/api/reservas`, {
    method: "DELETE",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(reservaId),
    credentials: "include"
  })

  if (!res.ok) throw new Error('Erro ao solicitar a reserva');
  const data = await res.json()
  return data
}
