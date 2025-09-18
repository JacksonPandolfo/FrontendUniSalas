// const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function getBlocos() {
  const res = await fetch("/api/blocos");
  if (!res.ok) throw new Error('Erro ao carregar blocos');
  return res.json();
  // const res = await fetch(`${API_URL}/bloco`);
  // if (!res.ok) throw new Error('Erro ao carregar blocos');
  // return res.json();
}

export async function getBlocosSetor(setorId: string) {
  const res = await fetch(`/api/blocos/${setorId}`);
  if (!res.ok) throw new Error('Erro ao carregar blocos do setor');
  return res.json()
  // const res = await fetch(`${API_URL}/bloco/${setorId}`);
  // if (!res.ok) throw new Error('Erro ao carregar blocos do setor');
  // return res.json();
}