import "./globals.css"
import { Footer } from "@/components/footer"
import { Metadata } from "next"
import { NavLayout } from "@/components/navbarLayout"

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
      <body className="{`antialiased`} flex flex-col min-h-screen">
        <NavLayout>
          { children }
        </NavLayout>
        <Footer />
      </body>
    </html>
  )
}