
import { SalaAdmin } from "@/types/sala";

type PropsSalas = {
    id: SalaAdmin["id"]
    numero: SalaAdmin["numero"]
    capacidade: SalaAdmin["capacidade"]
    statusSala: SalaAdmin["statusSala"]
    temAcessibilidade: SalaAdmin["temAcessibilidade"]
    blocoId: SalaAdmin["blocoId"]
}

export function CartaoSala({ id, numero, capacidade, statusSala, temAcessibilidade }: PropsSalas) {

  const renderizaStatusSala = (statusSala: SalaAdmin["statusSala"]) => {
    switch (statusSala) {
      case "Livre":
        return  <div className="bg-green-400">
                  <p>Livre</p>
                </div>
      case "Ocupada":
        return <div className="bg-red-400">
                  <p>Ocupada</p>
                </div>
      case "Manutencao":
        return <div className="bg-yellow-400">
                  <p>Manutenção</p>
                </div>
      case "Desativada":
        return <div className="bg-gray-300">
                  <p>Desativada</p>
                </div>
      default:
        break;
    }
  }
  return (
    <div
      className="relative flex items-center justify-center w-50 h-80 border-6 rounded-lg border-blue-950 group hover:bg-blue-950 hover:cursor-pointer hover:scale-105 transition-all transform duration-500"
        key={id}
        >
      <h3 className="text-lg font-bold">{numero}</h3>
      <p>{capacidade}</p>
      {temAcessibilidade ? "Com acessibilidade" : "Sem acessibilidade"

      }
      {renderizaStatusSala(statusSala)}
    </div>
  );
}