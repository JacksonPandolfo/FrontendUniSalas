import { NextResponse } from "next/server"

async function callLoginUsuario(email: string, senha: string) {
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL
    const res = await fetch(`${BACKEND_URL}/auth/login`, {
      method: "POST",
      body: JSON.stringify({email, senha}),
      headers: { "Content-Type": "application/json" },
      credentials: "include"
    })
    if(!res.ok) throw new Error("Erro ao realizar login")

    const data = await res.json()
    const setCookieHeader = res?.headers.get("set-cookie")
    if(!setCookieHeader) throw new Error("Backend não retornou cookie")

    return { data, setCookieHeader }
}

export async function POST(req: Request) {
    try {
        const { email, senha } = await req.json()
        const { data, setCookieHeader} = await callLoginUsuario(email, senha)

        const response = NextResponse.json(data)

        if(setCookieHeader){
          response.headers.set('Set-Cookie', setCookieHeader)
        }

        return response
    } catch (err) {
        return NextResponse.json({ error: (err as Error).message }, { status: 500 })
    }

}