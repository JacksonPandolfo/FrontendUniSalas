import { UpdateEquipamentoSala } from "@/types/equipamento"
import { NextRequest, NextResponse } from "next/server"

async function updateEquipamentosSalaById(req: NextRequest ,salaId: string, dataEquipamentos: UpdateEquipamentoSala) {
  const token = req.cookies.get('jwt')
  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL
  const res = await fetch(`${BACKEND_URL}/sala-equipamento/bySalaId/${salaId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      cookie: `jwt=${token!.value}`
    },
    body: JSON.stringify(dataEquipamentos)
  })
  if(!res.ok) throw new Error("Erro ao atualizar a sala")
  return res.json()
}


export async function PATCH(req: NextRequest, context: { params: Promise<{ salaId: string }> }) {
  try {
    const { salaId } = await context.params
    const dataEquipamentos: UpdateEquipamentoSala = await req.json()
    if(!salaId) throw Error("ID da sala não informado")

    const setor = await updateEquipamentosSalaById(req, salaId, dataEquipamentos)
    return NextResponse.json(setor)
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}