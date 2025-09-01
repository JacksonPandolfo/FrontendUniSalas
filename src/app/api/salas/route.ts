export async function getSalas() {
  const res = await fetch('http://localhost:3001/salas');
  if (!res.ok) throw new Error('Erro ao carregar salas');
  return res.json();
}

export async function getSalasSetor(setorId: number) {
  const res = await fetch(`http://localhost:3001/salas?setorId=${setorId}`);
  if (!res.ok) throw new Error('Erro ao carregar salas');
  return res.json();
}