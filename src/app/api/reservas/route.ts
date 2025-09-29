import { cookies } from "next/headers";
import { NextResponse } from "next/server";

async function getEventos() {
  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL
  const token = (await cookies()).get('jwt')
  const res = await fetch(`${BACKEND_URL}/reserva/`)
  if(!res.ok) throw new Error("Erro ao carregar os blocos")
  return res.json()
}


export async function GET() {
  try {
    const eventos = await getEventos()
    return NextResponse.json(eventos)
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}