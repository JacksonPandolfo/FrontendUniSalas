const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function getSetores() {
  const res = await fetch(`${API_URL}/setores`);
  if (!res.ok) throw new Error('Erro ao carregar setores');
  return res.json();
}