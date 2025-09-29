import { UpdateSetor } from "@/types/setor";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";


async function getSetorById(setorId: string) {
  const token = (await cookies()).get('jwt')
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

async function updateSetorById(setorId: string, dataSetor: UpdateSetor) {
  const token = (await cookies()).get('jwt')
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

async function deleteSetorByID(setorId: string) {
  const token = (await cookies()).get('jwt')
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

export async function GET(req: Request, context: { params: Promise<{setorId: string}> }) {
  try {
    const { setorId } = await context.params
    if(!setorId) throw Error("ID do setor não informado")

    const setor = await getSetorById(setorId)
    return NextResponse.json(setor)
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

export async function PATCH(req: Request, context: { params: Promise<{ setorId: string }> }) {
  try {
    const { setorId } = await context.params
    const dataSetor: UpdateSetor = await req.json()
    if(!setorId) throw Error("ID do setor não informado")

    const setor = await updateSetorById(setorId, dataSetor)
    return NextResponse.json(setor)
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

export async function DELETE(req: Request, context: { params: Promise<{ setorId: string }> }) {
  try {
    const { setorId } = await context.params
    const setor = await deleteSetorByID(setorId)
    return NextResponse.json(setor)
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}