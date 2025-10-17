import { CreateUsuario } from "@/types/usuario";
import { NextRequest, NextResponse } from "next/server";

async function getReservas(req: NextRequest) {
  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL
  const token = req.cookies.get('jwt')
  const res = await fetch(`${BACKEND_URL}/reserva/`, {
    method: "GET",
    headers: {
      cookie: `jwt=${token!.value}`
    }
  })
  if(!res.ok) throw new Error("Erro ao carregar os blocos")
  return res.json()
}

async function createReserva(req: NextRequest, reservaData: CreateUsuario) {
  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL
  const token = req.cookies.get('jwt')

  const res = await fetch(`${BACKEND_URL}/reserva/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      cookie: `jwt=${token!.value}`
    },
    body: JSON.stringify(reservaData)
  })

  const data = await res.json()
  if(!res.ok){
    const errorMessage = data?.message || "Erro ao registrar o usuário"
    throw new Error(errorMessage)
  }
  return data
}


export async function GET(req: NextRequest) {
  try {
    const eventos = await getReservas(req)
    return NextResponse.json(eventos)
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {

    const reservaData = await req.json()
    const reserva = await createReserva(req, reservaData)
    return NextResponse.json(reserva)
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
