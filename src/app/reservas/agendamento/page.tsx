'use client'
import { getDisciplinas } from "@/lib/api/disciplinas/api"
import { getHorarios } from "@/lib/api/horarios/api"
import { getSetores } from "@/lib/api/setores/api"
import { getUsuarioByNome, getUsuarioMinistranteByNome, getUsuarios } from "@/lib/api/usuario/api"
import { Disciplina } from "@/types/disciplina"
import { tipoEventoEnum } from "@/types/evento"
import { Horario } from "@/types/horario"
import { Equipamento, Mobiliario } from "@/types/sala"
import { SetorAdmin } from "@/types/setor"
import { Cargo, UsuarioAdmin } from "@/types/usuario"
import { useEffect, useState } from "react"
import { GroupBase, SingleValue, StylesConfig } from "react-select"
import AsyncSelect from "react-select/async"
import Select from "react-select/base"

function formataHorarioLocal(horario: string) {
  const [h, m] = horario.slice(11, 16).split(":").map(Number);
  const horarioFormatado = String(h).padStart(2, "0") + ":" + String(m).padStart(2, "0")

  return horarioFormatado;
}

export default function SolicitarReserva() {
  const [usuarios, setUsuarios] = useState<UsuarioAdmin[]>([])

  // SOLICITANTE
  const [nomeSolicitante, setNomeSolicitante] = useState<string>("")
  const [emailSolicitante, setEmailSolicitante] = useState<string>("")
  const [telefoneSolicitante, setTelefoneSolicitante] = useState<string>("")
  const [solicitante, setSolicitante] = useState<UsuarioOption>()

  // MINISTRANTE
  const [ministrante, setMinistrante] = useState<UsuarioOption>()
  const [nomeMinistrante, setNomeMinistrante] = useState<string>("")
  const [emailMinistrante, setEmailMinistrante] = useState<string>("")
  const [telefoneMinistrante, setTelefoneMinistrante] = useState<string>("")

  // EVENTO
  const [tipoEvento, setTipoEvento] = useState<tipoEventoEnum>()
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([])
  const [disciplinaId, setDisciplinaId] = useState<string>("")
  const [quantidadeParticipantes, setQuantidadeParticipantes] = useState()
  const [dataInicial, setDataInicial] = useState<Date>()
  const [dataFinal, setDataFinal] = useState<Date>()
  const [horarios, setHorarios] = useState<Horario[]>([])
  const [horario, setHorario] = useState<Horario | string>("")
  const [aulaSemanal, setAulaSemanal] = useState(false)
  const [acessibilidade, setAcessibilidade] = useState(false)
  const [setores, setSetores] = useState<SetorAdmin[]>([])
  const [setor, setSetor] = useState<SetorAdmin>()
  const [equipamentos, setEquipamentos] = useState<Equipamento[]>([])
  const [mobiliarios, setMobiliarios] = useState<Mobiliario[]>([])

  //FETCHS
  const [loadingDisciplinas, setLoadingDisciplinas] = useState(false)
  const [erroBuscarDisciplinas, setErroBuscarDisciplinas] = useState(false)
  const [mensagemErroBuscarDisciplinas, setMensagemErroBuscarDisciplinas] = useState("")
  const [loadingUsuarios, setLoadingUsuarios] = useState(false)
  const [erroBuscarUsuarios, setErroBuscarUsuarios] = useState(false)
  const [mensagemErroBuscarUsuarios, setMensagemErroBuscarUsuarios] = useState("")
  const [loadingHorarios, setLoadingHorarios] = useState(false)
  const [erroBuscarHorarios, setErroBuscarHorarios] = useState(false)
  const [mensagemErroBuscarHorarios, setMensagemErroBuscarHorarios] = useState("")
  const [loadingSetores, setLoadingSetores] = useState(false)
  const [erroSetores, setErroBuscarSetores] = useState(false)
  const [mensagemErroBuscarSetores, setMensagemErroBuscarSetores] = useState("")

  useEffect(() => {
    setLoadingDisciplinas(true)
    setLoadingUsuarios(true)
    setLoadingHorarios(true)
    setLoadingSetores(true)
    buscarDisciplinas() //buscar disciplinas
    buscarHorarios()    //buscar horários
    buscarSetores()     //buscar setores
  },[])

  async function buscarDisciplinas() {
    try {
      const disciplinas = await getDisciplinas()
      setDisciplinas(disciplinas)
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : String(err);
        console.error("Erro ao buscar as disciplinas:", mensagem);
        setErroBuscarDisciplinas(true)
        setMensagemErroBuscarDisciplinas("Não foi possível carregar as disciplinas")
    } finally {
      setLoadingDisciplinas(false)
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

  const handleEquipamentoChange = (tipo: Equipamento) => {
    setEquipamentos(prev =>
      prev.includes(tipo)
        ? prev.filter(e => e !== tipo)
        : [...prev, tipo]
    )
  }

  const handleMobiliarioChange = (tipo: Mobiliario) => {
    setMobiliarios(prev =>
      prev.includes(tipo)
        ? prev.filter(m => m !== tipo)
        : [...prev, tipo]
    )
  }

  type OptionTypeDisciplinas = {
    value: string;
    label: string;
  };

  const optionsDisciplinas: OptionTypeDisciplinas[] = disciplinas
    .sort((a, b) => a.nome.localeCompare(b.nome))
    .map(d => ({
      value: d.id,
      label: d.nome
    }))

  const customStylesDisciplinas: StylesConfig<OptionTypeDisciplinas, false> = {
      control: (provided) => ({
        ...provided,
        borderRadius: '8px',
        borderColor: '#99a1af',
        minWidth: '220px',
        flexWrap: 'wrap',
        padding: '2px',
        boxShadow: 'none',
        color: '#162456',
        cursor: 'pointer',
        height: 'auto',
        minHeight: "40px",
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

  const loadOptionsSolicitante = async (inputValue: string): Promise<SelectOption[]> => {
    if(!inputValue) return []

    const usuarios: UsuarioOption[] = await getUsuarioByNome(inputValue)

    return usuarios.map((u) => ({ value: u, label: `${u.nome} ${u.sobrenome}` }));
  };

  const loadOptionsMinistrante = async (inputValue: string): Promise<SelectOption[]> => {
    if(!inputValue) return []

    const usuarios: UsuarioOption[] = await getUsuarioMinistranteByNome(inputValue)

    return usuarios.map((u) => ({value: u, label: `${u.nome} ${u.sobrenome}`}));
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
        <h1 className="text-4xl font-poppins text-blue-950 font-bold mt-2">Solicitação de reserva</h1>
        <form action="" className="grid grid-cols-2 grid-rows-2 gap-x-4 border rounded-lg p-4 my-8">
          <div className="flex flex-col row-start-1 row-end-2 col-start-1 col-end-2 gap-4">
            <h1 className="font-poppins text-2xl text-blue-950">Dados do solicitante</h1>
            <div className="flex flex-col gap-2">
              <label htmlFor="" className="font-semibold mb-1">
                Nome do solicitante:
              </label>
              <AsyncSelect<{ value: UsuarioOption, label: string },false>
                cacheOptions
                defaultOptions
                loadOptions={loadOptionsSolicitante}
                isClearable
                placeholder="Digite para buscar usuário"
                onChange={(selected) =>{
                  if (selected) {
                    const usuario = selected.value;  // Objeto completo
                    setSolicitante(usuario);         // Guarda tudo
                    setEmailSolicitante(usuario.email);
                    setTelefoneSolicitante(usuario.telefone);
                  } else {
                    setEmailSolicitante("")
                    setTelefoneSolicitante("")
                  }
                }}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="" className="font-semibold mb-1">
                E-mail do solicitante:
              </label>
              <input required disabled className="w-full border rounded h-10 bg-white p-2" type="email" placeholder="Email será preenchido ao selecionar o nome" value={emailSolicitante} onChange={(e) => setEmailSolicitante(e.target.value)}/>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="" className="font-semibold mb-1">
                Telefone de contato:
              </label>
              <input required disabled className="w-full border rounded h-10 bg-white p-2" type="tel" placeholder="Telefone será preenchido ao selecionar o nome" value={telefoneSolicitante} onChange={(e) => setTelefoneSolicitante(e.target.value)}/>
            </div>
          </div>
          <div className="flex flex-col row-start-2 col-start-1 col-end-2 gap-4 mt-4">
            <h1 className="font-poppins text-2xl text-blue-950">Dados do ministrante</h1>
            <div className="flex flex-col gap-2">
              <label htmlFor="" className="font-semibold mb-1">
                Nome do ministrante:
              </label>
              <AsyncSelect<{ value: UsuarioOption, label: string },false>
                cacheOptions
                defaultOptions
                loadOptions={loadOptionsMinistrante}
                isClearable
                placeholder="Digite para buscar usuário"
                onChange={(selected) =>{
                  if (selected) {
                    const usuario = selected.value;  // Objeto completo
                    setMinistrante(usuario);         // Guarda tudo
                    setEmailMinistrante(usuario.email);
                    setTelefoneMinistrante(usuario.telefone);
                  } else {
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
              <input required disabled className="w-full border rounded h-10 bg-white p-2" placeholder="Email será preenchido ao selecionar o nome" type="email" value={emailMinistrante} onChange={(e) => setEmailMinistrante(e.target.value)}/>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="" className="font-semibold mb-1">
                Telefone de contato:
              </label>
              <input required disabled className="w-full border rounded h-10 bg-white p-2" placeholder="Telefone será preenchido ao selecionar o nome" type="tel" value={telefoneMinistrante} onChange={(e) => setTelefoneMinistrante(e.target.value)}/>
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
                  onChange={e => {setTipoEvento(e.target.value as tipoEventoEnum)}}
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
                <input required className="border rounded h-10 p-2 bg-white" type="number" min={0} defaultValue={0}/>
              </div>
            </div>
            {tipoEvento === tipoEventoEnum.AULA || tipoEvento === tipoEventoEnum.BANCA ? (
              <div className="flex flex-col gap-2">
                <label htmlFor="" className="font-semibold mb-1">Atividade:</label>
                <Select
                  styles={customStylesDisciplinas}
                  options={optionsDisciplinas}
                  placeholder="Selecione a atividade"
                  required
                  onChange={(selected) => setDisciplinaId(selected ? selected.value : "")}
                  value={disciplinaId ? optionsDisciplinas.find(o => o.value === disciplinaId) || null : null}
                />
              </div>
              ) : null
            }
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-2">
                <label htmlFor="" className="font-semibold mb-1">
                  Data inicial:
                </label>
                <input required className="w-full border rounded h-10 bg-white p-2" type="date"/>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="" className="font-semibold mb-1">
                  Data final:
                </label>
                <input required className="w-full border rounded h-10 bg-white p-2" type="date"/>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="" className="font-semibold mb-1">Horário:</label>
              <select
                value={horario?.id ?? ""}
                className="w-full border rounded h-10 bg-white p-2"
                onChange={e => {
                  if(e.target.value === "Outro"){
                    setHorario("Outro" as unknown as Horario)
                  } else{
                    const horarioId = e.target.value;
                    const selectedHorario = horarios.find(h => h.id === horarioId)!;
                    setHorario(selectedHorario);
                  }
                }}
                required
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
            {horario === "Outro" && (
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col col-start-1 col-end-2 gap-2">
                  <label htmlFor="" className="font-semibold mb-1">
                    Hora inicial:
                  </label>
                  <input required className="w-full border rounded h-10 bg-white p-2" type="time" min={2}/>
                </div>
                <div className="flex flex-col col-start-2 gap-2">
                  <label htmlFor="" className="font-semibold mb-1">
                    Hora inicial:
                  </label>
                  <input required className="w-full border rounded h-10 bg-white p-2" type="time" min={2}/>
                </div>
              </div>
              )
            }
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col col-start-1 col-end-2 gap-2">
                <label className="block font-semibold">Frequência:</label>
                <div className="flex gap-2 items-center">
                  <input
                      type="checkbox"
                      checked={aulaSemanal}
                      onChange={(e) => setAulaSemanal(e.target.checked)}
                      className="w-5 h-5 border rounded"/>
                  <span>
                      {aulaSemanal
                        ? "Recorrente"
                        : "Esporádica"}
                  </span>
                </div>
              </div>
              <div className="flex flex-col col-start-2 gap-2">
                <label className="block font-semibold">Acessibilidade</label>
                <div className="flex gap-2 items-center">
                  <input
                      type="checkbox"
                      checked={acessibilidade}
                      onChange={(e) => setAcessibilidade(e.target.checked)}
                      className="w-5 h-5 border rounded"
                      />
                  <span>
                      {acessibilidade
                        ? "Com acessibilidade"
                        : "Sem acessibilidade"}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="" className="font-semibold mb-1">Localização desejada</label>
              <select
                value={setor?.id ?? ""}
                className="w-full border rounded h-10 bg-white p-2 font-poppins"
                onChange={e => {
                    const setorId = e.target.value;
                    const selectedSetor = setores.find(s => s.id === setorId)!;
                    setSetor(selectedSetor);

                }}
                required
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
                {Object.values(Equipamento).map((tipo) => (
                  <label key={tipo} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      value={tipo}
                      checked={equipamentos.includes(tipo)}
                      onChange={() => handleEquipamentoChange(tipo)}
                      className="w-5 h-5 border rounded"
                      />
                    {tipo}
                  </label>
                ))}
              </div>
              <div className="flex flex-col col-start-2">
                <label htmlFor="" className="font-semibold mb-2">Mobiliários:</label>
                {Object.values(Mobiliario).map((tipo) => (
                  <label key={tipo} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      value={tipo}
                      checked={mobiliarios.includes(tipo)}
                      onChange={() => handleMobiliarioChange(tipo)}
                      className="w-5 h-5 border rounded"
                      />
                    {tipo}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </form>
    </div>
  )
}