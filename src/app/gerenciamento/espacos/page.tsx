import Link from "next/link";
import { BsBuilding, BsBuildingGear } from "react-icons/bs";
import { SiGoogleclassroom } from "react-icons/si";
import { TbCircleArrowLeftFilled } from "react-icons/tb";

export default function GerenciamentoEspacos(){

    return (
        <div className="flex flex-col gap-6 mt-2 justify-center items-center py-6 px-4">
            <Link href={'/gerenciamento'} className="border-2 flex items-center border-blue-950 text-blue-950 font-poppins rounded-2xl p-2 hover:cursor-pointer hover:bg-blue-950 hover:text-white hover:scale-105 transition duration-500">
                    <TbCircleArrowLeftFilled size={30}/> Voltar para gerenciamento
            </Link>
            <div className="grid justify-items-center place-items-center grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
                <Link href={'/gerenciamento/espacos/setores'} className="
                    w-[340px] h-[400px]        /* base → mobile */
                    sm:w-[360px] sm:h-[420px]  /* ≥640px */
                    md:w-[380px] md:h-[460px]  /* ≥768px */
                    lg:w-[400px] lg:h-[500px]  /* ≥1024px */
                    xl:w-[420px] xl:h-[540px]  /* ≥1280px (23–24” monitor padrão) */
                    2xl:w-[440px] 2xl:h-[560px] /* ≥1536px */
                ">
                    <div
                        className="relative flex flex-col items-center justify-center w-full h-full border-6 rounded-lg border-blue-950 group hover:bg-blue-950 hover:cursor-pointer hover:scale-105 transition-all transform duration-500"
                        >
                        <h1 className="font-poppins absolute group-hover:text-white top-2 text-6xl font-bold text-blue-950 transition duration-500">SETORES</h1>
                        <BsBuildingGear className="text-blue-950 group-hover:text-white transition duration-500
                            w-[140px] h-[200px]        /* base → mobile */
                            sm:w-[160px] sm:h-[240px]  /* ≥640px */
                            md:w-[180px] md:h-[280px]  /* ≥768px */
                            lg:w-[200px] lg:h-[320px]  /* ≥1024px */
                            xl:w-[220px] xl:h-[360px]  /* ≥1280px (23–24” monitor padrão) */
                            2xl:w-[240px] 2xl:h-[400px] /* ≥1536px */
                            "/>
                        <span className="absolute bottom-2 italic w-80 text-blue-950 text-center group-hover:text-white">Clique no cartão para ser direcionado ao gerenciamento de setores</span>
                    </div>
                </Link>
                <Link href={'/gerenciamento/espacos/blocos'} className="
                    w-[340px] h-[400px]        /* base → mobile */
                    sm:w-[360px] sm:h-[420px]  /* ≥640px */
                    md:w-[380px] md:h-[460px]  /* ≥768px */
                    lg:w-[400px] lg:h-[500px]  /* ≥1024px */
                    xl:w-[420px] xl:h-[540px]  /* ≥1280px (23–24” monitor padrão) */
                    2xl:w-[440px] 2xl:h-[560px] /* ≥1536px */
                ">
                    <div
                        className="relative flex flex-col items-center justify-center w-full h-full border-6 rounded-lg border-blue-950 group hover:bg-blue-950 hover:cursor-pointer hover:scale-105 transition-all transform duration-500"
                        >
                        <h1 className="font-poppins absolute group-hover:text-white top-2 text-6xl font-bold text-blue-950 transition duration-500">BLOCOS</h1>
                        <BsBuilding className="text-blue-950 group-hover:text-white transition duration-500
                            w-[140px] h-[200px]        /* base → mobile */
                            sm:w-[160px] sm:h-[240px]  /* ≥640px */
                            md:w-[180px] md:h-[280px]  /* ≥768px */
                            lg:w-[200px] lg:h-[320px]  /* ≥1024px */
                            xl:w-[220px] xl:h-[360px]  /* ≥1280px (23–24” monitor padrão) */
                            2xl:w-[240px] 2xl:h-[400px] /* ≥1536px */
                            "/>
                        <span className="absolute bottom-2 italic w-80 text-blue-950 text-center group-hover:text-white">Clique no cartão para ser direcionado ao gerenciamento de blocos</span>
                    </div>
                </Link>
                <Link href={'/gerenciamento/espacos/salas'} className="
                    w-[340px] h-[400px]        /* base → mobile */
                    sm:w-[360px] sm:h-[420px]  /* ≥640px */
                    md:w-[380px] md:h-[460px]  /* ≥768px */
                    lg:w-[400px] lg:h-[500px]  /* ≥1024px */
                    xl:w-[420px] xl:h-[540px]  /* ≥1280px (23–24” monitor padrão) */
                    2xl:w-[440px] 2xl:h-[560px] /* ≥1536px */
                ">
                    <div
                        className="relative flex flex-col items-center justify-center w-full h-full border-6 rounded-lg border-blue-950 group hover:bg-blue-950 hover:cursor-pointer hover:scale-105 transition-all transform duration-500"
                        >
                        <h1 className="font-poppins absolute group-hover:text-white top-2 text-6xl font-bold text-blue-950 transition duration-500">SALAS</h1>
                        <SiGoogleclassroom className="text-blue-950 group-hover:text-white transition duration-500
                            w-[140px] h-[200px]        /* base → mobile */
                            sm:w-[160px] sm:h-[240px]  /* ≥640px */
                            md:w-[180px] md:h-[280px]  /* ≥768px */
                            lg:w-[200px] lg:h-[320px]  /* ≥1024px */
                            xl:w-[220px] xl:h-[360px]  /* ≥1280px (23–24” monitor padrão) */
                            2xl:w-[240px] 2xl:h-[400px] /* ≥1536px */
                            "/>
                        <span className="absolute bottom-2 italic w-80 text-blue-950 text-center group-hover:text-white">Clique no cartão para ser direcionado ao gerenciamento de salas</span>
                    </div>
                </Link>
            </div>
        </div>
    )
}