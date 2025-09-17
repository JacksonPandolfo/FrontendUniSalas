import { NextResponse } from "next/server";

async function fetchSalas() {
  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL
  const res = await fetch(`${BACKEND_URL}/salas`)
  if(!res.ok) throw new Error("Erro ao carregar os blocos")
  return res.json()
}

export async function GET() {
  try {
    const salas = await fetchSalas()
    return NextResponse.json(salas)
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}