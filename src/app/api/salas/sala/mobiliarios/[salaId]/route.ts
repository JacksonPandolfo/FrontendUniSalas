import { UpdateMobiliarioSala } from "@/types/mobiliario"
import { NextRequest, NextResponse } from "next/server"

async function updateMobiliariosSalaById(req: NextRequest ,salaId: string, dataMobiliarios: UpdateMobiliarioSala) {
  const token = req.cookies.get('jwt')
  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL
  const res = await fetch(`${BACKEND_URL}/sala-mobiliario/bySalaId/${salaId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      cookie: `jwt=${token!.value}`
    },
    body: JSON.stringify(dataMobiliarios)
  })
  if(!res.ok) throw new Error("Erro ao atualizar a sala")
  return res.json()
}


export async function PATCH(req: NextRequest, context: { params: Promise<{ salaId: string }> }) {
  try {
    const { salaId } = await context.params
    const dataMobiliarios: UpdateMobiliarioSala = await req.json()
    if(!salaId) throw Error("ID da sala não informado")

    const setor = await updateMobiliariosSalaById(req, salaId, dataMobiliarios)
    return NextResponse.json(setor)
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}