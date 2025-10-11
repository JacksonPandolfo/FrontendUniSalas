import { UpdateBloco } from "@/types/bloco";
import { NextRequest, NextResponse } from "next/server";

async function fetchBlocosByBlocoId(reqNext: NextRequest, blocoId: string) {
  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL
  const token = reqNext.cookies.get('jwt')
  const res = await fetch(`${BACKEND_URL}/bloco/${blocoId}`, {
    method: "GET",
    headers: {
      cookie: `jwt=${token!.value}`
    },
  })
  if(!res.ok) throw new Error("Erro ao carregar os blocos")
  return res.json()
}

async function updateBlocoById(reqNext: NextRequest, setorId: string, dataBloco: UpdateBloco) {
  const token = reqNext.cookies.get('jwt')
  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL
  const res = await fetch(`${BACKEND_URL}/bloco/${setorId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      cookie: `jwt=${token!.value}`
    },
    body: JSON.stringify(dataBloco)
  })
  if(!res.ok) throw new Error("Erro ao atualizar o bloco")
  return res.json()
}

export async function GET(req: NextRequest, context: { params: Promise<{blocoId: string}>}) {
  try {
    const { blocoId } = await context.params
    if(!blocoId) throw Error("ID do setor não informado")

    const bloco = await fetchBlocosByBlocoId(req, blocoId)
    return NextResponse.json(bloco)
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, context: { params: Promise<{ blocoId: string }> }) {
  try {
    const { blocoId } = await context.params
    const dataBloco: UpdateBloco = await req.json()
    if(!blocoId) throw Error("ID do bloco não informado")

    const setor = await updateBlocoById(req, blocoId, dataBloco)
    return NextResponse.json(setor)
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

