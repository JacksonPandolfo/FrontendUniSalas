import { NextResponse } from "next/server";

async function fetchBlocosBySetorId(setorId: string) {
  console.log("tentei requisição pro back")
  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL
  const res = await fetch(`${BACKEND_URL}/bloco/${setorId}`)
  if(!res.ok) throw new Error("Erro ao carregar os blocos")
  return res.json()
}

export async function GET(req: Request) {
  try {
    const { pathname } = new URL(req.url)
    const setorId = pathname.split("/").pop()
    if(!setorId) throw Error("ID do setor não informado")

    const blocos = await fetchBlocosBySetorId(setorId)
    return NextResponse.json(blocos)
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}