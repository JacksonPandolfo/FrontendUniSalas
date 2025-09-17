import { NextResponse } from "next/server"

async function fetchSalasByBlocoId(blocoId: string) {
  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL
  const res = await fetch(`${BACKEND_URL}/sala/byBloco/${blocoId}`)
  if(!res.ok) throw new Error("Erro ao carregar os blocos")
  return res.json()
}

export async function GET(req: Request) {
    console.log("cheguei no bloco e não no setor")
    try {
        const { pathname } = new URL(req.url)
        const blocoId = pathname.split("/").pop()
        if(!blocoId) throw Error("ID do setor não informado")

            const salas = await fetchSalasByBlocoId(blocoId)
        return NextResponse.json(salas)
    } catch (err) {
        return NextResponse.json({ error: (err as Error).message }, { status: 500 })
    }
}