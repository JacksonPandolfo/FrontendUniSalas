export async function getHorarios() {
  const res = await fetch(`/api/horarios`, {
    method: "GET",
    credentials: 'include'
  });
  if (!res.ok) throw new Error('Erro ao carregar os horários');
  return res.json();
}