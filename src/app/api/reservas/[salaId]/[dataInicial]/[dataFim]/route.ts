import { cookies } from "next/headers";
import { NextResponse } from "next/server";

async function getEventosSalaComData(salaId: string, dataInicial: string, dataFim: string) {
  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL
  const token = (await cookies()).get('jwt')
  const res = await fetch(`${BACKEND_URL}/reserva/byDate/${salaId}/${dataInicial}/${dataFim}`)
  if(!res.ok) throw new Error("Erro ao carregar os blocos")
  return res.json()
}

export async function GET(req: Request, context: { params: Promise<{salaId: string, dataInicial: string, dataFim: string }> }){
    try {
        const { salaId, dataInicial, dataFim } = await context.params
        if(!salaId || !dataInicial || !dataFim) throw Error("ID da sala ou datas não informadas")

        const eventos = await getEventosSalaComData(salaId, dataInicial, dataFim)
        return NextResponse.json(eventos)
    } catch (err) {
        return NextResponse.json({ error: (err as Error).message }, { status: 500 })
    }
}