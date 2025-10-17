export async function getTurmasByMinistrante(ministranteId: string) {
  const res = await fetch(`/api/turma/${ministranteId}`, {
    method: "GET",
    credentials: 'include'
  });
  if (!res.ok) throw new Error('Erro ao carregar as disciplinas');
  return res.json();
}