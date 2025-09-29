import { cookies } from "next/headers"
import { NextResponse } from "next/server"

async function fetchSalasByBlocoId(blocoId: string) {
  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL
  const token = (await cookies()).get('jwt')
  const res = await fetch(`${BACKEND_URL}/sala/byBloco/${blocoId}`,{
    method: "GET",
    headers: {
        cookie: `jwt=${token!.value}`
    },
    credentials: 'include'
  })
  if(!res.ok) throw new Error("Erro ao carregar os blocos")
  return res.json()
}

export async function GET(req: Request, context: { params: Promise<{blocoId: string}>}) {
    try {
        const { blocoId } = await context.params
        if(!blocoId) throw Error("ID do setor não informado")

        const salas = await fetchSalasByBlocoId(blocoId)
        return NextResponse.json(salas)
    } catch (err) {
        return NextResponse.json({ error: (err as Error).message }, { status: 500 })
    }
}