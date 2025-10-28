import { Metadata } from "next"
// import Login from "./login/page"
// import Reservas from "./reservas/page"
import Link from "next/link"
import NProgress from 'nprogress'

//Cria os metadados para essa PÁGINA específica (HOME)
export const metadata: Metadata = {
  title: "UniSalas - ",
  description: "Gestão de salas em um só lugar",
  openGraph: {
    title: "UniSalas - Autenticação",
    description: "Gestão de salas em um só lugar",
    images: ["https://www.unisinos.br/images/unisinos-p.png"]
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true
    }
  }
}

//Função que cria a página HOME
export default function Home() {
  return (
    <main className="flex flex-col min-h-screen w-full  bg-blue-950 text-white">
      <header className="flex items-center justify-between px-8 py-4 shadow-lg">
        <h1 className="text-2xl font-bold tracking-wide">UniSalas</h1>
        <span className="text-sm opacity-80">Universidade do Vale do Rio dos Sinos</span>
      </header>

      <section className="flex flex-1 flex-col items-center justify-center text-center px-6">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
          Bem-vindo ao <span className="text-orange-400">UniSalas</span>
        </h2>
        <p className="text-lg md:text-xl mb-10 max-w-2xl opacity-90">
          Organize e reserve salas de forma rápida, prática e moderna.
        </p>
        <div className="flex items-center gap-6">
          <Link
            onClick={() => NProgress.start()}
            href="/login"
            className="px-6 py-3 rounded-2xl border-2 border-white bg-white text-blue-950 font-semibold shadow-lg hover:border-orange-400 hover:bg-orange-400 hover:text-white transition-all"
          >
            Entrar
          </Link>
          <Link
            onClick={() => NProgress.start()}
            href="/cadastro"
            className="px-6 py-3 rounded-2xl border-2 border-white font-semibold hover:border-orange-400 hover:bg-orange-400 hover:text-white transition-all"
          >
            Criar conta
          </Link>
        </div>
      </section>

      <footer className="py-4 text-center text-sm opacity-70">
        © {new Date().getFullYear()} UniSalas - Universidade do Vale do Rio dos Sinos
      </footer>
    </main>
  )
}
