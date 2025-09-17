import { NextResponse } from "next/server";

async function fetchBlocos() {
  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL
  const res = await fetch(`${BACKEND_URL}/bloco`)
  if(!res.ok) throw new Error("Erro ao carregar os blocos")
  return res.json()
}

export async function GET() {
  try {
    const blocos = await fetchBlocos()
    return NextResponse.json(blocos)
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}