export async function getSalas() {
  const res = await fetch('http://localhost:3001/salas');
  if (!res.ok) throw new Error('Erro ao carregar salas');
  return res.json();
}

export async function getSalasBloco(blocoId: number) {
  const res = await fetch(`http://localhost:3001/salas?blocoId=${blocoId}`);
  if (!res.ok) throw new Error('Erro ao carregar salas');
  return res.json();
}