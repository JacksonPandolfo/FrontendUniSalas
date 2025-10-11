// const API_URL = process.env.NEXT_PUBLIC_API_URL

import { UpdateBloco } from "@/types/bloco";

export async function getBlocos() {
  const res = await fetch("/api/blocos");
  if (!res.ok) throw new Error('Erro ao carregar blocos');
  return res.json();
}

export async function getBlocosSetor(setorId: string) {
  const res = await fetch(`/api/blocos/setor/${setorId}`);
  if (!res.ok) throw new Error('Erro ao carregar blocos do setor');
  return res.json()
}

export async function getBlocoById(blocoId: string) {
  const res = await fetch(`/api/blocos/${blocoId}`, {
    method: "GET",
    credentials: "include"
  });
  if (!res.ok) throw new Error('Erro ao carregar setores');
  return res.json();
}

export async function updateBlocoById(blocoId:string, dataBloco: UpdateBloco){
  const res = await fetch(`/api/blocos/${blocoId}`, {
    method: "PATCH",
    headers: {"Content-type": "application/json"},
    body: JSON.stringify(dataBloco)
  })
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Erro ao atualizar o setor');
  }
  return res.json();
}

export async function deleteSetor(blocoId: string) {
  const res = await fetch(`/api/blocos/${blocoId}`, {
    method: "DELETE"
  });
  if (!res.ok){
    const data = await res.json().catch(() => null)
      throw new Error(data?.error || "Erro ao excluir o setor");
  }
  return true
}