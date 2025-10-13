export async function getDisciplinas() {
  const res = await fetch(`/api/disciplinas`, {
    method: "GET",
    credentials: 'include'
  });
  if (!res.ok) throw new Error('Erro ao carregar as disciplinas');
  return res.json();
}