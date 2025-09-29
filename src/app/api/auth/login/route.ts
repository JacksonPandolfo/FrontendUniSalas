import { jwtDecode } from "jwt-decode"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

async function callLoginUsuario(email: string, senha: string) {
  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL
  const res = await fetch(`${BACKEND_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({email, senha}),
  })
  if(!res.ok) throw new Error("Erro ao realizar login")

  const setCookieHeader = res?.headers.get("set-cookie")
  if(!setCookieHeader) throw new Error("Backend não retornou cookie")

  const token = setCookieHeader.split(';')[0].split('=')[1]

  if(setCookieHeader){
    ;(await cookies()).set({
      name: 'jwt',
      value: token,
      secure: true,
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      expires: new Date(jwtDecode(token).exp! * 1000)
    })
  }
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