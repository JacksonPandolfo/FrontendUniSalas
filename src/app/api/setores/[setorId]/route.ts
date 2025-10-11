import { UpdateSetor } from "@/types/setor";
import { NextRequest, NextResponse } from "next/server";


async function getSetorById(req: NextRequest, setorId: string) {
  const token = req.cookies.get('jwt')
  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL
  const res = await fetch(`${BACKEND_URL}/setores/${setorId}`, {
    method: "GET",
    headers: {
      cookie: `jwt=${token!.value}`
    },
  })
  if(!res.ok) throw new Error("Erro ao carregar os blocos")
  return res.json()
}

async function updateSetorById(req: NextRequest, setorId: string, dataSetor: UpdateSetor) {
  const token = req.cookies.get('jwt')
  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL
  const res = await fetch(`${BACKEND_URL}/setores/${setorId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      cookie: `jwt=${token!.value}`
    },
    body: JSON.stringify(dataSetor)
  })
  if(!res.ok) throw new Error("Erro ao carregar os blocos")
  return res.json()
}

async function deleteSetorByID(req: NextRequest, setorId: string) {
  const token = req.cookies.get('jwt')
  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL
  const res = await fetch(`${BACKEND_URL}/setores/${setorId}`, {
    method: "DELETE",
    headers: {
        "Content-Type": "application/json",
        cookie: `jwt=${token!.value}`,
    }
  })
  if(!res.ok) throw new Error("Erro ao excluir o usuário")
  return res.json()
}

export async function GET(req: NextRequest, context: { params: Promise<{setorId: string}> }) {
  try {
    const { setorId } = await context.params
    if(!setorId) throw Error("ID do setor não informado")

    const setor = await getSetorById(req, setorId)
    return NextResponse.json(setor)
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, context: { params: Promise<{ setorId: string }> }) {
  try {
    const { setorId } = await context.params
    const dataSetor: UpdateSetor = await req.json()
    if(!setorId) throw Error("ID do setor não informado")

    const setor = await updateSetorById(req, setorId, dataSetor)
    return NextResponse.json(setor)
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ setorId: string }> }) {
  try {
    const { setorId } = await context.params
    const setor = await deleteSetorByID(req, setorId)
    return NextResponse.json(setor)
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}