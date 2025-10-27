'use client';

import { useState, useRef, useEffect } from "react";
import { BiUserCircle } from "react-icons/bi";
import { IoMdExit } from "react-icons/io";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/api/auth/api";
import { useUser } from "@/hooks/useUser";
import { BsPerson } from "react-icons/bs";

type HeaderProps = {
  className?: string;
}
export function Header( {className}: HeaderProps) {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const dropdownRef = useRef<HTMLDivElement>(null)
  const user = useUser()

  // Fecha o dropdown se clicar fora dele
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
    } catch (err) {
      console.error("Erro ao sair do sistema", err)
    } finally {
      router.push('/login')
    }
  }
  const handleProfileEdit = () => {
      router.push('/gerenciamento/usuarios/me')
  }

  return (
    <header className={className}>
      <div className="flex items-center justify-end w-full mx-2 max-w-8xl">
          <h1 className="font-poppins text-2xl font-bold mr-2">UNISALAS</h1>
          <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="flex items-center focus:outline-none"
          >
            <BiUserCircle size={30} className="hover:text-blue-500 transition-colors duration-200" />
          </button>
          {open && (
            <div
              className="absolute flex flex-col right-0 mt-2 w-40 bg-white border border-gray-200 rounded-xl shadow-lg z-50 animate-fadeIn"
            >
              <p className="w-full px-4 py-2 text-gray-700">Olá, {user?.nome}</p>
              <button
                onClick={handleProfileEdit}
                className="w-full flex justify-between px-4 py-2 rounded-xl text-gray-700 hover:bg-gray-100"
              >
                Editar Perfil
                <BsPerson size={20}/>
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex justify-between px-4 py-2 rounded-xl text-gray-700 hover:bg-red-100"
              >
                Sair
                <IoMdExit size={20}/>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}