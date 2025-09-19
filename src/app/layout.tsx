// 'use client'

import { LayoutWrapper } from "@/components/layout"
import "./globals.css"
import { Metadata } from "next"
// import { NavLayout } from "@/components/navbarLayout"
// import { Footer } from "@/components/footer"
// import { Header } from "@/components/header"
// import { Menu } from "@/components/menu"
// import { Main } from "@/components/main"
// import { usePathname } from "next/navigation"
// import { LayoutWrapper } from "@/components/layout"

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
        <LayoutWrapper>{children}</LayoutWrapper>
        {/* {!isLoginPage && <Header className="flex row-start-1 row-end-2 col-start-1 col-span-full bg-blue-950 text-white"/>}
        {!isLoginPage && <Menu className={`row-start-1 row-end-3 col-start-1 col-end-2 flex flex-col min-h-full pl-4 bg-blue-950 text-white`}/>}
        <Main className={`flex row-start-2 row-end-3 col-start-2 col-end-3 justify-center bg-gray-100 transition-[width] duration-500 ease-in`}>
          {children}
        </Main>
        {!isLoginPage && <Footer className="row-start-3 row-end-4 col-start-1 col-span-full p-4 bg-zinc-900 text-white"/>} */}
      </body>
    </html>
  )
}