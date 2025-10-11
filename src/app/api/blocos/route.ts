import { NextRequest, NextResponse } from "next/server";

async function fetchBlocos(req: NextRequest) {
  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL

  const token = req.cookies.get('jwt')
  const res = await fetch(`${BACKEND_URL}/bloco`, {
    method: "GET",
    headers: {
      cookie: `jwt=${token!.value}`
    }
  })
  if(!res.ok) throw new Error("Erro ao carregar os blocos")
  return res.json()
}

export async function GET(req: NextRequest) {
  try {
    const blocos = await fetchBlocos(req)
    return NextResponse.json(blocos)
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}