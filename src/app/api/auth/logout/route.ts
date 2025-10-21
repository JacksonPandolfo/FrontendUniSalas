import { NextRequest, NextResponse } from "next/server"

async function callLogoutUsuario(req: NextRequest) {
    const token = req.cookies.get('jwt')
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL
    const res = await fetch(`${BACKEND_URL}/auth/logout`, {
        method: "POST",
        headers: {
            cookie: `jwt=${token!.value}`
        },
        credentials: "include"
    })
    if(!res.ok) throw new Error("Erro ao realizar o logout")

    const setCookieHeader = res?.headers.get("set-cookie")
    const data = await res.json()
    return { data, setCookieHeader }
}

export async function POST(req: NextRequest) {
    try {
        const { data, setCookieHeader } = await callLogoutUsuario(req)
        const response = NextResponse.json(data)

        if(setCookieHeader){
          response.headers.set('Set-Cookie', setCookieHeader)
        }

        return response
    } catch (err) {
        return NextResponse.json({ error: (err as Error).message }, { status: 500 })
    }
}