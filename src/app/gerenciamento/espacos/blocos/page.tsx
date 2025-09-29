'use client'
import { CartaoBloco } from "@/components/cartaoBloco";
import { getBlocosSetor } from "@/lib/api/blocos/api";
import { getSetores } from "@/lib/api/setores/api";
import { BlocoAdmin } from "@/types/bloco";
import { SetorAdmin } from "@/types/setor";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BsGear } from "react-icons/bs";
import { TbArrowAutofitDown, TbArrowAutofitUp, TbCircleArrowLeftFilled } from "react-icons/tb";

export default function Blocos(){
    const [loadingBlocos, setLoadingBlocos] = useState(false);
    const [blocosAdmin, setBlocosAdmin] = useState<BlocoAdmin[]>([]);
    const [setores, setSetores] = useState<SetorAdmin[]>([])
    const [erroSetor, setErroSetor] = useState("")
    const [idBlocoSelecionado, setIdBlocoSelecionado] = useState<string>("")
    const [setorSelecionado, setSetorSelecionado] = useState<string | null>(null)
    const [openSelectSetor, setSelectSetor] = useState(false)

    useEffect(() => {
            carregarSetores()
        }, []);

    async function carregarSetores() {
      try {
        const setores = await getSetores()
        setSetores(setores)
      } catch (err) {
        console.log(err)
      }
    }


    function renderBotoes(blocoId?: string) {
        return (
            <div className="absolute bottom-3 mt-2 flex flex-col gap-2">
            <Link href={`/gerenciamento/espacos/blocos/${blocoId}`} className="flex items-center gap-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                <BsGear/>Gerenciar
            </Link>
        </div>
        );
    }

    const handleSetorChange = (setorId: string) => {
        if(setorId !== "Setor"){
            setSetorSelecionado(setorId)
        } else{
            setSetorSelecionado(null)
        }
    };

    function handleFilterClick(idSetor: string){
        if(setorSelecionado !== null && setorSelecionado === idSetor){
            setLoadingBlocos(true)
            carregarBlocosBySetor(idSetor)
        }
    }

    async function carregarBlocosBySetor(setorId: string) {
        await getBlocosSetor(setorId)
        .then(setBlocosAdmin)
        .catch((err) => {
            console.log(err)
            setErroSetor("Não foi possível carregar os setores para o filtro")
        })
        .finally(() => setLoadingBlocos(false))
    }

    return(
        <>
            {loadingBlocos ? (
                <div className="flex items-center justify-center">
                    <p className="mt-6 text-gray-600">{"Carregando...".split(" ").map((char, i) => (
                        <span key={i} className="inline-block animate-bounce">{char}</span>
                    ))}
                    </p>
                </div>
                ) : erroSetor ? (
                    <div className="flex justify-center items-center">
                        <p className="mt-6 text-gray-600">{erroSetor}</p>
                    </div>
                ) : (
                    <div className="relative flex flex-col items-center min-h-screen pb-4 px-8 w-full">
                        <div className="flex flex-col mt-2 justify-center">
                            <div className="flex items-center justify-center gap-2">
                                <Link href={'/gerenciamento/espacos'}>
                                    <button className="border-2 absolute left-2 top-2 flex gap-2 items-center border-blue-950 text-blue-950 font-poppins rounded-2xl p-1 hover:cursor-pointer hover:bg-blue-950 hover:text-white hover:scale-105">
                                        <TbCircleArrowLeftFilled size={30}/> Voltar para espaços
                                    </button>
                                </Link>
                                <h1 className="text-4xl font-poppins text-blue-950 font-bold">Gerenciamento de blocos</h1>
                            </div>
                            <div className="flex items-center justify-center mt-2 gap-2">
                                <div className="relative">
                                    <button className="flex items-center justify-between border rounded font-poppins font-bold text-blue-950 p-1 pl-2 w-20 text-left hover:cursor-pointer"
                                            onClick={() => setSelectSetor(!openSelectSetor)}
                                            >
                                        {setorSelecionado ? setores.find(s => s.id === setorSelecionado)?.nome : "Setor" }
                                        {openSelectSetor ? <TbArrowAutofitUp /> : <TbArrowAutofitDown />}
                                    </button>
                                    <div className={`absolute z-50 bg-white border rounded mt-1 max-h-60 overflow-y-auto w-20 ${openSelectSetor ? "" : "hidden"} `}>
                                        <div className="cursor-pointer font-poppins p-1 hover:bg-blue-950 hover:text-white font-bold text-blue-950 text-center"
                                            onClick={() => {
                                                handleSetorChange("Setor")
                                                setSelectSetor(false)
                                            }}>
                                        Setor
                                        </div>
                                        {setores
                                        .sort((a, b) => a.nome.localeCompare(b.nome))
                                        .map((setor) => (
                                            <div
                                            key={setor.id}
                                            onClick={() => {
                                                handleSetorChange(setor.id)
                                                setSelectSetor(false)
                                            }}
                                            className="cursor-pointer font-poppins p-1 hover:bg-blue-950 hover:text-white font-bold text-blue-950 text-center"
                                            >
                                            {setor.nome}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <button className={`flex items-center gap-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:cursor-pointer transition`}
                                        onClick={() => {
                                            if (setorSelecionado) handleFilterClick(setorSelecionado);
                                        }}>
                                            Aplicar filtro
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-wrap justify-center gap-2 mt-4">
                        {blocosAdmin
                          .sort((x, y) => x.numero - y.numero)
                          .map((bloco) => (
                              <div key={bloco.id} className="relative flex flex-col gap-2 items-center">
                                  <CartaoBloco
                                      {...bloco}
                                      nomeSetor={setores.find((setor) => setor.id === bloco.setorId)?.nome ?? ""}
                                      numero={bloco.numero}
                                      onClick={() => setIdBlocoSelecionado(idBlocoSelecionado === bloco.id ? "" : bloco.id)}/>
                                    {idBlocoSelecionado === bloco.id && renderBotoes(bloco.id)}
                              </div>
                          ))}
                        </div>
                    </div>
                )
            }
        </>
    )
}