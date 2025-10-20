import { UpdateMobiliarioSala } from "@/types/mobiliario";


export async function updateMobiliariosBySalaId(SalaId:string, dataMobiliarios: UpdateMobiliarioSala){
  const res = await fetch(`/api/salas/sala/mobiliarios/${SalaId}`, {
    method: "PATCH",
    headers: {"Content-type": "application/json"},
    body: JSON.stringify(dataMobiliarios),
    credentials: "include"
  })
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Erro ao atualizar a sala');
  }
  return res.json();
}