import { BlocoAdmin } from "@/types/bloco"
import { BsBuilding } from "react-icons/bs";
import { TbCircleLetterAFilled, TbCircleLetterBFilled, TbCircleLetterCFilled, TbCircleLetterDFilled, TbCircleLetterEFilled } from "react-icons/tb";

type PropsBloco = {
    id: BlocoAdmin["id"]
    numero: BlocoAdmin["numero"]
    nomeSetor: string
    salasLivres?: number
    salasOcupadas?: number
    salasManutencao?: number
    salasDesativadas?: number
    onClick: () => void
}

export function CartaoBloco({id, numero, nomeSetor, salasLivres, salasOcupadas, salasDesativadas, salasManutencao, onClick} : PropsBloco) {

    const renderizaBloco = (numeroBloco: BlocoAdmin["numero"], nomeSetor: string) => {
        switch (nomeSetor) {
            case "A":
                return <div className="absolute top-2 left-2 flex items-center rounded-full group-hover:bg-orange-500 w-20 h-10 transition duration-500">
                            <TbCircleLetterAFilled className="absolute -left-1 text-orange-500 group-hover:text-white transition duration-500" size={48}/>
                            <p className="absolute left-12 font-poppins font-bold text-2xl group-hover:text-white transition duration-500">
                                {String(numeroBloco).padStart(2, "0")}
                            </p>
                        </div>
            case "B":
                return <div className="absolute top-2 left-2 flex items-center rounded-full group-hover:bg-orange-500 w-20 h-10 transition duration-500">
                            <TbCircleLetterBFilled className="absolute -left-1 text-orange-500 group-hover:text-white transition duration-500" size={48}/>
                            <p className="absolute left-12 font-poppins font-bold text-2xl group-hover:text-white transition duration-500">
                                {String(numeroBloco).padStart(2, "0")}
                            </p>
                        </div>
            case "C":
                return <div className="absolute top-2 left-2 flex items-center rounded-full group-hover:bg-orange-500 w-20 h-10 transition duration-500">
                            <TbCircleLetterCFilled className="absolute -left-1 text-orange-500 group-hover:text-white transition duration-500" size={48}/>
                            <p className="absolute left-12 font-poppins font-bold text-2xl group-hover:text-white transition duration-500">
                                {String(numeroBloco).padStart(2, "0")}
                            </p>
                        </div>
            case "D":
                return <div className="absolute top-2 left-2 flex items-center rounded-full group-hover:bg-orange-500 w-20 h-10 transition duration-500">
                            <TbCircleLetterDFilled className="absolute -left-1 text-orange-500 group-hover:text-white transition duration-500" size={48}/>
                            <p className="absolute left-12 font-poppins font-bold text-2xl group-hover:text-white transition duration-500">
                                {String(numeroBloco).padStart(2, "0")}
                            </p>
                        </div>
            case "E":
                return  <div className="absolute top-2 left-2 flex items-center rounded-full group-hover:bg-orange-500 w-20 h-10 transition duration-500">
                            <TbCircleLetterEFilled className="absolute -left-1 text-orange-500 group-hover:text-white transition duration-500" size={48}/>
                            <p className="absolute left-11 font-poppins font-bold text-2xl group-hover:text-white transition duration-500">
                                {String(numeroBloco).padStart(2, "0")}
                            </p>
                        </div>
            default:
                break;
        }
    }

    return(
        <div
            className="relative flex items-center justify-center w-full h-80
            sm:w-50
            md:w-56
            lg:w-62 lg:h-86
            border-6 rounded-lg border-blue-950 group hover:bg-blue-950 hover:cursor-pointer hover:scale-105 transition-all transform duration-500"
            key={id}
            onClick={onClick}
            >
            <div className="absolute bottom-2 gap-1 flex flex-row items-center justify-center">
                <div className="flex items-center justify-center rounded-full w-8 h-8 sm:w-10 sm:h-10 bg-green-400">
                    <p>{salasLivres}</p>
                </div>
                <div className="flex items-center justify-center rounded-full w-8 h-8 sm:w-10 sm:h-10 bg-red-400">
                    <p>{salasOcupadas}</p>
                </div>
                <div className="flex items-center justify-center rounded-full w-8 h-8 sm:w-10 sm:h-10 bg-yellow-400">
                    <p>{salasManutencao}</p>
                </div>
                <div className="flex items-center justify-center rounded-full w-8 h-8 sm:w-10 sm:h-10 bg-gray-400">
                    <p>{salasDesativadas}</p>
                </div>
            </div>
            {renderizaBloco(numero, nomeSetor)}
            <BsBuilding className="text-blue-950 group-hover:text-white w-44 h-64
            lg:w-52 lg:h-80
            transition duration-500"/>
        </div>
    )
}
