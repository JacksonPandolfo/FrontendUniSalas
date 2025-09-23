import Link from "next/link";
import { BsBuildingGear, BsPersonGear  } from "react-icons/bs";

export default function Gerenciamento(){
    return (
        <div className="flex gap-6 justify-center items-center">
            <Link href={'/gerenciamento/espacos'} className="w-lg h-11/12">
                <div
                    className="relative flex flex-col items-center justify-center w-full h-full border-6 rounded-lg border-blue-950 group hover:bg-blue-950 hover:cursor-pointer hover:scale-105 transition-all transform duration-500"
                    >
                    <h1 className="font-poppins absolute group-hover:text-white top-2 text-6xl font-bold text-blue-950 transition duration-500">ESPAÇOS</h1>
                    <BsBuildingGear className="text-blue-950 group-hover:text-white transition duration-500" size={200}/>
                    <span className="absolute bottom-2 italic w-80 text-blue-950 text-center group-hover:text-white">Clique no cartão para ser direcionado ao gerenciamento de espaços</span>
                </div>
            </Link>
            <Link href={'/gerenciamento/usuarios'} className="w-lg h-11/12">
                <div
                    className="relative flex items-center justify-center w-full h-full border-6 rounded-lg border-blue-950 group hover:bg-blue-950 hover:cursor-pointer hover:scale-105 transition-all transform duration-500"
                    >
                    <h1 className="font-poppins absolute group-hover:text-white top-2 text-6xl font-bold text-blue-950 transition duration-500">USUÁRIOS</h1>
                    <BsPersonGear className="text-blue-950 group-hover:text-white transition duration-500" size={200}/>
                    <span className="absolute bottom-2 italic w-80 text-blue-950 text-center group-hover:text-white">Clique no cartão para ser direcionado ao gerenciamento de usuários</span>
                </div>
            </Link>
        </div>
    )
}