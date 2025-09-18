export async function getSalas() {
  const res = await fetch(`/api/salas/`);
  if (!res.ok) throw new Error('Erro ao carregar salas');
  return res.json();
}

export async function getSalaById(salaId: string) {
  const res = await fetch(`/api/salas/sala/${salaId}`);
  if (!res.ok) throw new Error('Erro ao carregar salas');
  return res.json();
}

export async function getSalasBloco(blocoId: string) {
  const res = await fetch(`/api/salas/bloco/${blocoId}`);
  if (!res.ok) throw new Error('Erro ao carregar salas');
  return res.json();
}

export async function getSalasSetor(setorId: string) {
  const res = await fetch(`/api/salas/setor/${setorId}`);
  if (!res.ok) throw new Error('Erro ao carregar salas');
  return res.json();
}