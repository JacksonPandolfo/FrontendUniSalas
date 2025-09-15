import { SalaAdmin } from "@/types/sala"
import { tipoEquipamentoMap } from "@/utils/tipoEquipamentoMap"
import { tipoMobiliarioMap } from "@/utils/tipoMobiliarioMap"
import { BsWebcamFill } from "react-icons/bs"
import { FaComputer, FaPeopleLine } from "react-icons/fa6"
import { FcFilingCabinet } from "react-icons/fc"
import { GiEasel } from "react-icons/gi"
import { LuProjector } from "react-icons/lu"
import { MdSpeaker } from "react-icons/md"
import { PiOfficeChairFill } from "react-icons/pi"
import { TbMicrophoneFilled } from "react-icons/tb"

type PropsDetalhesSala = {
    equipamentos: SalaAdmin["Equipamentos"]
    mobiliarios: SalaAdmin["Mobiliarios"]
}

const renderizaComponente = (item: string) => {
    switch (item) {
        case "MESADESENHO":
            return <GiEasel className="text-orange-400" size={24}/>
            case "CADEIRABRACO":
                return <PiOfficeChairFill className="text-orange-400" size={24}/>
                case "MESAREUNIAO":
                    return <FaPeopleLine className="text-orange-400" size={24}/>
                    case "MOBILIARIOMOVEL":
                        return <FcFilingCabinet className="text-orange-400" size={24}/>
                        case "CAIXASOM":
                            return <MdSpeaker className="text-orange-400" size={24}/>
                            case "PROJETOR":
                                return <LuProjector className="text-orange-400" size={24}/>
                                case "COMPUTADOR":
                                    return <FaComputer className="text-orange-400" size={24}/>
                                    case "MICROFONE":
                                        return <TbMicrophoneFilled className="text-orange-400" size={24}/>
                                        case "WEBCAM":
                                            return <BsWebcamFill className="text-orange-400" size={24}/>
        default:
            break;
    }
}

export function CartaoDetalhe({equipamentos, mobiliarios}: PropsDetalhesSala) {
    return (
        <div className="flex flex-col border-2 rounded-lg p-2 w-70 h-full border-blue-950">
            <h4 className="font-poppins text-center font-bold text-blue-950">Equipamentos</h4>
            {equipamentos?.map((equipamento) => (
                <div className="flex gap-2" key={equipamento.id}>
                    {renderizaComponente(equipamento.tipoEquipamento)}
                    <p className="font-poppins">{tipoEquipamentoMap[equipamento.tipoEquipamento]}</p>
                </div>
            ))}
            <h4 className="font-poppins mt-2 text-center font-bold text-blue-950">Mobiliários</h4>
            {mobiliarios?.map((mobiliario) => (
                <div className="flex gap-2" key={mobiliario.id}>
                    {renderizaComponente(mobiliario.tipoMobiliario)}
                    <p className="font-poppins">{tipoMobiliarioMap[mobiliario.tipoMobiliario]}</p>
                </div>
            ))}
        </div>
    )
}