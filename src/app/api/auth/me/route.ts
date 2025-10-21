import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const payloadHeader = req.headers.get('x-user-payload')
  if (!payloadHeader)
    return NextResponse.json({ message: 'Não autenticado' }, { status: 401 })

  const user = JSON.parse(payloadHeader)
  return NextResponse.json({ user })
}