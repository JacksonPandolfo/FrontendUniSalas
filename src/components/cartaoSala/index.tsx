
import { SalaAdmin } from "@/types/sala";
import { TbCircleLetterAFilled, TbCircleLetterBFilled, TbCircleLetterCFilled, TbCircleLetterDFilled, TbCircleLetterEFilled } from "react-icons/tb";
import { SiGoogleclassroom } from "react-icons/si";
import { BiAccessibility } from "react-icons/bi";
import { statusSalaMap } from "@/utils/statusSalaMap";

type PropsSalas = {
    id: SalaAdmin["id"]
    numero: SalaAdmin["numero"]
    capacidade: SalaAdmin["capacidade"]
    statusSala: SalaAdmin["statusSala"]
    temAcessibilidade: SalaAdmin["temAcessibilidade"]
    numeroBloco: number
    nomeSetor: string
    selecionado?: boolean
    onClick: () => void
    exibirStatus?: boolean
    exibirAcessibilidade?: boolean
    exibirCapacidade?: boolean
}

export function CartaoSala({ id, numero, capacidade, statusSala, temAcessibilidade, numeroBloco, nomeSetor, selecionado, exibirStatus=true, exibirAcessibilidade=true, exibirCapacidade=true, onClick }: PropsSalas) {

  const renderizaBloco = ( nomeSetor: string, numeroBloco: number, numero: PropsSalas["numero"]) => {
          switch (nomeSetor) {
              case "A":
                  return <div className="flex items-center justify-start rounded-full  w-36 h-10 transition duration-500">
                              <TbCircleLetterAFilled className="-m-1 text-blue-950 group-hover:text-white transition duration-500" size={48}/>
                              <p className="font-poppins ml-1 font-bold text-2xl group-hover:text-white transition duration-500">
                                  {String(numeroBloco).padStart(2, "0")} - {String(numero).padStart(3, "0")}
                              </p>
                          </div>
              case "B":
                  return <div className="flex items-center justify-start rounded-full group-hover:bg-orange-500 w-36 h-10 transition duration-500">
                              <TbCircleLetterBFilled className="-m-1 text-blue-950 group-hover:text-white transition duration-500" size={48}/>
                              <p className="font-poppins ml-1 font-bold text-2xl group-hover:text-white transition duration-500">
                                  {String(numeroBloco).padStart(2, "0")} - {String(numero).padStart(3, "0")}
                              </p>
                          </div>
              case "C":
                  return <div className="flex items-center justify-start rounded-full group-hover:bg-orange-500 w-36 h-10 transition duration-500">
                              <TbCircleLetterCFilled className="-m-1 text-blue-950 group-hover:text-white transition duration-500" size={48}/>
                              <p className="font-poppins ml-1 font-bold text-2xl group-hover:text-white transition duration-500">
                                  {String(numeroBloco).padStart(2, "0")} - {String(numero).padStart(3, "0")}
                              </p>
                          </div>
              case "D":
                  return <div className="flex items-center justify-start rounded-full group-hover:bg-orange-500 w-36 h-10 transition duration-500">
                              <TbCircleLetterDFilled className="-m-1 text-blue-950 group-hover:text-white transition duration-500" size={48}/>
                              <p className="font-poppins ml-1 font-bold text-2xl group-hover:text-white transition duration-500">
                                  {String(numeroBloco).padStart(2, "0")} - {String(numero).padStart(3, "0")}
                              </p>
                          </div>
              case "E":
                  return  <div className="flex items-center justify-start rounded-full group-hover:bg-orange-500 w-36 h-10 transition duration-500">
                              <TbCircleLetterEFilled className="-m-1 text-blue-950 group-hover:text-white transition duration-500" size={48}/>
                              <p className="font-poppins ml-1 font-bold text-2xl group-hover:text-white transition duration-500">
                                  {String(numeroBloco).padStart(2, "0")} - {String(numero).padStart(3, "0")}
                              </p>
                          </div>
              default:
                  break;
          }
      }

  const renderizaStatusSala = (statusSala: SalaAdmin["statusSala"]) => {

    switch (statusSalaMap[statusSala]) {
      case "Livre":
        return  <div className="bg-green-500 font-poppins font-bold text-blue-950 rounded-full px-4">
                  <p>Livre</p>
                </div>
      case "Ocupada":
        return <div className="bg-red-500 font-poppins font-bold text-blue-950 rounded-full px-4">
                  <p>Ocupada</p>
                </div>
      case "Manutenção":
        return <div className="bg-yellow-500 font-poppins font-bold text-blue-950 rounded-full px-4">
                  <p>Manutenção</p>
                </div>
      case "Desativada":
        return <div className="bg-gray-300 font-poppins font-bold text-blue-950 rounded-full px-4">
                  <p>Desativada</p>
                </div>
      default:
        break;
    }
  }

    const renderizaBackgroundCartao = (statusSala: SalaAdmin["statusSala"]) => {
    switch (statusSala) {
      case "LIVRE":
        return  "bg-green-200"
      case "OCUPADA":
        return "bg-red-200"
      case "MANUTENCAO":
        return "bg-yellow-200"
      case "DESATIVADA":
        return "bg-gray-400"
      default:
        break;
    }
  }

  return (
    <div className="flex flex-col">
      <div
        className={`relative flex flex-col ${!exibirStatus && !exibirAcessibilidade && !exibirCapacidade ? "gap-12" : "justify-between" } items-center py-2 w-30 h-50
          sm:w-40 sm:h-60
          md:w-52 md:h-80
          2xl:w-64 2xl:h-96
          border-4 border-blue-950 rounded-lg ${exibirStatus && renderizaBackgroundCartao(statusSala)} ${exibirStatus && selecionado ? "scale-105" : "scale-100"} hover:scale-105 hover:cursor-pointer transition-all transform duration-500`}
          key={id}
          onClick={() => onClick()}
      >
        <h3 className="text-lg font-bold">{renderizaBloco(nomeSetor, numeroBloco, numero)}</h3>
        {exibirStatus && exibirAcessibilidade && exibirCapacidade ? (
            <SiGoogleclassroom className='text-blue-950' size={80}/>
          ) : (
            <SiGoogleclassroom className='text-blue-950' size={120}/>
          )
        }
        {exibirCapacidade &&
          <p className="font-poppins">Capacidade: {capacidade}</p>
        }
        {exibirAcessibilidade &&
          <div className="flex items-center">
            {temAcessibilidade ? (
                <BiAccessibility className='text-green-400' size={30}/>
              ) : (
                <BiAccessibility className="text-red-500" size={30}/>
            )}
            <p className="font-poppins">{temAcessibilidade ? "Com acessibilidade" : "Sem acessibilidade"}</p>
          </div>
        }
        {exibirStatus &&
          renderizaStatusSala(statusSala)
        }
      </div>
    </div>
  );
}