'use client'

import { getSalaById } from "@/lib/api/salas/api"
import { SalaAdmin } from "@/types/sala"
import Link from "next/link"
import React, { useEffect } from "react"
import { useState } from "react"
import { TbCircleArrowLeftFilled } from "react-icons/tb"

export default function GerenciamentoSala({ params }: { params: Promise<{ salaId: string }> }){
    const { salaId } = React.use(params)
    const [sala, setSala] = useState<SalaAdmin>()
    const [loadingSala, setLoadingSala] = useState(false)
    const [erroBuscarSala, setErroBuscarSala] = useState(false)
    const [mensagemErroBuscarSala, setMensagemErroBuscarSala] = useState("")
    const [erroAtualizarSala, setErroAtualizarSala] = useState(false)
    const [mensagemErroAtualizarSala, setMensagemErroAtualizarSala] = useState("")
    const [isSalaAtualizada, setIsSalaAtualizada] = useState(false)

    useEffect(() => {
        setLoadingSala(true)
        buscarSalaByID(salaId)
    }, [salaId])

    async function buscarSalaByID(salaId: string){
        getSalaById(salaId)
        .then(setSala)
        .catch((err) => {
            const mensagem = err instanceof Error ? err.message : String(err);
            setErroBuscarSala(true);
            setMensagemErroBuscarSala(mensagem);
        })
        .finally(() => setLoadingSala(false))
    }

    async function salvarAlteracoes(){
        console.log(sala?.bloco.setor.nome)
        console.log(sala?.bloco.numero)
    }

    return (
            <>
            {loadingSala ? (
                <div className="flex justify-center items-center">
                    <p className="mt-6 text-gray-600">{"Carregando...".split(" ").map((char, i) => (
                        <span key={i} className="inline-block animate-bounce">{char}</span>
                    ))}
                    </p>
                </div>
                ) : erroBuscarSala ? (
                    <div className="flex justify-center items-center">
                        <p className="mt-6 text-gray-600">{mensagemErroBuscarSala}</p>
                    </div>
                // ) : erroAtualizar ? (
                //     <div className="flex justify-center items-center">
                //         <p className="mt-6 text-gray-600">{mensagemErroAtualizar}</p>
                //     </div>
                // ) : erroBlocos ? (
                //     <div className="flex justify-center items-center">
                //         <p className="mt-6 text-gray-600">{mensagemErroBlocos}</p>
                //     </div>
                ) : sala && (
                    <div className="relative flex flex-col min-h-screen w-full px-2">
                        <div className="flex items-center justify-center gap-2 mt-2 relative">
                          <Link href={"/gerenciamento/espacos/salas"}>
                            <button className="border-2 absolute left-0 top-0 flex gap-2 items-center border-blue-950 text-blue-950 font-poppins rounded-2xl p-1 hover:cursor-pointer hover:bg-blue-950 hover:text-white hover:scale-105">
                              <TbCircleArrowLeftFilled size={30} /> Voltar para salas
                            </button>
                          </Link>
                          <h1 className="flex gap-2 text-4xl font-poppins text-blue-950 font-bold">
                            Gerenciamento da sala{" "}
                            <span className="text-orange-400">
                              {sala.bloco.setor.nome +
                                String(sala?.bloco.numero).padStart(2, "0") +
                                " - " +
                                sala?.numero}
                            </span>
                          </h1>
                        </div>
                        <div className="flex flex-1 flex-col justify-center items-center gap-6">
                            <div className="flex items-center justify-center gap-6">
                                <div className="flex flex-col border-2 border-blue-950 p-4 rounded-lg bg-gray-100 gap-4">
                                    <p className="text-center font-bold text-blue-950">Dados atuais</p>
                                    <div className="flex gap-2">
                                      <div className="flex flex-col">
                                        <label className="block font-semibold mb-1">Bloco</label>
                                        <input
                                          type="number"
                                          value={String(sala.bloco.numero).padStart(2, "0")}
                                          readOnly
                                          className="w-6/12 border rounded p-2 bg-gray-200"
                                          />
                                      </div>
                                      <div className="flex flex-col">
                                        <label className="block font-semibold mb-1">Sala</label>
                                        <input
                                          type="number"
                                          value={sala.numero}
                                          readOnly
                                          className="w-6/12 border rounded p-2 bg-gray-200"
                                          />
                                      </div>
                                    </div>
                                    <div>
                                        <label className="block font-semibold mb-1">Acessibilidade</label>
                                        <div className="flex gap-2 items-center">
                                            <input
                                                type="checkbox"
                                                checked={sala.temAcessibilidade}
                                                readOnly
                                                className="w-5 h-5 border rounded p-2 bg-gray-200"
                                                />
                                            <span>
                                                {sala.temAcessibilidade
                                                  ? "Com acessibilidade"
                                                  : "Sem acessibilidade"}
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block font-semibold mb-1">Capacidade</label>
                                        <input
                                          type="number"
                                          min={0}
                                          value={sala.capacidade}
                                          readOnly
                                          className=" border rounded p-2 bg-gray-200"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col border-2 border-blue-950 p-4 rounded-lg bg-gray-100">
                                  <p className="text-center font-bold text-blue-950">Dados para atualizar</p>
                                  <div className="mb-4">
                                    <label className="block font-semibold mb-1">Número</label>
                                    <input
                                      type="number"
                                      min={0}
                                      required
                                      onChange={(e) => {
                                        const valor = e.target.value
                                        //setNovoNumero(valor !== "" ? Number(valor) : undefined)
                                      }}
                                      className="w-full border rounded p-2"
                                    />
                                  </div>
                                </div>
                            </div>
                            <div className="flex gap-2 items-center justify-center relative">
                              <button
                                onClick={salvarAlteracoes}
                                className="bg-blue-700 font-poppins text-white px-4 py-2 rounded-lg hover:bg-blue-950 hover:cursor-pointer transition duration-300"
                              >
                                Salvar alterações
                              </button>
                              {erroAtualizarSala && (
                                <div className="absolute top-20 bg-red-400 font-bold text-white text-center p-3 rounded-lg shadow-lg z-50">
                                  <p>{mensagemErroAtualizarSala}</p>
                                </div>
                              )}
                              {isSalaAtualizada && (
                                <div className="absolute top-20 bg-green-400 font-bold text-white text-center p-3 rounded-lg shadow-lg z-50">
                                  <p>✅ Dados salvos com sucesso!</p>
                                </div>
                              )}
                            </div>
                      </div>
                  </div>
            )}
        </>
    )
}