import { NextRequest, NextResponse } from "next/server"

async function fetchSalasBySalaId(req: NextRequest, reservaId: string) {
  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL
  const token = req.cookies.get('jwt')
  const res = await fetch(`${BACKEND_URL}/sala/bySolicitacao/${reservaId}`, {
    method: 'GET',
    headers: {
        cookie: `jwt=${token!.value}`
    }
  })
  if(!res.ok) throw new Error("Erro ao carregar os blocos")
  return res.json()
}

export async function GET(req: NextRequest, context: { params: Promise<{reservaId: string}> } ) {
    try {
        const { reservaId } = await context.params
        if(!reservaId) throw Error("ID da reserva não informado")

        const salas = await fetchSalasBySalaId(req, reservaId)
        return NextResponse.json(salas)
    } catch (err) {
        return NextResponse.json({ error: (err as Error).message }, { status: 500 })
    }
}