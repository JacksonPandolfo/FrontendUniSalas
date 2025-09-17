import { NextResponse } from "next/server";
import { getEventosSalaComData } from "@/lib/api/reservas/api";

export async function GET(salaId: string, dataInicio: Date, dataFim: Date){
    try {
        const eventos = await getEventosSalaComData(salaId, dataInicio, dataFim)
        return NextResponse.json(eventos)
    } catch (err) {
        return NextResponse.json({ error: (err as Error).message }, { status: 500 })
    }
}