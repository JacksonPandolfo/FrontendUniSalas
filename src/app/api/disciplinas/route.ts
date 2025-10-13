import { NextRequest, NextResponse } from "next/server";

async function getDisciplinas(req: NextRequest) {
  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL
  const token = req.cookies.get('jwt')
  const res = await fetch(`${BACKEND_URL}/disciplina/`, {
    method: "GET",
    headers: {
      cookie: `jwt=${token!.value}`
    }
  })
  if(!res.ok) throw new Error("Erro ao carregar as disciplinas")
  return res.json()
}


export async function GET(req: NextRequest) {
  try {
    const disciplinas = await getDisciplinas(req)
    return NextResponse.json(disciplinas)
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}