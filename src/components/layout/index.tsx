'use client'

import { usePathname } from "next/navigation"
import { Header } from "../header"
import { Menu } from "../menu"
import { Main } from "../main"
import { Footer } from "../footer"

export function LayoutWrapper({ children }: { children:React.ReactNode }) {
    const pathname = usePathname()
    console.log("Pathname atual:", pathname)
    const isLoginPage = pathname === '/' || pathname === '/login' || pathname === '/cadastro'

    if (isLoginPage) {
        return(
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                {children}
            </div>
        )
    }

    return(
         <div className="min-h-screen grid grid-rows-[65px_1fr_auto] grid-cols-[var(--menu-width,245px)_1fr] transition-[grid-template-columns] duration-400 ease-in">
            <Header className="flex row-start-1 row-end-2 col-start-1 col-span-full bg-blue-950 text-white"/>
            <Menu className={`row-start-1 row-end-3 col-start-1 col-end-2 flex flex-col min-h-full pl-4 bg-blue-950 text-white`}/>
            <Main className={`flex row-start-2 row-end-3 col-start-2 col-end-3 justify-center bg-gray-100 transition-[width] duration-500 ease-in`}>
                {children}
            </Main>
            <Footer className="row-start-3 row-end-4 col-start-1 col-span-full p-4 bg-zinc-900 text-white"/>
        </div>
    )
}