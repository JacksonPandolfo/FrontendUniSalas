import { UsuarioAdmin } from "@/types/usuario";
import { NextRequest, NextResponse } from "next/server";

async function getUsuariosByID(req: NextRequest, usuarioId: string) {
  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL
  const token = req.cookies.get('jwt')
  const res = await fetch(`${BACKEND_URL}/usuario/${usuarioId}`, {
    method: "GET",
    headers: {
      cookie: `jwt=${token!.value}`
    }
  })
  if(!res.ok) throw new Error("Erro ao buscar o usuário")
  return res.json()
}

async function updateUsuariosByID(req: NextRequest, usuarioId: string, usuarioData: UsuarioAdmin) {
  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL
  const token = req.cookies.get('jwt')
  const res = await fetch(`${BACKEND_URL}/usuario/${usuarioId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      cookie: `jwt=${token!.value}`
    },
    body: JSON.stringify(usuarioData)
  })
  if(!res.ok) throw new Error("Erro ao atualizar o usuário")
  return res.json()
}

async function deleteUsuariosByID(req: NextRequest, usuarioId: string) {
  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL
  const token = req.cookies.get('jwt')
  const res = await fetch(`${BACKEND_URL}/usuario/${usuarioId}`, {
    method: "DELETE",
    headers: {
        "Content-Type": "application/json",
        cookie: `jwt=${token!.value}`,
        // "Authorization": `Bearer ${token}`,
    }
  })
  if(!res.ok) throw new Error("Erro ao excluir o usuário")
  return res.json()
}

export async function GET(req: NextRequest, context: { params: Promise<{ usuarioId: string }> }) {
  try {
    const { usuarioId } = await context.params
    const usuarios = await getUsuariosByID(req, usuarioId)
    return NextResponse.json(usuarios)
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, context: { params: Promise<{ usuarioId: string }> }) {
  try {
    const { usuarioId } = await context.params
    const usuarioData: UsuarioAdmin = await req.json()
    const usuarios = await updateUsuariosByID(req, usuarioId, usuarioData)
    return NextResponse.json(usuarios)
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ usuarioId: string }> }) {
  try {
    const { usuarioId } = await context.params
    const usuarios = await deleteUsuariosByID(req, usuarioId)
    return NextResponse.json(usuarios)
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}