import Link from "next/link";
import { VscHome } from "react-icons/vsc";
import { RiCalendarEventLine } from "react-icons/ri";
import { BsBuildingGear } from "react-icons/bs";
export function Menu({ isOpen }: { isOpen?: boolean }) {
  return (
      <div className="bg-zinc-900 text-white h-full">
          <div className={`fixed h-screen left-0 pl-4 pt-2 w-3xs bg-blue-950 text-white transform transition-transform duration-500 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="flex flex-col space-y-4">
            <div className="flex items-baseline gap-2 hover:cursor-pointer">
              <VscHome className="w-6 h-6 align-baseline relative top-[3px]" />
              <Link href="/"
                className="relative font-semibold text-lg font-poppins text-white
                after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0
              after:bg-blue-400 after:transition-all after:duration-300
                hover:after:w-full">
                Home
              </Link>
            </div>
            <div className="flex items-baseline gap-2 hover:cursor-pointer">
              <RiCalendarEventLine className="w-5 h-5 align-baseline relative top-[3px]" />
              <Link className="relative font-semibold text-lg font-poppins text-white
             after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0
             after:bg-blue-500 after:transition-all after:duration-300
             hover:after:w-full" href="/reservas">Reservas</Link>
            </div>
            <div className="flex items-baseline gap-2 hover:cursor-pointer">
              <BsBuildingGear className="w-5 h-5 align-baseline relative top-[1px]" />
              <Link className="relative font-semibold text-lg font-poppins text-white
             after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0
             after:bg-blue-500 after:transition-all after:duration-300
             hover:after:w-full" href="/espacos">Espaços</Link>
            </div>
          </div>
        </div>
    </div>
  );
}