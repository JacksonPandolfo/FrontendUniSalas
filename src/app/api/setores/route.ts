// import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

async function fetchSetores(req: NextRequest) {

  const token = req.cookies.get('jwt')
  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL

  const res = await fetch(`${BACKEND_URL}/setores`, {
    method: "GET",
    headers: {
      cookie: `jwt=${token!.value}`
    },
  })
  if(!res.ok) throw new Error("Erro ao carregar os blocos")
  return res.json()
}

export async function GET(req: NextRequest) {
  try {
    const setores = await fetchSetores(req)
    return NextResponse.json(setores)
  } catch (err) {
    console.log(err)
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
