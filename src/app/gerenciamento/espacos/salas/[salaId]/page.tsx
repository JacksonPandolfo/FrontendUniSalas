'use client'

import { getSalaById } from "@/lib/api/salas/api"
import { Equipamento, Mobiliario, SalaAdmin } from "@/types/sala"
import { tipoEquipamentoMap } from "@/utils/tipoEquipamentoMap"
import { tipoMobiliarioMap } from "@/utils/tipoMobiliarioMap"
import Link from "next/link"
import React, { useEffect } from "react"
import { useState } from "react"
import { TbCircleArrowLeftFilled } from "react-icons/tb"
import Select, { GroupBase, OptionsOrGroups, StylesConfig } from 'react-select'

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

    type OptionTypeEquipamentos = {
        value: Equipamento;
        label: string;
    };
    
    type OptionTypeMobiliarios = {
        value: Mobiliario;
        label: string;
    };
    
    const optionsEquipamentos: OptionsOrGroups<OptionTypeEquipamentos, GroupBase<OptionTypeEquipamentos>> = [
        { value: Equipamento.CAIXASOM, label: 'Caixa de som' },
        { value: Equipamento.COMPUTADOR, label: 'Computador' },
        { value: Equipamento.MICROFONE, label: 'Microfone' },
        { value: Equipamento.PROJETOR, label: 'Projetor' },
        { value: Equipamento.WEBCAM, label: 'Webcam' },
    ];

    const optionsMobiliarios: OptionsOrGroups<OptionTypeMobiliarios, GroupBase<OptionTypeMobiliarios>> = [
        { value: Mobiliario.CADEIRABRACO, label: 'Cadeira com braço' },
        { value: Mobiliario.MESADESENHO, label: 'Mesa de desenho' },
        { value: Mobiliario.MESAREUNIAO, label: 'Mesa de reunião' },
        { value: Mobiliario.MOBILIARIOMOVEL, label: 'Mobiliário móvel' },
    ];

    const customStyles: StylesConfig<OptionTypeEquipamentos | OptionTypeMobiliarios, true> = {
        control: (provided) => ({
          ...provided,
          borderRadius: '8px',
          borderColor: '#99a1af',
          minWidth: '220px',
          padding: '2px',
          boxShadow: 'none',
          color: '#162456',
          cursor: 'pointer',
          '&:hover': { borderColor: '#162456' },
        }),
        option: (provided, state) => ({
          ...provided,
          backgroundColor: state.isSelected ? '#162456' : state.isFocused ? '#bedbff' : 'white',
          color: state.isSelected ? 'white' : 'black',
          cursor: 'pointer',
        }),
        valueContainer: (provided) => ({
          ...provided,
          display: "flex",
          flexWrap: "wrap",
          overflow: "visible",
          maxHeight: "none",
          gap: "4px",
        }),
        multiValue: (provided) => ({
          ...provided,
          backgroundColor: '#bedbff',
          borderRadius: '4px',
        }),
        multiValueLabel: (provided) => ({
          ...provided,
          color: '#162456',
          fontWeight: 500,
        }),
        placeholder: (provided) => ({
          ...provided,
          color: '#162456',
        }),
      };

    return (
      <div className="relative flex flex-col gap-4 items-center justify-center w-full">
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
                    <>
                        <h1 className="flex gap-2 absolute top-2 text-4xl font-poppins text-blue-950 font-bold">
                          Gerenciamento da sala{" "}
                          <span className="text-orange-400">
                            {sala.bloco.setor.nome +
                              String(sala?.bloco.numero).padStart(2, "0") +
                              " - " +
                              sala?.numero}
                          </span>
                        </h1>
                        <Link href={"/gerenciamento/espacos/salas"}>
                          <button className="border-2 absolute left-2 top-2 flex gap-2 items-center border-blue-950 text-blue-950 font-poppins rounded-2xl p-1 hover:cursor-pointer hover:bg-blue-950 hover:text-white hover:scale-105">
                            <TbCircleArrowLeftFilled size={30} /> Voltar para salas
                          </button>
                        </Link>
                        <div className="flex gap-2 items-center justify-center">
                            <div className="flex flex-col border-2 border-blue-950 p-4 rounded-lg bg-gray-100 gap-4">
                                <p className="text-center font-bold text-blue-950">Dados atuais</p>
                                <div className="flex gap-2">
                                  <div className="flex flex-col w-fit">
                                    <label className="font-semibold mb-1">Setor</label>
                                    <input
                                      type="text"
                                      value={sala.bloco.setor.nome}
                                      readOnly
                                      className=" w-14 border rounded p-2 bg-gray-200"
                                      />
                                  </div>
                                  <div className="flex flex-col w-fit">
                                    <label className="font-semibold mb-1">Bloco</label>
                                    <input
                                      type="number"
                                      value={String(sala.bloco.numero).padStart(2, "0")}
                                      readOnly
                                      className=" w-14 border rounded p-2 bg-gray-200"
                                      />
                                  </div>
                                  <div className="flex flex-col w-fit">
                                    <label className="font-semibold mb-1">Sala</label>
                                    <input
                                      type="number"
                                      value={sala.numero}
                                      readOnly
                                      className="w-20 border rounded p-2 bg-gray-200"
                                      />
                                  </div>
                                </div>
                                <div className="flex gap-4">
                                  <div className="flex flex-col w-fit">
                                      <label className="block font-semibold mb-1">Capacidade</label>
                                      <input
                                        type="number"
                                        min={0}
                                        value={sala.capacidade}
                                        readOnly
                                        className="w-28 border rounded p-2 bg-gray-200"
                                        />
                                  </div>
                                  <div className="flex flex-col w-fit">
                                      <label className="block font-semibold mb-3">Acessibilidade</label>
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
                                </div>
                                <div>
                                  <label className="block font-semibold mb-3">Equipamentos</label>
                                  <textarea
                                    readOnly
                                    value={sala.Equipamentos.map(e => tipoEquipamentoMap[e.tipoEquipamento]).join(", ")} 
                                    className="w-full border rounded-md p-2 bg-gray-100 text-gray-800 resize-none"
                                    rows={3} // ajusta a altura inicial
                                  />
                                </div>
                                <div>
                                  <label className="block font-semibold mb-3">Mobiliários</label>
                                  <textarea
                                    readOnly
                                    value={sala.Mobiliarios.map(e => tipoMobiliarioMap[e.tipoMobiliario]).join(", ")} 
                                    className="w-full border rounded-md p-2 bg-gray-100 text-gray-800 resize-none"
                                    rows={3} // ajusta a altura inicial
                                  />
                                </div>
                            </div>
                            <div className="flex flex-col border-2 border-blue-950 p-4 rounded-lg bg-gray-100">
                              <p className="text-center font-bold text-blue-950">Dados para atualizar</p>
                                    {/* <Select
                                      styles={customStyles}
                                      isMulti
                                      isDisabled
                                      required
                                      value={sala.Equipamentos.map(e => ({ 
                                        value: e.tipoEquipamento as Equipamento, 
                                        label: e.tipoEquipamento 
                                      }))}
                                      placeholder="Selecione um ou mais cargos"
                                    /> */}
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
                  </>
              )}
        </div>
    )
}