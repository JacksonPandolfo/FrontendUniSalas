export async function getSalas() {
  const res = await fetch(`/api/salas/`, {
    method: "GET",
    credentials: "include"
  });
  if (!res.ok) throw new Error('Erro ao carregar salas');
  return res.json();
}

export async function getSalaById(salaId: string) {
  const res = await fetch(`/api/salas/sala/${salaId}`, {
    method: "GET",
    credentials: "include"
  });
  if (!res.ok) throw new Error('Erro ao carregar salas');
  return res.json();
}

export async function getSalasBloco(blocoId: string) {
  const res = await fetch(`/api/salas/bloco/${blocoId}`, {
    method: "GET",
    credentials: 'include'
  });
  if (!res.ok) throw new Error('Erro ao carregar salas');
  return res.json();
}

export async function getSalasSetor(setorId: string) {
  const res = await fetch(`/api/salas/setor/${setorId}`, {
    method: "GET",
    credentials: "include"
  });
  if (!res.ok) throw new Error('Erro ao carregar salas');
  return res.json();
}