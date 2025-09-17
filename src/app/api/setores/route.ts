import { getSetores } from "@/lib/api/setores/api";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const setores = await getSetores()
    return NextResponse.json(setores)
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}