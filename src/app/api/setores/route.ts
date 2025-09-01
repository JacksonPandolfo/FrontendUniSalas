export async function getSetores() {
  const res = await fetch('http://localhost:3001/setores');
  if (!res.ok) throw new Error('Erro ao carregar setores');
  return res.json();
}