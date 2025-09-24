import { SetorAdmin } from "@/types/setor"
import { BsBuildings } from "react-icons/bs";
import { TbCircleLetterAFilled, TbCircleLetterBFilled, TbCircleLetterCFilled, TbCircleLetterDFilled, TbCircleLetterEFilled } from "react-icons/tb";

type PropsSetor = {
    id: SetorAdmin["id"]
    nome: SetorAdmin["nome"]
    onClick: () => void
}

export function CartaoSetor({id, nome, onClick} : PropsSetor) {

    const renderizaSetor = (nomeSetor: SetorAdmin["nome"]) => {
    switch (nomeSetor) {
      case "A":
        return <TbCircleLetterAFilled className="absolute top-2 left-2 text-blue-950 group-hover:text-white transition duration-500" size={50}/>
      case "B":
        return <TbCircleLetterBFilled className="absolute top-2 left-2 text-blue-950 group-hover:text-white transition duration-500" size={50}/>
      case "C":
        return <TbCircleLetterCFilled className="absolute top-2 left-2 text-blue-950 group-hover:text-white transition duration-500" size={50}/>
      case "D":
        return <TbCircleLetterDFilled className="absolute top-2 left-2 text-blue-950 group-hover:text-white transition duration-500" size={50}/>
      case "E":
        return <TbCircleLetterEFilled className="absolute top-2 left-2 text-blue-950 group-hover:text-white transition duration-500" size={50}/>
      default:
        break;
    }
  }

    return(
        <div
            className="relative flex items-center justify-center w-30 h-50 
          sm:w-40 sm:h-60 
          md:w-52 md:h-80 
          2xl:w-64 2xl:h-96 
          border-6 rounded-lg border-blue-950 group hover:bg-blue-950 hover:cursor-pointer hover:scale-105 transition-all transform duration-500"
            key={id}
            onClick={onClick}
            >
            {renderizaSetor(nome)}
            <BsBuildings className="text-blue-950 group-hover:text-white transition duration-500" size={200}/>
        </div>
    )
}