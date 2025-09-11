
import { SalaAdmin } from "@/types/sala";
import { TbCircleLetterAFilled, TbCircleLetterBFilled, TbCircleLetterCFilled, TbCircleLetterDFilled, TbCircleLetterEFilled } from "react-icons/tb";
import { SiGoogleclassroom } from "react-icons/si";
import { BiAccessibility } from "react-icons/bi";

type PropsSalas = {
    id: SalaAdmin["id"]
    numero: SalaAdmin["numero"]
    capacidade: SalaAdmin["capacidade"]
    statusSala: SalaAdmin["statusSala"]
    temAcessibilidade: SalaAdmin["temAcessibilidade"]
    numeroBloco: number
    nomeSetor: string
    onClick: () => void
}

export function CartaoSala({ id, numero, capacidade, statusSala, temAcessibilidade, numeroBloco, nomeSetor, onClick }: PropsSalas) {

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
    switch (statusSala) {
      case "LIVRE":
        return  <div className="bg-green-500 font-poppins font-bold text-blue-950 rounded-full px-4">
                  <p>Livre</p>
                </div>
      case "OCUPADA":
        return <div className="bg-red-500 font-poppins font-bold text-blue-950 rounded-full px-4">
                  <p>Ocupada</p>
                </div>
      case "MANUTENCAO":
        return <div className="bg-yellow-500 font-poppins font-bold text-blue-950 rounded-full px-4">
                  <p>Manutenção</p>
                </div>
      case "DESATIVADA":
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
    <div
      className={`relative flex flex-col items-center py-2 justify-between w-52 h-80 border-6 rounded-lg ${renderizaBackgroundCartao(statusSala)} hover:cursor-pointer hover:scale-105 transition-all transform duration-500`}
        key={id}
        onClick={onClick}
        >
      <h3 className="text-lg font-bold">{renderizaBloco(nomeSetor, numeroBloco, numero)}</h3>
      <SiGoogleclassroom className='text-blue-950' size={80}/>
      <p className="font-poppins">Capacidade: {capacidade}</p>
      <div className="flex items-center">
        {temAcessibilidade ? (<BiAccessibility className='text-green-400' size={30}/>) : (<BiAccessibility className="text-red-500" size={30}/>)}
        <p className="font-poppins">{temAcessibilidade ? "Com acessibilidade" : "Sem acessibilidade"}</p>
      </div>
      {renderizaStatusSala(statusSala)}
    </div>
  );
}