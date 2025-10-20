import { UpdateEquipamentoSala } from "@/types/equipamento";

export async function updateEquipamentosBySalaId(SalaId:string, dataEquipamentos: UpdateEquipamentoSala){
  const res = await fetch(`/api/salas/sala/equipamentos/${SalaId}`, {
    method: "PATCH",
    headers: {"Content-type": "application/json"},
    body: JSON.stringify(dataEquipamentos),
    credentials: "include"
  })
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Erro ao atualizar a sala');
  }
  return res.json();
}