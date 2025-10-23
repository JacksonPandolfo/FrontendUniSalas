'use client'
import { useUser } from "@/hooks/useUser"
import { getHorarios } from "@/lib/api/horarios/api"
import { createSolicitacao } from "@/lib/api/reservas/api"
import { getSetores } from "@/lib/api/setores/api"
import { getTurmasByMinistrante } from "@/lib/api/turma/api"
import { getUsuarioMinistranteByNome, getUsuarios } from "@/lib/api/usuario/api"
import { Equipamento } from "@/types/equipamento"
import {  SolicitaReserva, statusReservaEnum, tipoEventoEnum, tipoReservaEnum } from "@/types/evento"
import { Horario } from "@/types/horario"
import { Mobiliario } from "@/types/mobiliario"
import { SetorAdmin } from "@/types/setor"
import { TurmaAdmin } from "@/types/turma"
import { Cargo, UsuarioAdmin } from "@/types/usuario"
import { statusReservaReverseMap } from "@/utils/statusReservaMap"
import { tipoEquipamentoReverseMap } from "@/utils/tipoEquipamentoMap"
import { tipoEventoReverseMap } from "@/utils/tipoEventoMap"
import { tipoMobiliarioReverseMap } from "@/utils/tipoMobiliarioMap"
import { tipoReservaReverseMap } from "@/utils/tipoReservaMap"
import { useEffect, useRef, useState } from "react"
import Select, { StylesConfig } from "react-select"
import AsyncSelect from "react-select/async"

  export function formataHorarioLocal(horario: Date) {
    const [h, m] = String(horario).slice(11, 16).split(":").map(Number);
    const horarioFormatado = String(h).padStart(2, "0") + ":" + String(m).padStart(2, "0")

    return horarioFormatado;
  }

export default function SolicitarReserva() {
  const user = useUser()
  const [nomeCompletoUsuarioLogado, setNomeCompletoUsuarioLogado] = useState<string>("")
  const [isClientReady, setIsClientReady] = useState(false)
  // SOLICITANTE
  const [solicitanteId, setSolicitanteId] = useState<string>("")
  const [emailSolicitante, setEmailSolicitante] = useState<string>("")
  const [telefoneSolicitante, setTelefoneSolicitante] = useState<string>("")

  // MINISTRANTE
  const [ministrante, setMinistrante] = useState<UsuarioOption>()
  const [ministranteId, setMinistranteId] = useState<string>("")
  const [emailMinistrante, setEmailMinistrante] = useState<string>("")
  const [telefoneMinistrante, setTelefoneMinistrante] = useState<string>("")

  //APROVADOR
  const [aprovadores, setAprovadores] = useState<UsuarioAdmin[]>()

  // EVENTO
  const [tipoEvento, setTipoEvento] = useState<tipoEventoEnum>()
  const [tipoReserva, setTipoReserva] = useState<tipoReservaEnum>(tipoReservaEnum.ESPORADICA);
  const [turmas, setTurmas] = useState<TurmaAdmin[]>([])
  const [turmaId, setTurmaId] = useState<string | undefined>("")
  const [quantidadeParticipantes, setQuantidadeParticipantes] = useState<number>(1)
  const [dataInicial, setDataInicial] = useState<Date>(() => new Date())
  const [dataFinal, setDataFinal] = useState<Date>(() => new Date())
  const [horarios, setHorarios] = useState<Horario[]>([])
  const [horario, setHorario] = useState<string | undefined>("")
  const [horaInicial, setHoraInicial] = useState<Date>(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  })
  const [horaFinal, setHoraFinal] = useState<Date>(() => {
    const d = new Date();
      d.setHours(23, 59, 0, 0);
      return d;
    })
  const [diaSemanaEvento, setDiaSemanaEvento] = useState<number>()
  const [acessibilidade, setAcessibilidade] = useState(false)
  const [setores, setSetores] = useState<SetorAdmin[]>([])
  const [setorId, setSetorId] = useState<string>()
  const [equipamentos, setEquipamentos] = useState<Equipamento[]>([])
  const [mobiliarios, setMobiliarios] = useState<Mobiliario[]>([])

  //FETCHS
  const [loadingTurmas, setLoadingTurmas] = useState(false)
  const [erroBuscarTurmas, setErroBuscarTurmas] = useState(false)
  const [mensagemErroBuscarTurmas, setMensagemErroBuscarTurmas] = useState("")
  const [loadingHorarios, setLoadingHorarios] = useState(false)
  const [erroBuscarHorarios, setErroBuscarHorarios] = useState(false)
  const [mensagemErroBuscarHorarios, setMensagemErroBuscarHorarios] = useState("")
  const [loadingSetores, setLoadingSetores] = useState(false)
  const [erroBuscarSetores, setErroBuscarSetores] = useState(false)
  const [mensagemErroBuscarSetores, setMensagemErroBuscarSetores] = useState("")
  const [erroSolicitarReserva, setErroSolicitarReserva] = useState(false)
  const [mensagemErroSolicitarReserva, setMensagemErroSolicitarReserva] = useState("")
  const [erroBuscarUsuarios, setErroBuscarUsuarios] = useState(false)
  const [mensagemErroBuscarUsuarios, setMensagemErroBuscarUsuarios] = useState("")
  const [loadingUsuarios, setLoadingUsuarios] = useState(false)
  const [isReservaSolicitada, setIsReservaSolicitada] = useState(false)

  const formRef = useRef<HTMLFormElement>(null);
  const cargosAprovadores = [Cargo.ATENDIMENTO, Cargo.ADMINISTRADOR]


  useEffect(() => {
    if (typeof window === "undefined") return;
    setIsClientReady(true)
    setLoadingTurmas(true)
    setLoadingHorarios(true)
    setLoadingSetores(true)
    buscarHorarios()    //buscar horários
    buscarSetores()   //buscar setores
    buscarUsuarios()
  },[])

  useEffect(() => {
    if(ministrante?.id){
      buscarTurmasByMinistrante(ministrante.id)
    }
  },[ministrante])

  useEffect(() => {
    setDiaSemanaEvento(dataInicial.getDay())
  },[dataInicial])

  useEffect(() => {
    if(!user) return
    setSolicitanteId(user.sub)
    setEmailSolicitante(user.email)
    setTelefoneSolicitante(user.telefone)
    setNomeCompletoUsuarioLogado(user.nome + " " + user.sobrenome)
  })

  if(!user) return


  async function buscarTurmasByMinistrante(ministranteId: string) {
    try {
      const turmas = await getTurmasByMinistrante(ministranteId)
      setTurmas(turmas)
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : String(err);
      console.error("Erro ao buscar as turmas:", mensagem);
      setErroBuscarTurmas(true)
      setMensagemErroBuscarTurmas("Não foi possível carregar as turmas")
    } finally {
      setLoadingTurmas(false)
    }
  }

  async function buscarUsuarios() {
    try {
      const Usuarios = await getUsuarios()
      setAprovadores(Usuarios)
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : String(err);
      console.error("Erro ao buscar os horários:", mensagem);
      setErroBuscarUsuarios(true)
      setMensagemErroBuscarUsuarios("Não foi possível buscar os horários")
    } finally {
      setLoadingUsuarios(false)
    }
  }

  async function buscarHorarios() {
    try {
      const horarios = await getHorarios()
      setHorarios(horarios)
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : String(err);
      console.error("Erro ao buscar os horários:", mensagem);
      setErroBuscarHorarios(true)
      setMensagemErroBuscarHorarios("Não foi possível buscar os horários")
    } finally {
      setLoadingHorarios(false)
    }
  }

  async function buscarSetores() {
    try {
      const setores = await getSetores()
      setSetores(setores)
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : String(err);
        console.error("Erro ao buscar os setores:", mensagem);
        setErroBuscarSetores(true)
        setMensagemErroBuscarSetores("Não foi possível buscar os locais")
      } finally {
        setLoadingSetores(false)
    }
  }

  const handleEquipamentoChange = (value: Equipamento) => {
    setEquipamentos(prev =>
      prev.includes(value)
        ? prev.filter(e => e !== value)
        : [...prev, value]
      )
    }

  const handleMobiliarioChange = (value: Mobiliario) => {
    setMobiliarios(prev =>
      prev.includes(value)
        ? prev.filter(m => m !== value)
        : [...prev, value]
      )
    }

  type OptionTypeTurmas = {
    value: string;
    label: string;
  };

  const optionsTurmas: OptionTypeTurmas[] = turmas
  .sort((a, b) => a.nome.localeCompare(b.nome))
  .map(t => ({
    value: t.id,
    label: `${t.nome} - ${t.disciplina.nome}`
    }))

    const customStylesTurmas: StylesConfig<OptionTypeTurmas, false> = {
      control: (provided) => ({
        ...provided,
        borderRadius: 8,
        borderColor: '#99a1af',
        minWidth: 220,
        flexWrap: 'wrap',
        padding: 2,
        boxShadow: 'none',
        color: '#162456',
        cursor: 'pointer',
        height: 'auto',
        minHeight: 40,
        '&:hover': { borderColor: '#162456' },
      }),
      option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isSelected
        ? '#162456'
        : state.isFocused
        ? '#bedbff'
        : 'white',
        color: state.isSelected
        ? 'white'
        : 'black',
        cursor: 'pointer',
      }),
      valueContainer: (provided) => ({
        ...provided,
        display: "flex",
        flexWrap: "wrap",
        gap: 4,
      }),
      placeholder: (provided) => ({
        ...provided,
        color: '#162456',
      }),
    };

    type SelectOption = {
    value: UsuarioOption,
    label: string
  }

  type UsuarioOption = {
    id: string;
    nome: string;
    sobrenome: string;
    email: string;
    telefone: string;
    cargos: Cargo[]
  };

  // const loadOptionsSolicitante = async (inputValue: string): Promise<SelectOption[]> => {
  //   if(!inputValue) return []

  //   const usuarios: UsuarioOption[] = await getUsuarioByNome(inputValue)

  //   return usuarios.map((u) => ({ value: u, label: `${u.nome} ${u.sobrenome}` }));
  // };

  const loadOptionsMinistrante = async (inputValue: string): Promise<SelectOption[]> => {
    if(!inputValue) return []

    const usuarios: UsuarioOption[] = await getUsuarioMinistranteByNome(inputValue)

    return usuarios.map((u) => ({value: u, label: `${u.nome} ${u.sobrenome}`}));
  };

  function escolheAprovador(){
    const usuariosAprovadores = aprovadores
      ?.filter(u => u.cargos.some(c => cargosAprovadores.includes(c)))
      ?.filter(u => u.id !== solicitanteId)
    if(!usuariosAprovadores) return
    const aprovadorAleatorio = usuariosAprovadores[Math.floor(Math.random() * usuariosAprovadores.length)]
    return aprovadorAleatorio
  }

  async function solicitarReserva(e: React.FormEvent){
    e.preventDefault()
    if (formRef.current && !formRef.current.reportValidity()) return;
    let permiteAtualizar = true

    const aprovador = escolheAprovador()
    if(!aprovador){
      setErroSolicitarReserva(true)
      setMensagemErroSolicitarReserva("Estamos tendo problemas. Tente novamente mais tarde.")
      setTimeout(() => setErroSolicitarReserva(false), 3000)
      permiteAtualizar = false
      return
    }

    const aprovadorId = aprovador.id
    setDiaSemanaEvento(dataInicial.getDay())

    if(horario !== undefined) {
      const horarioEscolhido = horarios.find(h => h.id === horario)
      if(horarioEscolhido){
        const inicio = new Date(horarioEscolhido.horaInicio)
        const fim = new Date(horarioEscolhido.horaFim)
        const horaInicialFormatada = inicio.getHours()
        const minutosInicialFormatada = inicio.getMinutes()
        const horaFinalFormatada = fim.getHours()
        const minutosFinalFormatada = fim.getMinutes()
        horaInicial.setHours(horaInicialFormatada, minutosInicialFormatada)
        horaFinal.setHours(horaFinalFormatada, minutosFinalFormatada)
      }
    }

    function toUTC(date: Date) {
      return new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    }

    if(!tipoEvento
      || !tipoReserva
      || (acessibilidade === undefined)
      || (diaSemanaEvento === null || diaSemanaEvento === undefined)
      || !ministranteId
      || !solicitanteId
      || !quantidadeParticipantes){
        setErroSolicitarReserva(true)
        setMensagemErroSolicitarReserva("Os valores não podem ser vazios")
        setTimeout(() => setErroSolicitarReserva(false), 3000)
        permiteAtualizar = false
        return
    }


    if(!(horaInicial instanceof Date) || (isNaN(horaInicial.getTime())) || !(horaFinal instanceof Date) || (isNaN(horaFinal.getTime()))){
      setErroSolicitarReserva(true)
      setMensagemErroSolicitarReserva("Os campos de horário não podem ser vazios")
      setTimeout(() => setErroSolicitarReserva(false), 3000)
      permiteAtualizar = false
      return
    }

    if(!(dataInicial instanceof Date) || (isNaN(dataInicial.getTime())) || !(dataFinal instanceof Date) || (isNaN(dataFinal.getTime()))){
      setErroSolicitarReserva(true)
      setMensagemErroSolicitarReserva("Os campos de horário não podem ser vazios")
      setTimeout(() => setErroSolicitarReserva(false), 3000)
      permiteAtualizar = false
      return
    }

    const tipoEventoSolicitacao = tipoEventoReverseMap[tipoEvento] as tipoEventoEnum
    const tipoReservaSolicitacao = tipoReservaReverseMap[tipoReserva] as tipoReservaEnum
    const equipamentosSolicitacao = equipamentos.map(e => tipoEquipamentoReverseMap[e] as Equipamento)
    const mobiliariosSolicitacao = mobiliarios.map(e => tipoMobiliarioReverseMap[e] as Mobiliario)

    if(permiteAtualizar){
      const solicitaReservaData: SolicitaReserva = {
        tipoEvento: tipoEventoSolicitacao,
        tipoReserva: tipoReservaSolicitacao,
        acessibilidade: acessibilidade,
        diaSemana: diaSemanaEvento,
        dataInicio: dataInicial,
        dataFim: dataFinal,
        horarioId: horario || null,
        horaInicial: horario === undefined ? toUTC(horaInicial) : horaInicial,
        horaFinal: horario === undefined ? toUTC(horaFinal) : horaFinal,
        turmaId: turmaId,
        qtdPessoas: quantidadeParticipantes,
        ministranteId: ministranteId,
        solicitanteId: solicitanteId,
        aprovadorId: aprovadorId,
        equipamentos: equipamentosSolicitacao,
        mobiliarios: mobiliariosSolicitacao,
        setorPreferidoId: setorId,
        statusReserva: statusReservaReverseMap[statusReservaEnum.PENDENTE] as statusReservaEnum
      }

      try {
        await createSolicitacao(solicitaReservaData)
        setIsReservaSolicitada(true)
        setTimeout(() => setIsReservaSolicitada(false), 3000)
      } catch (err) {
        const mensagem = err instanceof Error ? err.message : String(err);
        console.error("Erro ao atualizar a sala:", mensagem);
        setErroSolicitarReserva(true)
        setMensagemErroSolicitarReserva("Erro ao solicitar a reserva")
        setTimeout(() => setErroSolicitarReserva(false), 3000)
      }

    }
  }

  if(!isClientReady) return null

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {loadingHorarios || loadingSetores || loadingUsuarios || !dataInicial || !dataFinal || !horaInicial || !horaFinal || !user ? (
          <div className="flex justify-center items-center">
                <p className="mt-6 text-gray-600">{"Carregando...".split("").map((char, i) => (
                  <span key={i} className="inline-block animate-bounce">{char}</span>
                ))}
                </p>
          </div>
        ) : ( erroBuscarTurmas ? (
          <div className="flex justify-center items-center">
              <p className="mt-6 text-gray-600">{mensagemErroBuscarTurmas}</p>
          </div>
        ) : ( erroBuscarUsuarios ? (
          <div className="flex justify-center items-center">
              <p className="mt-6 text-gray-600">{mensagemErroBuscarUsuarios}</p>
          </div>
        ): (erroBuscarHorarios ? (
          <div className="flex justify-center items-center">
              <p className="mt-6 text-gray-600">{mensagemErroBuscarHorarios}</p>
          </div>
        ) : (erroBuscarSetores ? (
          <div className="flex justify-center items-center">
              <p className="mt-6 text-gray-600">{mensagemErroBuscarSetores}</p>
          </div>
        ) : (
        <div>
          <h1 className="text-4xl font-poppins text-center text-blue-950 font-bold mt-2">Solicitação de reserva</h1>
          <form ref={formRef} onSubmit={solicitarReserva} action="" className="grid grid-cols-2 grid-rows-2 gap-x-4 border rounded-lg p-4 my-8">
            <div className="flex flex-col row-start-1 row-end-2 col-start-1 col-end-2 gap-4">
              <h1 className="font-poppins text-2xl text-blue-950">Dados do solicitante</h1>
              <div className="flex flex-col gap-2">
                <label htmlFor="" className="font-semibold mb-1">
                  Nome do solicitante:
                </label>
                <input type="text" className="border rounded h-10 p-2 bg-gray-200 items-center" defaultValue={nomeCompletoUsuarioLogado}/>
                {/* <AsyncSelect<{ value: UsuarioOption, label: string },false>
                  required
                  instanceId="select-solicitante"
                  cacheOptions
                  defaultOptions
                  loadOptions={loadOptionsSolicitante}
                  isClearable
                  placeholder="Digite para buscar o usuário"
                  onChange={(selected) =>{
                    if (selected) {
                      const usuario = selected.value;  // Objeto completo
                      setSolicitanteId(usuario.id)
                      setEmailSolicitante(usuario.email);
                      setTelefoneSolicitante(usuario.telefone);
                    } else {
                      setSolicitanteId("")
                      setEmailSolicitante("")
                      setTelefoneSolicitante("")
                    }
                  }}
                /> */}
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="" className="font-semibold mb-1">
                  E-mail do solicitante:
                </label>
                <input
                  required
                  disabled
                  className="w-full border rounded h-10 bg-gray-200 p-2" type="email"
                  placeholder="Email será preenchido automaticamente"
                  defaultValue={emailSolicitante}
                  // onChange={(e) => setEmailSolicitante(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="" className="font-semibold mb-1">
                  Telefone de contato:
                </label>
                <input
                  required
                  disabled
                  className="w-full border rounded h-10 bg-gray-200 p-2"
                  type="tel"
                  placeholder="Telefone será preenchido automaticamente"
                  defaultValue={telefoneSolicitante}
                  // onChange={(e) => setTelefoneSolicitante(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-col row-start-2 col-start-1 col-end-2 gap-4 mt-4">
              <h1 className="font-poppins text-2xl text-blue-950">Dados do ministrante</h1>
              <div className="flex flex-col gap-2">
                <label htmlFor="" className="font-semibold mb-1">
                  Nome do ministrante:
                </label>
                <AsyncSelect<{ value: UsuarioOption, label: string },false>
                  required
                  instanceId="select-ministrante"
                  cacheOptions
                  defaultOptions
                  loadOptions={loadOptionsMinistrante}
                  isClearable
                  placeholder="Digite para buscar usuário"
                  onChange={(selected) =>{
                    if (selected) {
                      const usuario = selected.value;  // Objeto completo
                      setMinistrante(usuario);         // Guarda tudo
                      setMinistranteId(usuario.id)
                      setEmailMinistrante(usuario.email);
                      setTelefoneMinistrante(usuario.telefone);
                    } else {
                      setMinistrante(undefined)
                      setMinistranteId("")
                      setEmailMinistrante("")
                      setTelefoneMinistrante("")
                    }
                  }}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="" className="font-semibold mb-1">
                  E-mail do ministrante:
                </label>
                <input
                  required
                  disabled
                  className="w-full border rounded h-10 bg-white p-2"
                  placeholder="Email será preenchido ao selecionar o nome"
                  type="email"
                  value={emailMinistrante}
                  onChange={(e) => setEmailMinistrante(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="" className="font-semibold mb-1">
                  Telefone de contato:
                </label>
                <input
                  required
                  disabled
                  className="w-full border rounded h-10 bg-white p-2"
                  placeholder="Telefone será preenchido ao selecionar o nome"
                  type="tel"
                  value={telefoneMinistrante}
                  onChange={(e) => setTelefoneMinistrante(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-col row-span-2 col-start-2 gap-4">
              <h1 className="font-poppins text-2xl text-blue-950">Dados do evento</h1>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col col-start-1 col-end-2 gap-2">
                  <label htmlFor="" className="font-semibold mb-1">Tipo de evento:</label>
                  <select
                    value={tipoEvento}
                    className="border rounded h-10 p-2 bg-white"
                    onChange={e => {
                      const novoTipoEvento = e.target.value as tipoEventoEnum
                      if(novoTipoEvento !== tipoEventoEnum.AULA && novoTipoEvento !== tipoEventoEnum.BANCA){
                        setTurmaId(undefined)
                      }
                      setTipoEvento(novoTipoEvento)
                      }
                    }
                    required>
                    <option value="">Selecione o evento</option>
                    {Object.values(tipoEventoEnum).map((tipo) => (
                      <option key={tipo} value={tipo}>
                        {tipo}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col col-start-2 gap-2">
                  <label htmlFor="" className="font-semibold mb-1">Número de participantes:</label>
                  <input
                    required
                    className="border rounded h-10 p-2 bg-white"
                    type="number" min={1} max={220}
                    value={quantidadeParticipantes}
                    onChange={e => {setQuantidadeParticipantes(Number(e.target.value))}}
                  />
                </div>
              </div>
              {tipoEvento === tipoEventoEnum.AULA || tipoEvento === tipoEventoEnum.BANCA ? (
                <div className="flex flex-col gap-2">
                  <label htmlFor="" className="font-semibold mb-1">Atividade:</label>
                  <Select
                    required
                    isDisabled={!ministrante}
                    styles={customStylesTurmas}
                    options={optionsTurmas}
                    placeholder={ministrante ? loadingTurmas ? "Carregando as atividades" : "Selecione a atividade" : "Selecione o ministrante primeiro"}
                    value={turmaId !== undefined ? optionsTurmas.find(o => o.value === turmaId) || null : null}
                    onChange={(selected) => {
                      if(tipoEvento === tipoEventoEnum.AULA || tipoEvento === tipoEventoEnum.BANCA){
                        setTurmaId(selected ? selected.value : "")
                      } else
                        setTurmaId("")
                      }}
                  />
                </div>
                ) : null
              }
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-2">
                  <label htmlFor="" className="font-semibold mb-1">
                    Data inicial:
                  </label>
                  <input
                    required
                    className="w-full border rounded h-10 bg-white p-2"
                    type="date"
                    value={dataInicial ? dataInicial.toISOString().split('T')[0] : ""}
                    onChange={e => setDataInicial(new Date(e.target.value))}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="" className="font-semibold mb-1">
                    Data final:
                  </label>
                  <input
                    required
                    className="w-full border rounded h-10 bg-white p-2"
                    type="date"
                    value={dataFinal ? dataFinal.toISOString().split('T')[0] : ""}
                    onChange={e => setDataFinal(new Date(e.target.value))}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="" className="font-semibold mb-1">Horário:</label>
                <select
                  required
                  value={horario}
                  className="w-full border rounded h-10 bg-white p-2"
                  onChange={e => {
                    if(e.target.value === "Outro"){
                      setHorario(undefined)
                    } else{
                      const horarioId = e.target.value;
                      const selectedHorario = horarios.find(h => h.id === horarioId)?.id;
                      if(selectedHorario !== undefined) setHorario(selectedHorario);
                      else setHorario(undefined)
                    }
                  }}
                >
                  <option value="">Selecione o horário</option>
                  {horarios.map((h) => (
                    <option key={h.id} value={h.id}>
                      {`${h.nome} - ${formataHorarioLocal(h.horaInicio)} às ${formataHorarioLocal(h.horaFim)}`}
                    </option>
                  ))}
                  <option value="Outro">Outro</option>
                </select>
              </div>
              {horario === undefined && (
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col col-start-1 col-end-2 gap-2">
                    <label htmlFor="" className="font-semibold mb-1">
                      Hora inicial:
                    </label>
                    <input
                      required
                      className="w-full border rounded h-10 bg-white p-2"
                      type="time"
                      value={horaInicial ? horaInicial.toTimeString().slice(0,5) : ""}
                      onChange={(e) => {
                        const [horas, minutos] = e.target.value.split(":").map(Number)
                        const novaHoraInicial = new Date()
                        novaHoraInicial.setHours(horas, minutos)
                        setHoraInicial(novaHoraInicial)}}
                    />
                  </div>
                  <div className="flex flex-col col-start-2 gap-2">
                    <label htmlFor="" className="font-semibold mb-1">
                      Hora final:
                    </label>
                    <input
                      required
                      className="w-full border rounded h-10 bg-white p-2"
                      type="time"
                      value={horaFinal ? horaFinal.toTimeString().slice(0,5) : ""}
                      onChange={(e) => {
                        const [horas, minutos] = e.target.value.split(":").map(Number)
                        const novaHoraFinal = new Date()
                        novaHoraFinal!.setHours(horas, minutos)
                        setHoraFinal(novaHoraFinal)
                      }}
                    />
                  </div>
                </div>
                )
              }
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col col-start-1 col-end-2 gap-2">
                  <label className="block font-semibold">Frequência:</label>
                  <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="tipoReserva"
                        value={tipoReservaEnum.ESPORADICA}
                        className="w-5 h-5 border rounded"
                        checked={tipoReserva === tipoReservaEnum.ESPORADICA}
                        onChange={(e) => setTipoReserva(e.target.value as tipoReservaEnum)}
                      />
                      Esporádica
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="tipoReserva"
                        value={tipoReservaEnum.RECORRENTE}
                        className="w-5 h-5 border rounded"
                        checked={tipoReserva === tipoReservaEnum.RECORRENTE}
                        onChange={(e) => setTipoReserva(e.target.value as tipoReservaEnum)}
                      />
                      Recorrente
                    </label>
                  </div>
                </div>
                <div className="flex flex-col col-start-2 gap-2">
                  <label className="block font-semibold">Acessibilidade</label>
                  <div className="flex gap-2 items-center">
                    <label className="flex items-center gap-2">
                    <input
                        type="radio"
                        name="acessibilidade"
                        value="false"
                        checked={acessibilidade === false}
                        onChange={() => setAcessibilidade(false)}
                        className="w-5 h-5 border rounded"
                        />
                        Sem acessibilidade
                    </label>
                  </div>
                  <div className="flex gap-2 items-center">
                    <label className="flex items-center gap-2">
                    <input
                        type="radio"
                        name="acessibilidade"
                        value="true"
                        checked={acessibilidade === true}
                        onChange={() => setAcessibilidade(true)}
                        className="w-5 h-5 border rounded"
                        />
                        Com acessibilidade
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="" className="font-semibold mb-1">Localização desejada</label>
                <select
                  value={setorId ?? ""}
                  className="w-full border rounded h-10 bg-white p-2 font-poppins"
                  onChange={e => {
                      const setorId = e.target.value;
                      const selectedSetor = setores.find(s => s.id === setorId)?.id;
                      setSetorId(selectedSetor);

                  }}
                >
                  {loadingSetores ? (<option value="">Carregando os locais</option>)
                    : (<option value="">Selecione o local de preferência</option>)
                  }

                  {setores
                    .sort((a, b) => a.nome.localeCompare(b.nome))
                    .map((s) =>(
                        <option key={s.id} value={s.id}>
                          {`${s.nome} - ${s.descricao}`}
                        </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col col-start-1 col-end-2">
                  <label htmlFor="" className="font-semibold mb-2">Equipamentos:</label>
                  {Object.entries(Equipamento).map(([key, value]) => (
                    <label key={key} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        value={value}
                        checked={equipamentos.includes(value)}
                        onChange={() => handleEquipamentoChange(value)}
                        className="w-5 h-5 border rounded"
                        />
                      {value}
                    </label>
                  ))}
                </div>
                <div className="flex flex-col col-start-2">
                  <label htmlFor="" className="font-semibold mb-2">Mobiliários:</label>
                  {Object.entries(Mobiliario).map(([key, value]) => (
                    <label key={key} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        value={value}
                        checked={mobiliarios.includes(value)}
                        onChange={() => handleMobiliarioChange(value)}
                        className="w-5 h-5 border rounded"
                        />
                      {value}
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex flex-col col-span-2 gap-2 items-center justify-center mt-4">
              <button
                onClick={solicitarReserva}
                type="submit"
                className="bg-blue-700 font-poppins text-white px-4 py-2 rounded-lg hover:bg-blue-950 hover:cursor-pointer transition duration-300"
              >
                Solicitar reserva
              </button>
              {erroSolicitarReserva && (
                <div className="bg-red-400 font-bold text-white text-center p-3 rounded-lg shadow-lg z-50">
                  <p>{mensagemErroSolicitarReserva}</p>
                </div>
              )}
              {isReservaSolicitada && (
                <div className="bg-green-400 font-bold text-white text-center p-3 rounded-lg shadow-lg z-50">
                  <p>✅ Reserva solicitada com sucesso!</p>
                </div>
              )}
            </div>
          </form>
        </div>
        )))))}
    </div>
  )
}