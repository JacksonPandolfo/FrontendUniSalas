import { NextResponse } from "next/server";
import { getEventosSala } from "@/lib/api/reservas/api";

export async function GET(salaId: string){
    try {
        const eventos = await getEventosSala(salaId)
        return NextResponse.json(eventos)
    } catch (err) {
        return NextResponse.json({ error: (err as Error).message }, { status: 500 })
    }
}