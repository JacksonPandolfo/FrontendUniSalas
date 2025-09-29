import { cookies } from "next/headers"
import { NextResponse } from "next/server"

async function fetchSalasBySalaId(salaId: string) {
  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL
  const token = (await cookies()).get('jwt')
  const res = await fetch(`${BACKEND_URL}/sala/${salaId}`, {
    method: 'GET',
    headers: {
        cookie: `jwt=${token!.value}`
    }
  })
  if(!res.ok) throw new Error("Erro ao carregar os blocos")
  return res.json()
}

export async function GET(req: Request, context: { params: Promise<{salaId: string}> } ) {
    try {
        const { salaId } = await context.params
        if(!salaId) throw Error("ID do setor não informado")

        const salas = await fetchSalasBySalaId(salaId)
        return NextResponse.json(salas)
    } catch (err) {
        return NextResponse.json({ error: (err as Error).message }, { status: 500 })
    }
}