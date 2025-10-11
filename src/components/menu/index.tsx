'use client';
import { useEffect, useState } from "react";
import Link from "next/link";
import { VscHome } from "react-icons/vsc";
import { RiCalendarEventLine } from "react-icons/ri";
import { BsBuildingGear, BsGear } from "react-icons/bs";
import Image from "next/image";
import { TbCalendarPlus } from "react-icons/tb";

type MenuProps = {
  className?: string
}

export function Menu({className} : MenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    document.body.style.setProperty("--menu-width", isOpen ? "255px" : "60px")
  }, [isOpen])

  return (
    // flex z-50 flex-col min-h-full pl-4 w-3xs bg-blue-950 text-white transform transition-transform duration-500 ${isOpen ? "translate-x-0" : "-translate-x-48"}
      <div className={`${className} relative w-[var(--menu-width)] flex flex-col min-h-full transform transition-all duration-400 ease-in`}>
        <div className={`flex justify-between mt-4 transform transition-all w-full duration-400`}>
          <div className={`flex items-baseline gap-2`}>
            <Image
              src="/logo-unisinos-menu.png"
              alt="Logo Unisinos"
              width={25}
              height={0}
              className={`transform transition-all duration-500 ${isOpen ? "ease-in opacity-100" : "ease-out opacity-0"}`}/>
            <h1 className={`font-poppins text-2xl font-bold transform transition-all duration-400 ${isOpen ? "ease-in opacity-100 translate-x-0" : "ease-out opacity-0 -translate-x-50"}`}>
              Unisinos
            </h1>
          </div>
          {/* <div className={`flex justify-center transform transition-all duration-400`}> */}
          <button
              onClick={handleClick}
              className={`absolute top-7 flex flex-col justify-center hover:cursor-pointer transform transition-all duration-400 ease-in ${isOpen ? "pl-50": "pl-0"}`}
              >
              <span
                className={`bg-white transition-all duration-300 ease-out
                  h-0.5 w-6 rounded-sm ${
                    isOpen
                    ? "rotate-45 translate-y-1"
                    : "-translate-y-0.5"
                    }`}
                    ></span>
              <span
                className={`bg-white transition-all duration-300 ease-out
                  h-0.5 w-6 rounded-sm my-0.5 ${
                    isOpen ? "opacity-0" : "opacity-100"
                    }`}
                    ></span>
              <span
                className={`bg-white transition-all duration-300 ease-out
                  h-0.5 w-6 rounded-sm ${
                    isOpen
                    ? "-rotate-45 -translate-y-1"
                    : "translate-y-0.5"
                  }`}
                    ></span>
          </button>
        </div>
        <div className={`flex flex-col space-y-4 mt-8`}>
          <div className="flex items-center gap-2 hover:cursor-pointer h-8">
            <Link href="/" className={`w-6 h-6`}>
              <VscHome className={`w-6 h-6 align-baseline relative`}/>
            </Link>
            <Link href="/"
              className={`relative font-semibold text-lg font-poppins text-white
              after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0
              after:bg-blue-400 after:transition-all after:duration-300
              hover:after:w-full transform transition-transform duration-400 origin-left ${isOpen ? "ease-in scale-100 opacity-100 translate-x-0" : "ease-out opacity-0 scale-50 -translate-x-52"}`}>
              Home
            </Link>
          </div>
          <div className="flex items-center gap-2 hover:cursor-pointer h-8">
            <Link href="/reservas">
              <RiCalendarEventLine className={`w-6 h-6 align-baseline relative`} />
            </Link>
            <Link className={`relative font-semibold text-lg font-poppins text-white
           after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0
           after:bg-blue-500 after:transition-all after:duration-300
           hover:after:w-full transform transition-transform duration-400 origin-left ${isOpen ? "ease-in scale-100 opacity-100 translate-x-0" : "ease-out opacity-0 scale-50 -translate-x-52"}`} href="/reservas">Ver reservas</Link>
          </div>
          <div className="flex items-center gap-2 hover:cursor-pointer h-8">
            <Link href="/reservas/agendamento">
              <TbCalendarPlus className={`w-6 h-6 align-baseline relative`} />
            </Link>
            <Link className={`relative font-semibold text-lg font-poppins text-white
           after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0
           after:bg-blue-500 after:transition-all after:duration-300
           hover:after:w-full transform transition-transform duration-400 origin-left ${isOpen ? "ease-in scale-100 opacity-100 translate-x-0" : "ease-out opacity-0 scale-50 -translate-x-52"}`} href="/reservas">Solicitar reserva</Link>
          </div>
          <div className="flex items-center gap-2 hover:cursor-pointer h-8">
            <Link href="/espacos">
              <BsBuildingGear className={`w-6 h-6 align-baseline relative`} />
            </Link>
            <Link className={`relative font-semibold text-lg font-poppins text-white
           after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0
           after:bg-blue-500 after:transition-all after:duration-300
           hover:after:w-full transform transition-transform duration-400 origin-left ${isOpen ? "ease-in scale-100 opacity-100 translate-x-0" : "ease-out opacity-0 scale-50 -translate-x-52"}`} href="/espacos">Espaços</Link>
          </div>
          <div className="flex items-center gap-2 hover:cursor-pointer h-8">
            <Link href="/gerenciamento">
              <BsGear className={`w-6 h-6 align-baseline relative`}/>
            </Link>
            <Link href="/gerenciamento"
              className={`relative font-semibold text-lg font-poppins text-white
              after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0
              after:bg-blue-400 after:transition-all after:duration-300
              hover:after:w-full transform transition-transform duration-400 origin-left ${isOpen ? "ease-in scale-100 opacity-100 translate-x-0" : "ease-out opacity-0 scale-50 -translate-x-52"}`}>
              Gerenciamento
              {/* transform transition-all duration-400  */}
            </Link>
          </div>
        </div>
      </div>
  );
}