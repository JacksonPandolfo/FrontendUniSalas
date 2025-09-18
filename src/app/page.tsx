import { Metadata } from "next"
import Login from "./login/page"

//Cria os metadados para essa PÁGINA específica (HOME)
export const metadata: Metadata = {
  title: "UniSalas - Autenticação",
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
    <div className="w-full h-full">
      <Login/>
    </div>
  )
}
