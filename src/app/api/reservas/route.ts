const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function getSalas() {
  const res = await fetch(`${API_URL}/sala`);
  if (!res.ok) throw new Error('Erro ao carregar salas');
  return res.json();
}

export async function getEventosSala(salaId: number, dataInicio: Date, dataFim: Date) {
    // const dataInicioFormatada = new Date(dataInicio)
    // dataInicioFormatada.setHours(0,0,0)
    // const dataFimFormatada = new Date(dataFim)
    // dataFimFormatada.setHours(23,59,59,999)
    const res = await fetch(`${API_URL}/reserva/byDate/${salaId}/${encodeURIComponent(dataInicio.toISOString())}/${encodeURIComponent(dataFim.toISOString())}`);
    if (!res.ok) throw new Error('Erro ao carregar salas');
    return res.json();
}