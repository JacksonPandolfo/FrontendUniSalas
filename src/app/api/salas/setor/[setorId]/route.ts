import { NextResponse } from "next/server"

async function fetchSalasBySetorId(setorId: string) {
  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL
  const res = await fetch(`${BACKEND_URL}/sala/bySetor/${setorId}`)
  if(!res.ok) throw new Error("Erro ao carregar os blocos")
  return res.json()
}

export async function GET(req: Request) {
    console.log("cheguei na chamada da sala por setor")
    try {
        const { pathname } = new URL(req.url)
        const setorId = pathname.split("/").pop()
        if(!setorId) throw Error("ID do setor não informado")

            const salas = await fetchSalasBySetorId(setorId)
        return NextResponse.json(salas)
    } catch (err) {
        return NextResponse.json({ error: (err as Error).message }, { status: 500 })
    }
}