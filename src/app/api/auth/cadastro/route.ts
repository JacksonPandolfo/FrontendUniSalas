import { CreateUsuario } from "@/types/usuario"
import { NextRequest, NextResponse } from "next/server"

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

export async function POST(req: NextRequest) {
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