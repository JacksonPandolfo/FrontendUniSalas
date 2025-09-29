import { UsuarioAdmin } from "@/types/usuario";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

async function getUsuariosByID(usuarioId: string) {
  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL
  const token = (await cookies()).get('jwt')
  const res = await fetch(`${BACKEND_URL}/usuario/${usuarioId}`)
  if(!res.ok) throw new Error("Erro ao buscar o usuário")
  return res.json()
}

async function updateUsuariosByID(usuarioId: string, usuarioData: UsuarioAdmin) {
  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL
  const token = (await cookies()).get('jwt')
  const res = await fetch(`${BACKEND_URL}/usuario/${usuarioId}`, {
    method: "POST",
    headers: { "Content-Type": "application.json" },
    body: JSON.stringify(usuarioData)
  })
  if(!res.ok) throw new Error("Erro ao atualizar o usuário")
  return res.json()
}

async function deleteUsuariosByID(usuarioId: string) {
  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL
  const token = localStorage.getItem("token")
  const res = await fetch(`${BACKEND_URL}/usuario/${usuarioId}`, {
    method: "DELETE",
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    }
  })
  if(!res.ok) throw new Error("Erro ao excluir o usuário")
  return res.json()
}

export async function GET(req: Request, context: { params: { usuarioId: string } }) {
  try {
    const { usuarioId } = context.params
    const usuarios = await getUsuariosByID(usuarioId)
    return NextResponse.json(usuarios)
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

export async function PUT(req: Request, context: { params: { usuarioId: string } }) {
  try {
    const { usuarioId } = context.params
    const usuarioData: UsuarioAdmin = await req.json()
    const usuarios = await updateUsuariosByID(usuarioId, usuarioData)
    return NextResponse.json(usuarios)
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

export async function DELETE(req: Request, context: { params: { usuarioId: string } }) {
  try {
    const { usuarioId } = context.params
    const usuarios = await deleteUsuariosByID(usuarioId)
    return NextResponse.json(usuarios)
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}