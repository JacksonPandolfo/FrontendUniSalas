'use client'

import { getBlocosSetor } from "@/lib/api/blocos/api"
import { getSalaById, updateSalaById } from "@/lib/api/salas/api"
import { getSetores } from "@/lib/api/setores/api"
import { BlocoAdmin } from "@/types/bloco"
import { Equipamento, Mobiliario, SalaAdmin, UpdateSala } from "@/types/sala"
import { SetorAdmin } from "@/types/setor"
import { statusSalaMap } from "@/utils/statusSalaMap"
import { tipoEquipamentoMap, tipoEquipamentoReverseMap } from "@/utils/tipoEquipamentoMap"
import { tipoMobiliarioMap, tipoMobiliarioReverseMap } from "@/utils/tipoMobiliarioMap"
import Link from "next/link"
import React, { useEffect } from "react"
import { useState } from "react"
import { TbCircleArrowLeftFilled } from "react-icons/tb"
import Select, { SingleValue, StylesConfig } from 'react-select'

export default function GerenciamentoSala({ params }: { params: Promise<{ salaId: string }> }){
    const resolvedParams = React.use(params)
    const salaId = resolvedParams.salaId
    const [sala, setSala] = useState<SalaAdmin>()
    const [loadingSala, setLoadingSala] = useState(false)
    const [erroBuscarSala, setErroBuscarSala] = useState(false)
    const [mensagemErroBuscarSala, setMensagemErroBuscarSala] = useState("")
    const [erroAtualizarSala, setErroAtualizarSala] = useState(false)
    const [mensagemErroAtualizarSala, setMensagemErroAtualizarSala] = useState("")
    const [isSalaAtualizada, setIsSalaAtualizada] = useState(false)

    const [setores, setSetores] = useState<SetorAdmin[]>([])
    const [blocos, setBlocos] = useState<BlocoAdmin[]>([])

    const [novoSetor, setNovoSetor] = useState<string | undefined>(sala?.bloco.setor.nome)
    const [novoBloco, setNovoBloco] = useState<number | undefined>(sala?.bloco.numero)
    const [novoNumeroSala, setNovoNumeroSala] = useState<number | undefined>(sala?.numero)
    const [novaCapacidade, setNovaCapacidade] = useState<number | undefined>(sala?.capacidade)
    const [temAcessibilidade, setTemAcessibilidade] = useState<boolean | undefined>(sala?.temAcessibilidade)
    const [novoEquipamento, setNovoEquipamento] = useState<Equipamento[]>([])
    const [novoMobiliario, setNovoMobiliario] = useState<Mobiliario[]>([])
    const [novoStatusSala, setNovoStatusSala] = useState<SalaAdmin["statusSala"]>()

    useEffect(() => {
      if (sala?.bloco?.setor) {
        const equipamentos = sala.Equipamentos.map(e => Equipamento[e.tipoEquipamento as unknown as keyof typeof Equipamento])
        const mobiliarios = sala.Mobiliarios.map(m => Mobiliario[m.tipoMobiliario as unknown as keyof typeof Mobiliario])
        setNovoSetor(sala.bloco.setor.nome)
        setNovoBloco(sala.bloco.numero)
        setNovoNumeroSala(sala.numero)
        setNovaCapacidade(sala.capacidade)
        setNovoStatusSala(sala.statusSala)
        setTemAcessibilidade(sala.temAcessibilidade)
        setNovoEquipamento(equipamentos)
        setNovoMobiliario(mobiliarios)
      }
}, [sala])

    useEffect(() => {
      if(salaId){
        setLoadingSala(true)
        buscarSalaByID(salaId)
      }
    }, [salaId])

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
          // setErroSetores(true)
          // setMensagemErroSetores("Não foi possível carregar os setores para o filtro")
        }
      }

      useEffect(() => {
        if(novoSetor && setores){
          const setor = setores.find((s) => s.nome === novoSetor)
          if(setor){
            carregarBlocos(setor.id)
          }
        }
      }, [novoSetor, setores])

      async function carregarBlocos(setorId: string) {
        try {
          const blocos = await getBlocosSetor(setorId)
          setBlocos(blocos)
        } catch (err) {
          const mensagem = err instanceof Error ? err.message : String(err);
          console.error("Erro ao buscar setor:", mensagem);
          // setErroBlocos(true)
          // setMensagemErroBlocos("Não foi possível carregar os blocos para o filtro")
        }
      }


    async function buscarSalaByID(salaId: string){
        await getSalaById(salaId)
        .then(setSala)
        .catch((err) => {
            const mensagem = err instanceof Error ? err.message : String(err);
            setErroBuscarSala(true);
            setMensagemErroBuscarSala(mensagem);
        })
        .finally(() => setLoadingSala(false))
    }

    function arraysIguais<T>(a: T[], b: T[]){
      if(a.length !== b.length) return false
      const ordenadoA = [...a].sort()
      const ordenadoB = [...b].sort()
      return ordenadoA.every((val, idx) => val === ordenadoB[idx])
    }

    async function salvarAlteracoes(){
      setMensagemErroAtualizarSala("")
        let permiteAtualizar = true
        let equipamentoAtualizacao: string[]
        let mobiliarioAtualizacao: string[]
        let blocoAtualizacao: string
        setErroAtualizarSala(false)
        setIsSalaAtualizada(false)

        if(!sala) return

        const equipamentos = sala.Equipamentos.map(e => Equipamento[e.tipoEquipamento as unknown as keyof typeof Equipamento])
        const mobiliarios = sala.Mobiliarios.map(m => Mobiliario[m.tipoMobiliario as unknown as keyof typeof Mobiliario])

        if(novoSetor === sala.bloco.setor.nome && novoBloco === sala.bloco.numero && novoNumeroSala === sala.numero
            && novaCapacidade === sala.capacidade && temAcessibilidade === sala.temAcessibilidade
            && novoStatusSala === sala.statusSala
            && arraysIguais(novoEquipamento, equipamentos)
            && arraysIguais(novoMobiliario, mobiliarios)

          ){
            setErroAtualizarSala(true)
            setMensagemErroAtualizarSala("Nenhuma alteração foi feita")
            setTimeout(() => setErroAtualizarSala(false), 3000)
            permiteAtualizar = false
            return
        }

        if(novoSetor === undefined || novoBloco === undefined || novoNumeroSala === undefined
            || novaCapacidade === undefined || temAcessibilidade === undefined || novoStatusSala === undefined
          ){
            setErroAtualizarSala(true)
            setMensagemErroAtualizarSala("Os valores não podem ser vazios")
            setTimeout(() => setErroAtualizarSala(false), 3000)
            permiteAtualizar = false
            return
          }

        if(novaCapacidade === 0){
          setErroAtualizarSala(true)
          setMensagemErroAtualizarSala("A capacidade não pode ser 0")
          setTimeout(() => setErroAtualizarSala(false), 3000)
          permiteAtualizar = false
          return
        }

        if(novoNumeroSala === 0){
          setErroAtualizarSala(true)
          setMensagemErroAtualizarSala("A sala não pode ser 0")
          setTimeout(() => setErroAtualizarSala(false), 3000)
          permiteAtualizar = false
          return
        }

        if(novoEquipamento.length !== 0){
          equipamentoAtualizacao = novoEquipamento.map(e => tipoEquipamentoReverseMap[e])
        }

        if(novoMobiliario.length !== 0){
          mobiliarioAtualizacao = novoMobiliario.map(m => tipoMobiliarioReverseMap[m])
        }

        if(novoSetor){
          const setorDaSala = setores.find(s => s.nome === novoSetor)
          const mesmoSetor = (setorDaSala?.id === sala.bloco.setor.id)

          if(setorDaSala){
            const blocoDaSala = blocos.find(b => b.numero === novoBloco)
            const mesmoBloco = (blocoDaSala?.id === sala.bloco.id)

            if(blocoDaSala){
              blocoAtualizacao = blocoDaSala.id
              const numeroSala = blocoDaSala.salas.find(s => s.numero === novoNumeroSala)
              const mesmaSala = (numeroSala?.id === sala.id)
              const proximaSalaDisponivel = Math.max(...blocoDaSala.salas.map(s => s.numero)) + 1

              if(numeroSala && ((mesmoSetor && mesmoBloco && !mesmaSala) || (!mesmoSetor && !mesmoBloco) || (!mesmoSetor && mesmoBloco) || (mesmoSetor && !mesmoBloco))){
                setErroAtualizarSala(true)
                setMensagemErroAtualizarSala(`Essa sala já existe em ${setorDaSala.nome}${String(blocoDaSala.numero).padStart(2, "0")}, a próxima sala disponivel nesse local é ${proximaSalaDisponivel}`)
                setTimeout(() => setErroAtualizarSala(false), 3000)
                permiteAtualizar = false
                return
              }
            } else{
              setErroAtualizarSala(true)
              setMensagemErroAtualizarSala("Bloco não existente, por favor selecione uma das opções disponíveis")
              setTimeout(() => setErroAtualizarSala(false), 3000)
              permiteAtualizar = false
              return
            }
          } else{
            setErroAtualizarSala(true)
            setMensagemErroAtualizarSala("Setor não existente, por favor selecione uma das opções disponíveis")
            setTimeout(() => setErroAtualizarSala(false), 3000)
            permiteAtualizar = false
            return
          }
        }


        if(permiteAtualizar){
          const dataUpdateSala: UpdateSala = {
            numero: novoNumeroSala,
            temAcessibilidade: temAcessibilidade,
            capacidade: novaCapacidade,
            blocoId: blocoAtualizacao!,
            statusSala: novoStatusSala!,
            Equipamentos: equipamentoAtualizacao!,
            Mobiliarios: mobiliarioAtualizacao!,
          }
          try {
                const salaAtualizada = await updateSalaById(salaId, dataUpdateSala)
                const setSalaAtualizada = await getSalaById(salaAtualizada.id)
                setSala(setSalaAtualizada)
                setIsSalaAtualizada(true)
                setTimeout(() => setIsSalaAtualizada(false), 3000)
            } catch (err) {
                const mensagem = err instanceof Error ? err.message : String(err);
                console.error("Erro ao atualizar o setor:", mensagem);
                setErroAtualizarSala(true)
                setMensagemErroAtualizarSala("Erro ao atualizar o bloco")
                setTimeout(() => setErroAtualizarSala(false), 3000)
            }
        }
    }

    type OptionTypeStatusSala = {
      value: SalaAdmin["statusSala"],
      label: string
    }

    type OptionTypeEquipamentos = {
        value: Equipamento;
        label: string;
    };

    type OptionTypeMobiliarios = {
        value: Mobiliario;
        label: string;
    };

    type OptionTypeSetoresBlocos = {
        value: string;
        label: number | string;
    };

    const optionsSetores: OptionTypeSetoresBlocos[] = setores
      .sort((a, b) => a.nome.localeCompare(b.nome))
      .map(s => ({
        value: s.id,
        label: s.nome
      })
    )

    const optionsBlocos: OptionTypeSetoresBlocos[] = blocos
    .sort((a, b) => {
        if(a.numero < b.numero) return -1
        if(a.numero > b.numero) return 1
        return 0
      })
    .map(b => ({
      value: b.id,
      label: String(b.numero).padStart(2, "0")
    }))

    const optionsStatusSala: OptionTypeStatusSala[] = [
      {value: "LIVRE", label: "Livre"},
      {value: "OCUPADA", label: "Ocupada"},
      {value: "MANUTENCAO", label: "Manutenção"},
      {value: "DESATIVADA", label: "Desativada"}
    ]

    const optionsEquipamentos: OptionTypeEquipamentos[] = [
        { value: Equipamento.CAIXASOM, label: 'Caixa de som' },
        { value: Equipamento.COMPUTADOR, label: 'Computador' },
        { value: Equipamento.MICROFONE, label: 'Microfone' },
        { value: Equipamento.PROJETOR, label: 'Projetor' },
        { value: Equipamento.WEBCAM, label: 'Webcam' },
    ];

    const optionsMobiliarios: OptionTypeMobiliarios[] = [
        { value: Mobiliario.CADEIRABRACO, label: 'Cadeira com braço' },
        { value: Mobiliario.MESADESENHO, label: 'Mesa de desenho' },
        { value: Mobiliario.MESAREUNIAO, label: 'Mesa de reunião' },
        { value: Mobiliario.MOBILIARIOMOVEL, label: 'Mobiliário móvel' },
    ];

    const customStylesEquipamento: StylesConfig<OptionTypeEquipamentos, true> = {
        control: (provided) => ({
          ...provided,
          borderRadius: '8px',
          borderColor: '#99a1af',
          minWidth: '220px',
          maxWidth: '340px',
          flexWrap: 'wrap',
          padding: '2px',
          boxShadow: 'none',
          color: '#162456',
          cursor: 'pointer',
          height: 'auto',
          minHeight: "90px",
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

    const customStylesMobiliario: StylesConfig<OptionTypeMobiliarios, true> = {
      control: (provided) => ({
        ...provided,
        borderRadius: '8px',
        borderColor: '#99a1af',
        minWidth: '220px',
        maxWidth: '340px',
        flexWrap: 'wrap',
        padding: '2px',
        boxShadow: 'none',
        color: '#162456',
        cursor: 'pointer',
        height: "auto",
        minHeight: "90px",
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

    const customStyles: StylesConfig<OptionTypeSetoresBlocos, false> = {
      control: (provided) => ({
        ...provided,
        borderRadius: '8px',
        borderColor: '#99a1af',
        // minWidth: '220px',
        maxWidth: '120px',
        flexWrap: 'wrap',
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

    const customStylesStatus: StylesConfig<OptionTypeStatusSala, false> = {
      control: (provided) => ({
        ...provided,
        borderRadius: '8px',
        borderColor: '#99a1af',
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
      <div className="relative flex flex-col gap-4 items-center justify-center w-full px-4 py-8">
            {loadingSala ? (
              <div className="flex justify-center items-center">
                    <p className="mt-6 text-gray-600">{"Carregando...".split("").map((char, i) => (
                      <span key={i} className="inline-block animate-bounce">{char}</span>
                    ))}
                    </p>
                </div>
                ) : erroBuscarSala ? (
                    <div className="flex justify-center items-center">
                        <p className="mt-6 text-gray-600">{mensagemErroBuscarSala}</p>
                    </div>
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
                        <div className="flex gap-2 items-center justify-center pt-2 px-4 mt-">
                            <div className="flex flex-col border-2 border-blue-950 p-4 rounded-lg bg-gray-100 gap-4 h-full max-w-[375px] w-[375px]">
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
                                      <div className="relative">
                                        <input
                                          type="number"
                                          min={0}
                                          value={sala.capacidade}
                                          readOnly
                                          className="w-28 border rounded p-2 bg-gray-200"
                                        />
                                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-700 text-sm">
                                          Vagas
                                        </span>
                                      </div>
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
                                      <label className="block font-semibold mb-1">Estado da sala</label>
                                      <div className="relative">
                                        <input
                                          type="text"
                                          min={0}
                                          value={statusSalaMap[sala.statusSala]}
                                          readOnly
                                          className="w-full border rounded p-2 bg-gray-200"
                                        />
                                      </div>
                                  </div>
                                <div className="min-w-[220px] max-w-[340px]">
                                  <label className="block font-semibold mb-3">Equipamentos</label>
                                  <textarea
                                    readOnly
                                    value={sala.Equipamentos.map(e => tipoEquipamentoMap[e.tipoEquipamento]).join(", ")}
                                    className="w-full border rounded-md p-2 bg-gray-100 text-gray-800 resize-none"
                                    rows={3} // ajusta a altura inicial
                                  />
                                </div>
                                <div className="min-w-[220px] max-w-[340px]">
                                  <label className="block font-semibold mb-3">Mobiliários</label>
                                  <textarea
                                    readOnly
                                    value={sala.Mobiliarios.map(e => tipoMobiliarioMap[e.tipoMobiliario]).join(", ")}
                                    className="w-full border rounded-md p-2 bg-gray-100 text-gray-800 resize-none"
                                    rows={3} // ajusta a altura inicial
                                  />
                                </div>
                            </div>
                            <div className="flex flex-col border-2 border-blue-950 p-4 rounded-lg bg-gray-100 gap-4 h-full">
                              <p className="text-center font-bold text-blue-950">Dados para atualizar</p>
                              <div className="flex gap-2">
                                  <div className="flex flex-col w-fit">
                                    <label className="font-semibold mb-1">Setor</label>
                                    <Select
                                      styles={customStyles}
                                      options={optionsSetores}
                                      required
                                      onChange={(selected) => setNovoSetor(selected ? String(selected.label) : "")}
                                      value={novoSetor !== undefined ? optionsSetores.find(o => o.label === novoSetor) || null : null}
                                      placeholder="Setor"
                                    />
                                  </div>
                                  <div className="flex flex-col w-fit">
                                    <label className="font-semibold mb-1">Bloco</label>
                                    <Select
                                      styles={customStyles}
                                      options={optionsBlocos}
                                      required
                                      onChange={(selected: SingleValue<OptionTypeSetoresBlocos>) => setNovoBloco(selected ? Number(selected.label) : 0)}
                                      value={novoBloco ? optionsBlocos.find(o => o.label === String(novoBloco).padStart(2, "0")) || null : null}
                                      placeholder="Setor"
                                    />
                                  </div>
                                  <div className="flex flex-col w-fit">
                                    <label className="font-semibold mb-1">Sala</label>
                                    <input
                                      type="number"
                                      min={0}
                                      value={novoNumeroSala === undefined ? sala.numero : novoNumeroSala}
                                      onChange={(e) => setNovoNumeroSala(e.target.value ? Number(e.target.value) : sala.numero)}
                                      className="w-20 border rounded p-2 bg-white"
                                      />
                                  </div>
                                </div>
                                <div className="flex gap-4">
                                  <div className="flex flex-col w-fit">
                                      <label className="block font-semibold mb-1">Capacidade</label>
                                      <div className="relative">
                                        <input
                                          type="number"
                                          min={0}
                                          value={novaCapacidade === undefined ? sala.capacidade : novaCapacidade}
                                          onChange={(e) => setNovaCapacidade(e.target.value ? Number(e.target.value) : sala.capacidade)}
                                          className="w-28 border rounded p-2 bg-white"
                                        />
                                        <span className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-700 text-sm">
                                          Vagas
                                        </span>
                                      </div>
                                  </div>
                                  <div className="flex flex-col w-fit">
                                      <label className="block font-semibold mb-3">Acessibilidade</label>
                                      <div className="flex gap-2 items-center">
                                          <input
                                              type="checkbox"
                                              checked={temAcessibilidade === undefined ? sala.temAcessibilidade : temAcessibilidade}
                                              onChange={(e) => setTemAcessibilidade(e.target.checked)}
                                              className="w-5 h-5 border rounded p-2"
                                              />
                                          <span>
                                              {(temAcessibilidade === undefined
                                                ? sala.temAcessibilidade
                                                : temAcessibilidade)
                                                ? "Com acessibilidade"
                                                : "Sem acessibilidade"}
                                          </span>
                                      </div>
                                  </div>
                                </div>
                                <div>
                                  <label className="block font-semibold mb-1">Estado da sala</label>
                                  <Select
                                      styles={customStylesStatus}
                                      options={optionsStatusSala}
                                      required
                                      onChange={(selected) => setNovoStatusSala(selected?.value)}
                                      value={optionsStatusSala.find(opt => opt.value === (novoStatusSala ?? sala.statusSala))}
                                      placeholder="Selecione o status da sala"
                                    />
                                </div>
                                <div className="min-w-[220px] max-w-[340px] pb-1.5">
                                  <label className="block font-semibold mb-3">Equipamentos</label>
                                  <Select
                                      styles={customStylesEquipamento}
                                      options={optionsEquipamentos}
                                      isMulti
                                      required
                                      onChange={(selected) => setNovoEquipamento(selected.map((s) => s.value))}
                                      value={optionsEquipamentos.filter(opt => novoEquipamento.includes(opt.value))}
                                      placeholder="Selecione os equipamentos"
                                    />
                                </div>
                                <div className="min-w-[220px] max-w-[340px]">
                                  <label className="block font-semibold mb-3">Mobiliários</label>
                                  <Select
                                      styles={customStylesMobiliario}
                                      options={optionsMobiliarios}
                                      isMulti
                                      required
                                      onChange={(selected) => setNovoMobiliario(selected.map((s) => s.value))}
                                      value={optionsMobiliarios.filter(opt => novoMobiliario.includes(opt.value))}
                                      placeholder="Selecione os mobiliários"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2 items-center justify-center">
                          <button
                            onClick={salvarAlteracoes}
                            className="bg-blue-700 font-poppins text-white px-4 py-2 rounded-lg hover:bg-blue-950 hover:cursor-pointer transition duration-300"
                          >
                            Salvar alterações
                          </button>
                          {erroAtualizarSala && (
                            <div className="absolute top-2 right-2 bg-red-400 font-bold text-white text-center p-3 rounded-lg shadow-lg z-50">
                              <p>{mensagemErroAtualizarSala}</p>
                            </div>
                          )}
                          {isSalaAtualizada && (
                            <div className="absolute top-2 right-2 bg-green-400 font-bold text-white text-center p-3 rounded-lg shadow-lg z-50">
                              <p>✅ Dados salvos com sucesso!</p>
                            </div>
                          )}
                        </div>
                  </>
              )}
        </div>
    )
}