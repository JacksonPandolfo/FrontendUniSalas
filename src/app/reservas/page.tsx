import { Calendar } from "@/components/calendar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "UniSalas - Reservas",
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

export default function Reservas() {
  return (
    <div className="w-auto h-full">
        <Calendar/>
    </div>
  )
}