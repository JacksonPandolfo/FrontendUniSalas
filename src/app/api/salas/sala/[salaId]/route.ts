import { NextResponse } from "next/server"

async function fetchSalasBySalaId(salaId: string) {
  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL
  const res = await fetch(`${BACKEND_URL}/sala/byBloco/${salaId}`)
  if(!res.ok) throw new Error("Erro ao carregar os blocos")
  return res.json()
}

export async function GET(req: Request) {
    try {
        const { pathname } = new URL(req.url)
        const salaId = pathname.split("/").pop()
        if(!salaId) throw Error("ID do setor não informado")

            const salas = await fetchSalasBySalaId(salaId)
        return NextResponse.json(salas)
    } catch (err) {
        return NextResponse.json({ error: (err as Error).message }, { status: 500 })
    }
}