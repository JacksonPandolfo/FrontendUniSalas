import { cookies } from "next/headers"
import { NextResponse } from "next/server"

async function fetchSalasBySetorId(setorId: string) {
  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL
  const token = (await cookies()).get('jwt')
  const res = await fetch(`${BACKEND_URL}/sala/bySetor/${setorId}`, {
    method: "GET",
    headers: {
      cookie: `jwt=${token!.value}`
    }
  })
  if(!res.ok) throw new Error("Erro ao carregar os blocos")
  return res.json()
}

export async function GET(req: Request, context: { params: Promise<{setorId: string}> } ) {
    try {
        const { setorId } = await context.params
        if(!setorId) throw Error("ID do setor não informado")

        const salas = await fetchSalasBySetorId(setorId)
        return NextResponse.json(salas)
    } catch (err) {
        return NextResponse.json({ error: (err as Error).message }, { status: 500 })
    }
}