import { NextResponse } from "next/server";

async function fetchSetores() {
  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL
  const res = await fetch(`${BACKEND_URL}/setores`)
  if(!res.ok) throw new Error("Erro ao carregar os blocos")
  return res.json()
}

export async function GET() {
  try {
    const setores = await fetchSetores()
    return NextResponse.json(setores)
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
