import { NextResponse } from "next/server";
import { getEventos } from "@/lib/api/reservas/api";

export async function GET() {
  try {
    const eventos = await getEventos()
    return NextResponse.json(eventos)
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}