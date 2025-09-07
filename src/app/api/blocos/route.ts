const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function getBlocos() {
  const res = await fetch(`${API_URL}/bloco`);
  if (!res.ok) throw new Error('Erro ao carregar blocos');
  return res.json();
}

export async function getBlocosSetor(setorId: number) {
  const res = await fetch(`${API_URL}/bloco?blocoId=${setorId}`);
  if (!res.ok) throw new Error('Erro ao carregar blocos do setor');
  return res.json();
}