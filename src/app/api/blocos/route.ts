export async function getBlocos() {
  const res = await fetch('http://localhost:3001/blocos');
  if (!res.ok) throw new Error('Erro ao carregar blocos');
  return res.json();
}

export async function getBlocosSetor(setorId: number) {
  const res = await fetch(`http://localhost:3001/salas?blocoId=${setorId}`);
  if (!res.ok) throw new Error('Erro ao carregar blocos do setor');
  return res.json();
}