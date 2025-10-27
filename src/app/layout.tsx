// 'use client'

import { LayoutWrapper } from "@/components/layout"
import "@/styles/globals.css"
import { Metadata } from "next"
import NProgressClient from "@/components/barraProgresso"


export const metadata: Metadata = {
  title: "Reserva de salas UniSalas",
  description: "Realizando a alocação de salas com o UniSalas",
  openGraph: {
    title: "Reserva de salas UniSalas",
    description: "Realizando a alocação de salas com o UniSalas",
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

export default function RootLayout({
  children
}: { children: React.ReactNode }
) {

  return (
    <html lang="en">
      {/* antialiased flex flex-col min-h-screen" */}
      <body className="antialiased min-h-screen">
        <NProgressClient/>
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  )
}