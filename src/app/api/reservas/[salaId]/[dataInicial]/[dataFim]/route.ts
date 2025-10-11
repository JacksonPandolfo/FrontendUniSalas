import { NextRequest, NextResponse } from "next/server";

async function getEventosSalaComData(req: NextRequest,salaId: string, dataInicial: string, dataFim: string) {
  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL
  const token = req.cookies.get('jwt')
  const res = await fetch(`${BACKEND_URL}/reserva/byDate/${salaId}/${dataInicial}/${dataFim}`, {
    method: "GET",
    headers: {
        cookie: `jwt=${token!.value}`
    }
  })
  if(!res.ok) throw new Error("Erro ao carregar os blocos")
  return res.json()
}

export async function GET(req: NextRequest, context: { params: Promise<{salaId: string, dataInicial: string, dataFim: string }> }){
    try {
        const { salaId, dataInicial, dataFim } = await context.params
        if(!salaId || !dataInicial || !dataFim) throw Error("ID da sala ou datas não informadas")

        const eventos = await getEventosSalaComData(req, salaId, dataInicial, dataFim)
        return NextResponse.json(eventos)
    } catch (err) {
        return NextResponse.json({ error: (err as Error).message }, { status: 500 })
    }
}