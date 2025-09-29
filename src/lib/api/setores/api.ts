import { UpdateSetor } from "@/types/setor";

export async function getSetores() {
  const res = await fetch(`/api/setores/`, {
    method: "GET",
    credentials: "include"
  });
  if (!res.ok) throw new Error('Erro ao carregar setores');
  return res.json();
}

export async function getSetorById(setorId: string) {
  const res = await fetch(`/api/setores/${setorId}`, {
    method: "GET",
    credentials: "include"
  });
  if (!res.ok) throw new Error('Erro ao carregar setores');
  return res.json();
}

export async function updateSetorById(setorId:string, dataSetor: UpdateSetor){
  const res = await fetch(`/api/setores/${setorId}`, {
    method: "PATCH",
    headers: {"Content-type": "application/json"},
    body: JSON.stringify(dataSetor),
    credentials: "include"
  })
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Erro ao logar');
  }
  return res.json();
}

export async function deleteSetor(setorId: string) {
  const res = await fetch(`/api/setores/${setorId}`, {
    method: "DELETE",
    credentials: "include"
  });
  if (!res.ok){
    const data = await res.json().catch(() => null)
      throw new Error(data?.error || "Erro ao excluir o setor");
  }
  return true
}