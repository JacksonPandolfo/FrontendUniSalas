import { NextResponse } from "next/server"

async function callLoginUsuario(email: string, senha: string) {
    console.log("Cheguei no login para chamar o back")
  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL
  const res = await fetch(`${BACKEND_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({email, senha})
  })
  if(!res.ok) throw new Error("Erro ao realizar login")
  return res.json()
}

export async function POST(req: Request) {
    try {
        const { email, senha } = await req.json()
        const loginUsuario = await callLoginUsuario(email, senha)
        return NextResponse.json(loginUsuario)
    } catch (err) {
        return NextResponse.json({ error: (err as Error).message }, { status: 500 })
    }

}