import { NextRequest, NextResponse } from "next/server";

async function getEventosSala(req: NextRequest,salaId: string) {
  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL

  const token = req.cookies.get('jwt')
  if (!token) {
    throw new Error("Token JWT não encontrado");
  }
  const res = await fetch(`${BACKEND_URL}/reserva/bySala/${salaId}`, {
    method: "GET",
    headers: {
        cookie: `jwt=${token!}`
    }
  })
  if(!res.ok) throw new Error("Erro ao carregar os eventos da sala")
  return res.json()
}

export async function GET(req: NextRequest, context: { params: Promise<{ salaId: string }> } ){
    try {
        const { salaId } = await context.params
        if(!salaId) throw Error("ID da sala não informado")

        const eventos = await getEventosSala(req, salaId)
        return NextResponse.json(eventos)
    } catch (err) {
        return NextResponse.json({ error: (err as Error).message }, { status: 500 })
    }
}