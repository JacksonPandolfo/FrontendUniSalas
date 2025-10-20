import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const config = {
  // aplica em todas as rotas exceto login, assets e favicon
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}

export function middleware(req: NextRequest) {
  const token = req.cookies.get('jwt')?.value
  const loginUrl = new URL('/login', req.url)

  // páginas públicas
  const publicPages = ['/login', '/cadastro']
  if (publicPages.some(path => req.nextUrl.pathname.startsWith(path))) {
    return NextResponse.next() // libera acesso mesmo sem token
  }

  // APIs públicas
  const publicApis = ['/api/auth/login', '/api/auth/cadastro']
  if (publicApis.some(path => req.nextUrl.pathname.startsWith(path))) {
    console.log("to aqui no middleware")
    return NextResponse.next()
  }

  // aqui só entra se não for rota pública
  // se não tem token, redireciona para login
  if (!token) {
    return NextResponse.redirect(loginUrl)
  }

  // se tem token, continua
  return NextResponse.next()
}
