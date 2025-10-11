import { UpdateSala } from "@/types/sala"
import { NextRequest, NextResponse } from "next/server"

async function fetchSalasBySalaId(req: NextRequest,salaId: string) {
  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL
  const token = req.cookies.get('jwt')
  const res = await fetch(`${BACKEND_URL}/sala/${salaId}`, {
    method: 'GET',
    headers: {
        cookie: `jwt=${token!.value}`
    }
  })
  if(!res.ok) throw new Error("Erro ao carregar os blocos")
  return res.json()
}

async function updateSalaById(req: NextRequest ,salaId: string, dataSala: UpdateSala) {
  const token = req.cookies.get('jwt')
  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL
  const res = await fetch(`${BACKEND_URL}/sala/${salaId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      cookie: `jwt=${token!.value}`
    },
    body: JSON.stringify(dataSala)
  })
  if(!res.ok) throw new Error("Erro ao atualizar a sala")
  return res.json()
}

export async function GET(req: NextRequest, context: { params: Promise<{salaId: string}> } ) {
    try {
        const { salaId } = await context.params
        if(!salaId) throw Error("ID do setor não informado")

        const salas = await fetchSalasBySalaId(req, salaId)
        return NextResponse.json(salas)
    } catch (err) {
        return NextResponse.json({ error: (err as Error).message }, { status: 500 })
    }
}

export async function PATCH(req: NextRequest, context: { params: Promise<{ salaId: string }> }) {
  try {
    const { salaId } = await context.params
    const dataSala: UpdateSala = await req.json()
    if(!salaId) throw Error("ID da sala não informado")

    const setor = await updateSalaById(req, salaId, dataSala)
    return NextResponse.json(setor)
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}