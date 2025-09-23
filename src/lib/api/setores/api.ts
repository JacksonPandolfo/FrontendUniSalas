import { UpdateSetor } from "@/types/setor";

const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function getSetores() {
  const res = await fetch(`${API_URL}/setores`);
  if (!res.ok) throw new Error('Erro ao carregar setores');
  return res.json();
}

export async function getSetorById(setorId: string) {
  const res = await fetch(`${API_URL}/setores/${setorId}`);
  if (!res.ok) throw new Error('Erro ao carregar setores');
  return res.json();
}

export async function updateSetorById(setorId:string, dataSetor: UpdateSetor){
  const res = await fetch(`${API_URL}/setores/${setorId}`, {
    method: "PATCH",
    headers: {"Content-type": "application/json"},
    body: JSON.stringify(dataSetor)
  })
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Erro ao logar');
  }
  return res.json();
}