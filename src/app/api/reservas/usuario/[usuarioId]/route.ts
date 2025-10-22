import { NextRequest, NextResponse } from "next/server"

async function fetchReservasByUsuarioId(req: NextRequest, usuarioId: string) {
  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL
  const token = req.cookies.get('jwt')
  const res = await fetch(`${BACKEND_URL}/reserva/byUsuario/${usuarioId}`, {
    method: "GET",
    headers: {
      cookie: `jwt=${token!.value}`
    },
  })
  if(!res.ok) throw new Error("Erro ao carregar as reservas do usuário")
  return res.json()
}

export async function GET(req: NextRequest, context: { params: Promise<{usuarioId: string}>}) {
  try {
    const { usuarioId } = await context.params
    if(!usuarioId) throw Error("ID do usuário não informado")

    const blocos = await fetchReservasByUsuarioId(req, usuarioId)
    return NextResponse.json(blocos)
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}