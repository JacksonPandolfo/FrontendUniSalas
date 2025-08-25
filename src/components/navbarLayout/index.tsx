'use client';
import { useState } from "react";
import { Header } from "../header";
import { Menu } from "../menu";
import { NavContext } from "../navContext";

export function NavLayout({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen((prev) => !prev);
    return(
        <NavContext.Provider value={{ isOpen, toggle }}>
            <Header isOpen={isOpen} setIsOpen={setIsOpen}/>
            <div className="flex flex-1 h-full">
                <div className={`transition-all duration-500 ${ isOpen ? "w-64" : "w-0" }`}>
                    <Menu isOpen={isOpen} />
                </div>
                <main className="flex-1 p-4 bg-gray-100 transition-all duration-500">
                    {children}
                </main>
            </div>
        </NavContext.Provider>
    )
}