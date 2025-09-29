'use client'

import { CartaoSala } from "@/components/cartaoSala"
import { getBlocosSetor } from "@/lib/api/blocos/api"
import { getSalasBloco } from "@/lib/api/salas/api"
import { getSetores } from "@/lib/api/setores/api"
import { BlocoAdmin } from "@/types/bloco"
import { SalaAdmin } from "@/types/sala"
import { SetorAdmin } from "@/types/setor"
import Link from "next/link"
import { useEffect, useState } from "react"
import { BsGear } from "react-icons/bs"
import { TbCircleArrowLeftFilled, TbArrowAutofitUp, TbArrowAutofitDown } from "react-icons/tb"

export default function Salas(){
    const [loadingSalas, setLoadingSalas] = useState(false)
    const [setorSelecionado, setSetorSelecionado] = useState<string | null>(null)
    const [blocoSelecionado, setBlocoSelecionado] = useState<string | null>(null)
    const [salaSelecionada, setSalaSelecionada] = useState("")
    const [openSelectSetor, setSelectSetor] = useState(false)
    const [openSelectBloco, setSelectBloco] = useState(false)

    const [erroSetores, setErroSetores] = useState(false)
    const [erroBlocos, setErroBlocos] = useState(false)
    const [erroSalas, setErroSalas] = useState(false)
    const [mensagemErroSetores, setMensagemErroSetores] = useState("")
    const [mensagemErroBlocos, setMensagemErroBlocos] = useState("")
    const [mensagemErroSalas, setMensagemErroSalas] = useState("")

    const [setores, setSetores] = useState<SetorAdmin[]>([])
    const [blocos, setBlocos] = useState<BlocoAdmin[]>([])
    const [salas, setSalas] = useState<SalaAdmin[]>([])

    useEffect(() => {
        carregarSetores()
    }, [])

    async function carregarSetores() {
        try {
          const setores = await getSetores()
          setSetores(setores)
        } catch (err) {
          const mensagem = err instanceof Error ? err.message : String(err);
            console.error("Erro ao buscar setor:", mensagem);
            setErroSetores(true)
            setMensagemErroSetores("Não foi possível carregar os setores para o filtro")
        }
    }

    useEffect(() => {
        if(setorSelecionado !== null){
          carregarBlocos(setorSelecionado)
        }
      }, [setorSelecionado])

      async function carregarBlocos(setorId: string) {
        try {
          const blocos = await getBlocosSetor(setorId)
          setBlocos(blocos)
        } catch (err) {
          const mensagem = err instanceof Error ? err.message : String(err);
            console.error("Erro ao buscar setor:", mensagem);
            setErroBlocos(true)
            setMensagemErroBlocos("Não foi possível carregar os blocos para o filtro")
        }
      }

    function handleFilterClick(blocoId: string){
        if(blocoSelecionado !== null && blocoSelecionado === blocoId){
            carregarSalasByBloco(blocoId)
        }
    }

    async function carregarSalasByBloco(idBloco: string) {
        await getSalasBloco(idBloco)
        .then(setSalas)
        .catch((err) => {
            const mensagem = err instanceof Error ? err.message : String(err);
            console.error("Erro ao buscar setor:", mensagem);
            setErroSalas(true)
            setMensagemErroSalas("Não foi possível carregar as slas")
        })
        .finally(() => setLoadingSalas(false))
      }

    const handleSetorChange = (setorId: string) => {
        if(setorId !== "Setor"){
            setSetorSelecionado(setorId)
        } else{
            setSetorSelecionado(null)
        }
    };

    const handleBlocoChange = (blocoId: string) => {
      if(blocoId !== "Bloco"){
        setBlocoSelecionado(blocoId)
      } else {
        setBlocoSelecionado(null)
      }
    };


    function renderBotoes(salaId?: string) {
        return (
            <div className="absolute bottom-3 mt-2 flex flex-col gap-2">
            <Link href={`/gerenciamento/espacos/salas/${salaId}`} className="flex items-center gap-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                <BsGear/>Gerenciar
            </Link>
        </div>
        );
    }

    return (
        <>
            {loadingSalas ? (
                <div className="flex justify-center items-center">
                    <p className="mt-6 text-gray-600">{"Carregando...".split(" ").map((char, i) => (
                        <span key={i} className="inline-block animate-bounce">{char}</span>
                    ))}
                    </p>
                </div>
                ) : erroSalas ? (
                    <div className="flex justify-center items-center">
                        <p className="mt-6 text-gray-600">{mensagemErroSalas}</p>
                    </div>
                ) : erroSetores ? (
                    <div className="flex justify-center items-center">
                        <p className="mt-6 text-gray-600">{mensagemErroSetores}</p>
                    </div>
                ) : erroBlocos ? (
                    <div className="flex justify-center items-center">
                        <p className="mt-6 text-gray-600">{mensagemErroBlocos}</p>
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
                                <h1 className="text-4xl font-poppins text-blue-950 font-bold">Gerenciamento de salas</h1>
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
                                <div className="relative">
                                    <button className="flex items-center justify-between border rounded font-poppins font-bold text-blue-950 p-1 pl-2 w-20 text-left hover:cursor-pointer"
                                            onClick={() => setSelectBloco(!openSelectBloco)}
                                    >
                                      {blocoSelecionado ? String(blocos.find(b => b.id === blocoSelecionado)?.numero).padStart(2, "0") : "Bloco" }
                                      {openSelectBloco ? <TbArrowAutofitUp /> : <TbArrowAutofitDown />}
                                    </button>
                                    <div className={`absolute z-50 bg-white border rounded mt-1 max-h-60 overflow-y-auto w-20 ${openSelectBloco ? "" : "hidden"}`}>
                                      <div className="cursor-pointer font-poppins p-1 hover:bg-blue-950 hover:text-white font-bold text-blue-950 text-center"
                                            onClick={() => handleBlocoChange("Bloco")}>
                                        Bloco
                                      </div>
                                      {blocos
                                        .sort((a, b) => {
                                              if(a.numero < b.numero) return -1
                                              if(a.numero > b.numero) return 1
                                              return 0
                                            })
                                        .map((bloco) => (
                                          <div
                                            key={bloco.id}
                                            onClick={() => {
                                              handleBlocoChange(bloco.id)
                                              setSelectBloco(false)
                                            }}
                                            className="cursor-pointer font-poppins p-1 hover:bg-blue-950 hover:text-white font-bold text-blue-950 text-center"
                                          >
                                            {String(bloco.numero).padStart(2, "0")}
                                          </div>
                                        ))}
                                    </div>
                                </div>
                                <button className={`flex items-center gap-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:cursor-pointer transition`}
                                        onClick={() => {
                                            if (blocoSelecionado) handleFilterClick(blocoSelecionado);
                                        }}>
                                            Buscar salas
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-wrap justify-center gap-2 mt-4">
                            {salas
                              .filter((sala) => sala.blocoId === blocoSelecionado)
                              .map((sala) => {
                                const bloco = blocos.find((bloco) => bloco.id === sala.blocoId);
                                const setor = setores.find((setor) => setor.id === bloco?.setorId)
                                return(
                                    <div key={sala.id} className="relative flex flex-col gap-2 items-center">
                                        <CartaoSala
                                            key={sala.id}
                                            {...sala}
                                            numeroBloco={bloco?.numero ?? 0}
                                            nomeSetor={setor?.nome ?? ""}
                                            exibirAcessibilidade={false}
                                            exibirCapacidade={false}
                                            exibirStatus={false}
                                            onClick={() => setSalaSelecionada(salaSelecionada === sala.id ? "" : sala.id)}
                                            />
                                        {salaSelecionada === sala.id && renderBotoes(sala.id)}
                                  </div>
                                )
                                })}
                            </div>
                    </div>
                )}
        </>
    )
}