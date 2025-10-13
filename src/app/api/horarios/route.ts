import { NextRequest, NextResponse } from "next/server";

async function getHorarios(req: NextRequest) {
  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL
  const token = req.cookies.get('jwt')
  const res = await fetch(`${BACKEND_URL}/horario/`, {
    method: "GET",
    headers: {
      cookie: `jwt=${token!.value}`
    }
  })
  if(!res.ok) throw new Error("Erro ao carregar os horários")
  return res.json()
}


export async function GET(req: NextRequest) {
  try {
    const horarios = await getHorarios(req)
    return NextResponse.json(horarios)
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}