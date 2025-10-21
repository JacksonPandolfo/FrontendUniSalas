import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

export const config = {
  // aplica em todas as rotas exceto login, assets e favicon
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('jwt')?.value
  const loginUrl = new URL('/login', req.url)
  const acessoNegadoUrl = new URL('/acesso-negado', req.url)
  const url = req.nextUrl.pathname

  // páginas públicas
  const publicPages = ['/login', '/cadastro']
  if (publicPages.some(path => url.startsWith(path))) {
    return NextResponse.next() // libera acesso mesmo sem token
  }

  // APIs públicas
  const publicApis = ['/api/auth/login', '/api/auth/cadastro']
  if (publicApis.some(path => url.startsWith(path))) {
    return NextResponse.next()
  }

  // aqui só entra se não for rota pública
  // se não tem token, redireciona para login
  if (!token) {
    return NextResponse.redirect(loginUrl)
  }

  try {
    const { payload } = await jwtVerify(token, secret)
    const roles = payload.roles as string[]

    //página exclusiva de gestão
    const adminPages = ['/gerenciamento']
    if(adminPages.some(path => url.startsWith(path))){
      if(!roles.includes('ADMINISTRADOR')){
        return NextResponse.redirect(acessoNegadoUrl)
      }
    }

    //página exclusiva de gestão
    const atendimentoPages = ['/espacos']
    if(atendimentoPages.some(path => url.startsWith(path))){
      if(!roles.includes('ATENDIMENTO') && !roles.includes('ADMINISTRADOR')){
        return NextResponse.redirect(acessoNegadoUrl)
      }
    }

    // se tem token, continua
    const res = NextResponse.next()
    res.headers.set('x-user-payload', JSON.stringify(payload))
    return res
  } catch (err) {
    console.error('Erro ao validar token:', err);
    return NextResponse.redirect(loginUrl);
  }

}
