import { UpdateReservaDto } from "@/types/evento";
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

async function updateReservaById(reqNext: NextRequest, reservaId: string, dataReserva: UpdateReservaDto) {
  const token = reqNext.cookies.get('jwt')
  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL
  console.log(dataReserva)
  const res = await fetch(`${BACKEND_URL}/reserva/${reservaId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      cookie: `jwt=${token!.value}`
    },
    body: JSON.stringify(dataReserva),
    credentials: 'include'
  })
  if(!res.ok) throw new Error("Erro ao atualizar a reserva")
  return res.json()
}

async function deleteReservaById(reqNext: NextRequest, reservaId: string) {
  const token = reqNext.cookies.get('jwt')
  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL
  const res = await fetch(`${BACKEND_URL}/reserva/${reservaId}`, {
    method: "DELETE",
    headers: {
      cookie: `jwt=${token!.value}`
    },
    credentials: 'include'
  })
  if(!res.ok) throw new Error("Erro ao atualizar a reserva")
  return res.json()
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

export async function PATCH(req: NextRequest) {
  try {
    // const { reservaId } = await context.params
    const dataReserva: UpdateReservaDto = await req.json()
    console.log(dataReserva)
    if(!dataReserva.id) throw Error("ID da reserva não informado")

    const reserva = await updateReservaById(req, dataReserva.id, dataReserva)
    return NextResponse.json(reserva)
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}


export async function DELETE(req: NextRequest) {
  try {
    const reservaId: string = await req.json()
    if(!reservaId) throw Error("ID da reserva não informado")

    const reserva = await deleteReservaById(req, reservaId)
    return NextResponse.json(reserva)
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
