import { Metadata } from "next"
// import Login from "./login/page"
// import Reservas from "./reservas/page"
import Link from "next/link"

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
            href="/login"
            className="px-6 py-3 rounded-2xl border-2 border-white bg-white text-blue-950 font-semibold shadow-lg hover:border-orange-400 hover:bg-orange-400 hover:text-white transition-all"
          >
            Entrar
          </Link>
          <Link
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


    // <div className="flex flex-col items-center justify-center w-full h-full gap-24">
    //   <h1 className="font-poppins font-bold text-7xl">Bem vindo ao Unisalas</h1>
    //   <div className="flex flex-col items-center justify-center">
    //     <div className="flex items-center gap-4">
    //       <p>Já possui cadastro?</p>
    //       <Link href={'/login'}>
    //         <button className="flex items-center justify-center border rounded font-poppins font-bold text-blue-950 p-1 w-20 text-center hover:cursor-pointer hover:bg-blue-950 hover:text-orange-400 transition duration-300">
    //           Entrar
    //         </button>
    //       </Link>
    //     </div>
    //     <div className="flex flex-col justify-center items-center gap-2">
    //       <p>Deseja se cadastrar?</p>
    //       <Link href={'/cadastro'}>
    //         <button className="flex items-center justify-center border rounded font-poppins font-bold text-blue-950 p-1 w-32 text-center hover:cursor-pointer hover:bg-blue-950 hover:text-orange-400 transition duration-300">
    //           Cadastre-se
    //         </button>
    //       </Link>
    //     </div>
    //   </div>
    //   {/* {isLoggedIn ? <Reservas/> : <Link href={'/reservas'}><Login/></Link>} */}
    // </div>
  )
}
