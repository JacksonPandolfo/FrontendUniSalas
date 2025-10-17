import { NextRequest, NextResponse } from "next/server"

async function fetchTurmasByMinistrante(reqNext: NextRequest, ministranteId: string) {
  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL
  const token = reqNext.cookies.get('jwt')
  const res = await fetch(`${BACKEND_URL}/turma/byMinistrante/${ministranteId}`, {
    method: "GET",
    headers: {
      cookie: `jwt=${token!.value}`
    },
  })
  if(!res.ok) throw new Error("Erro ao carregar os blocos")
  return res.json()
}

export async function GET(req: NextRequest, context: { params: Promise<{ministranteId: string}>}) {
  try {
    const { ministranteId } = await context.params
    if(!ministranteId) throw Error("ID do setor não informado")

    const bloco = await fetchTurmasByMinistrante(req, ministranteId)
    return NextResponse.json(bloco)
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}