import { cookies } from "next/headers";
import { NextResponse } from "next/server";

async function getEventosSala(salaId: string) {
  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL
  const token = (await cookies()).get('jwt')
  const res = await fetch(`${BACKEND_URL}/reserva/bySala/${salaId}`)
  if(!res.ok) throw new Error("Erro ao carregar os eventos da sala")
  return res.json()
}

export async function GET(req: Request, context: { params: Promise<{ salaId: string }> } ){
    try {
        const { salaId } = await context.params
        if(!salaId) throw Error("ID da sala não informado")

        const eventos = await getEventosSala(salaId)
        return NextResponse.json(eventos)
    } catch (err) {
        return NextResponse.json({ error: (err as Error).message }, { status: 500 })
    }
}