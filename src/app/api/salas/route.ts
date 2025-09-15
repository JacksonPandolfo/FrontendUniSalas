const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function getSalas() {
  const res = await fetch(`${API_URL}/sala`);
  if (!res.ok) throw new Error('Erro ao carregar salas');
  return res.json();
}

export async function getSalasBloco(blocoId: string) {
  const res = await fetch(`${API_URL}/sala/byBloco/${blocoId}`);
  if (!res.ok) throw new Error('Erro ao carregar salas');
  return res.json();
}

export async function getSalasSetor(setorId: string) {
  const res = await fetch(`${API_URL}/sala/bySetor/${setorId}`);
  if (!res.ok) throw new Error('Erro ao carregar salas');
  return res.json();
}