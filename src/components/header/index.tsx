'use client';

import { BiUserCircle } from "react-icons/bi";

// import Image from "next/image";

type HeaderProps = {
  className?: string;
}
export function Header( {className}: HeaderProps
  // { isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (open: boolean) => void }
) {
  // const handleClick = () => {
  //   setIsOpen(!isOpen);
  // };
  return (
    <header className={className}>
      {/* <div className={`pl-2 flex items-baseline`}>
        <Image
          src="/logo-unisinos-menu.png"
          alt="Logo Unisinos"
          width={25}
          height={0}
          className={`transform transition-all duration-500 ${isOpen ? "ease-in opacity-100" : "ease-out opacity-0 absolute"}`}/>
        <h1 className={`font-poppins leading-none text-2xl font-bold transform transition-all duration-500 ${isOpen ? "ease-in opacity-100 translate-x-0 relative" : "ease-out opacity-0 -translate-x-50 absolute"}`}>
          Unisinos
        </h1>
      </div> */}
      {/* <button
            onClick={handleClick}
            className={`flex flex-col justify-center items-center hover:cursor-pointer transform transition-transform duration-500 ${isOpen ? "translate-x-20" : "translate-x-0"}`}
            >
            <span
              className={`bg-white block transition-all duration-300 ease-out
                h-0.5 w-6 rounded-sm ${
                  isOpen
                  ? "rotate-45 translate-y-1"
                  : "-translate-y-0.5"
                  }`}
                  ></span>
            <span
              className={`bg-white block transition-all duration-300 ease-out
                h-0.5 w-6 rounded-sm my-0.5 ${
                  isOpen ? "opacity-0" : "opacity-100"
                  }`}
                  ></span>
            <span
              className={`bg-white block transition-all duration-300 ease-out
                h-0.5 w-6 rounded-sm ${
                  isOpen
                  ? "-rotate-45 -translate-y-1"
                  : "translate-y-0.5"
                }`}
                  ></span>
      </button> */}
      <div className="flex items-center justify-end w-full mx-2 max-w-8xl">
          <h1 className="font-poppins text-2xl font-bold mr-2">UNISALAS</h1>
          <BiUserCircle></BiUserCircle>
      </div>
    </header>
  )
}