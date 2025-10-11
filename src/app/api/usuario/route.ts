import { CreateUsuario } from "@/types/usuario"
import { NextRequest, NextResponse } from "next/server"

async function createUsuario(req: NextRequest, usuarioData: CreateUsuario) {
  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL

  const token = req.cookies.get('jwt')

  const res = await fetch(`${BACKEND_URL}/usuario/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      cookie: `jwt=${token!.value}`
    },
    body: JSON.stringify(usuarioData)
  })

  const data = await res.json()
  if(!res.ok){
    const errorMessage = data?.message || "Erro ao registrar o usuário"
    throw new Error(errorMessage)
  }
  return data
}

async function getUsuarios(req: NextRequest) {
  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL
  const token = req.cookies.get('jwt')
  const res = await fetch(`${BACKEND_URL}/usuario/`, {
    method: "GET",
    headers: {
      cookie: `jwt=${token!.value}`
    }
  })

  const data = await res.json()
  if(!res.ok){
    throw new Error(data?.message || "Erro ao buscar usuários")
  }
  return data
}

export async function GET(req: NextRequest) {
  try {
    const usuarios = await getUsuarios(req)
    return NextResponse.json(usuarios)
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erro desconhecido" },
      { status: 500 })
  }
}

export async function POST(req: NextRequest) {
    try {
        const usuarioData: CreateUsuario = await req.json()
        const usuarios = await createUsuario(req, usuarioData)
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