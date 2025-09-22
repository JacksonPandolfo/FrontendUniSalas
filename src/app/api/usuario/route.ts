import { CreateUsuario } from "@/types/usuario"
import { NextResponse } from "next/server"

async function createUsuario(usuarioData: CreateUsuario) {
  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL

  const res = await fetch(`${BACKEND_URL}/usuario/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(usuarioData)
  })

  const data = await res.json()
  if(!res.ok){
    const errorMessage = data?.message || "Erro ao registrar o usuário"
    throw new Error(errorMessage)
  }
  return data
}

async function getUsuarios() {
  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL

  const res = await fetch(`${BACKEND_URL}/usuario/`)

  const data = await res.json()
  if(!res.ok){
    throw new Error(data?.message || "Erro ao buscar usuários")
  }
  return data
}

export async function GET() {
  try {
    const usuarios = await getUsuarios()
    return NextResponse.json(usuarios)
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erro desconhecido" },
      { status: 500 })
  }
}

export async function POST(req: Request) {
    try {
        const usuarioData: CreateUsuario = await req.json()
        const usuarios = await createUsuario(usuarioData)
        return NextResponse.json(usuarios)
    } catch (err) {
        const errorMessage = (err as Error).message

        if(errorMessage.includes('já está em uso')){
          return NextResponse.json({ error: errorMessage }, { status: 409 })
        }
        return NextResponse.json(
          { error: errorMessage },
          { status: 500 })
    }
}