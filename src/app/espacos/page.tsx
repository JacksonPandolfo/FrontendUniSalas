'use client'
import { useEffect, useState } from "react";
import { getSetores } from "../api/setores/route";

import { SetorAdmin } from "@/types/setor";
import { BlocoAdmin } from "@/types/bloco";
import { SalaAdmin } from "@/types/sala";

import { CartaoSetor } from "@/components/cartaoSetor";
import { getBlocosSetor } from "../api/blocos/route";
import { CartaoBloco } from "@/components/cartaoBloco";

import { TbCircleArrowLeftFilled } from "react-icons/tb";
import { CartaoSala } from "@/components/cartaoSala";
import { getEventosSalaComData } from "../api/reservas/route";
import { EventoAdmin } from "@/types/evento";
import { CartaoEvento } from "@/components/cartaoEvento";
import { getSalasSetor } from "../api/salas/route";
import { CartaoDetalhe } from "@/components/cartaoDetalhesSala";

export default function Espacos() {
  const [setoresAdmin, setSetoresAdmin] = useState<SetorAdmin[]>([]);
  const [blocosAdmin, setBlocosAdmin] = useState<BlocoAdmin[]>([])
  const [salasAdmin, setSalasAdmin] = useState<SalaAdmin[]>([]);
  const [eventosAdmin, setEventosAdmin] = useState<EventoAdmin[]>([]);

  const [setorSelecionado, setSetorSelecionado] = useState<string | null>(null)
  const [blocoSelecionado, setBlocoSelecionado] = useState<string | null>(null)
  const [salaSelecionada, setSalaSelecionada] = useState<string | null>(null)
  const [eventosDetalhes, setEventosDetalhes] = useState(false)

  const [loadingSetores, setLoadingSetores] = useState(false);
  const [loadingBlocos, setLoadingBlocos] = useState(false);
  const [loadingEventos, setLoadingEventos] = useState(false)
  const [erroSetor, setErroSetor] = useState("")
  const [erroBloco, setErroBloco] = useState("")
  const [erroSala, setErroSala] = useState("")
  const [erroEventos, setErroEventos] = useState("")

  const data = new Date()
  const dataHoje = data.getFullYear() + "-" + String(data.getMonth()+1).padStart(2, "0") + "-" + String(data.getDate()).padStart(2, "0")
  const inicioDia = new Date(`${dataHoje}T00:00:00`)
  const fimDia = new Date(`${dataHoje}T23:59:59`)

  // 🔹 Função de busca na API
  useEffect(() => {
    setLoadingSetores(true)
    carregarSetores()
  }, []);

  async function carregarSetores() {
      getSetores()
      .then(setSetoresAdmin)
      .catch((err) => {
        console.log(err)
        setErroSetor("Não foi possível carregar os setores")
      })
      .finally(() => setLoadingSetores(false))
  }

  useEffect(() => {
    if(setorSelecionado !== null){
      setLoadingBlocos(true)
      carregarSalasSetor(setorSelecionado)
      carregarBlocos(setorSelecionado)
    }
  }, [setorSelecionado])

  async function carregarSalasSetor(setorId: string) {
    try {
      setErroSala("")
      const salas = await getSalasSetor(setorId)
      setSalasAdmin(salas)
    } catch (err) {
      console.log(err)
      setErroSala("Não foi possível carregar as salas do setor")
    }
  }

  async function carregarBlocos(setorId: string) {
    try {
      setLoadingBlocos(true)
      setErroBloco("")
      const blocos = await getBlocosSetor(setorId)
      setBlocosAdmin(blocos)
    } catch (err) {
      console.log(err)
      setErroBloco("Não foi possível carregar os blocos")
    } finally {
      setLoadingBlocos(false)
    }
  }

  const handleSalaClick = (id: string) => {
    if(salaSelecionada === id){
      setSalaSelecionada(null)
      setEventosAdmin([])
      setEventosDetalhes(false)
    } else {
      setSalaSelecionada(id)
      setEventosDetalhes(true)
    }
  }

  useEffect(() => {
    if( salaSelecionada !== null){
      carregarEventosSalaComData(salaSelecionada, inicioDia, fimDia)
    }
  }, [salaSelecionada])

  async function carregarEventosSalaComData(salaId: string, dataInicio: Date, dataFim: Date) {
    try {
      setLoadingEventos(true)
      setErroEventos("")
      const eventos = await getEventosSalaComData(salaId, dataInicio, dataFim)
      setEventosAdmin(eventos)
      console.log(eventos)
    } catch (err) {
      console.log(err)
      setErroEventos("Não foi possível carregar os eventos")
    } finally {
      setLoadingEventos(false)
    }
  }


//TERMINAR DE MONTAR A CHAMADA DAS SALAS
  return (
    <div className="flex flex-col items-center justify-center min-h-screen pb-4 px-8">
        {loadingSetores ? (
          <p className="mt-6 text-gray-600">Carregando setores...</p>
        ) : erroSetor ? (
          <p className="mt-6 text-gray-600">{erroSetor}</p>
        ) : (
          <div className="flex justify-center gap-2 mt-4">
          {!setorSelecionado &&
          setoresAdmin
            .sort((x, y) => x.nome.localeCompare(y.nome))
            .map((setor) => (
              <CartaoSetor
                key={setor.id}
                {...setor}
                onClick={() => setSetorSelecionado(setor.id)}/>
            ))}
          </div>
        )}

        {loadingBlocos ? (
          <p className="mt-6 text-gray-600">Carregando blocos...</p>
        ) : erroBloco ? (
          <p className="mt-6 text-gray-600">{erroBloco}</p>
        ) : ( blocosAdmin.length > 0 && (
          <div>
            {setorSelecionado && !blocoSelecionado ? (
              <div className="flex justify-center items-center">
                <button className="border-2 flex gap-2 items-center border-blue-950 text-blue-950 font-poppins rounded-2xl p-2 hover:cursor-pointer hover:bg-blue-950 hover:text-white hover:scale-105 transition-all transform duration-500"
                  onClick={() => {setSetorSelecionado(null)
                }}>
                    <TbCircleArrowLeftFilled size={30}/> Voltar aos setores</button>
              </div>
            ) : ("")}
            <div className="flex flex-wrap justify-center gap-3 my-4">
              {setorSelecionado && !blocoSelecionado &&
                blocosAdmin
                .filter((bloco) => bloco.setorId  === setorSelecionado)
                .sort((a, b) => a.numero - b.numero)
                .map((bloco) => {
                  const salasLivres = salasAdmin.filter((sala) => sala.blocoId === bloco.id && sala.statusSala === "LIVRE").length
                  const salasOcupadas = salasAdmin.filter((sala) => sala.blocoId === bloco.id && sala.statusSala === "OCUPADA").length
                  const salasManutencao = salasAdmin.filter((sala) => sala.blocoId === bloco.id && sala.statusSala === "MANUTENCAO").length
                  const salasDesativadas = salasAdmin.filter((sala) => sala.blocoId === bloco.id && sala.statusSala === "DESATIVADA").length

                  return (
                  <CartaoBloco
                  key={bloco.id}
                  {...bloco}
                  nomeSetor={setoresAdmin.find((setor) => setor.id === bloco.setorId)?.nome ?? ""}
                  salasLivres={salasLivres}
                  salasOcupadas={salasOcupadas}
                  salasManutencao={salasManutencao}
                  salasDesativadas={salasDesativadas}
                  onClick={() => setBlocoSelecionado(bloco.id)}/>
                  )})}
            </div>
          </div>
          ))}

            {erroSala ? (
              <p className="mt-6 text-gray-600">{erroSala}</p>
            ) : ( salasAdmin.length > 0 && (
              <div className="flex flex-col gap-2">
                {blocoSelecionado ? (
                  <div className="flex justify-center items-center">
                  <button className="border-2 flex gap-2 items-center border-blue-950 text-blue-950 font-poppins rounded-2xl p-2 hover:cursor-pointer hover:bg-blue-950 hover:text-white hover:scale-105 transition-all transform duration-500"
                    onClick={() => {setBlocoSelecionado(null)
                                    setErroEventos("")
                                  }}>
                      <TbCircleArrowLeftFilled size={30}/> Voltar aos blocos</button>
                </div>
                ): ("")}
                {blocoSelecionado && salasAdmin.filter((sala) => sala.blocoId === blocoSelecionado).length === 0 ? (
                  <p>Nenhuma sala encontrada</p>
                ) : (
                  <div className="flex flex-wrap justify-center gap-x-2 gap-y-4 mt-4">
                    {setorSelecionado && blocoSelecionado &&
                      salasAdmin
                      .filter((sala) => sala.blocoId === blocoSelecionado)
                      .map((sala) => {
                        const bloco = blocosAdmin.find((bloco) => bloco.id === sala.blocoId);
                        const setor = setoresAdmin.find((setor) => setor.id === bloco?.setorId)

                        return (
                          <CartaoSala
                            key={sala.id}
                            {...sala}
                            numeroBloco={bloco?.numero ?? 0}
                            nomeSetor={setor?.nome ?? ""}
                            selecionado={salaSelecionada === sala.id}
                            onClick={() => handleSalaClick(sala.id)}
                            />
                          )
                        })
                      }
                  </div>
                )}
              </div>
              )
            )}
            {/* { setorSelecionado && blocoSelecionado && salaSelecionada && */}
            <div className={`${salaSelecionada? "opacity-100" : "opacity-0"} relative flex w-full mt-4 pt-14 border-4 gap-2 border-blue-950 rounded-lg items-center justify-center p-4 transition transform duration-700`}>
              <div className="absolute top-0 w-full flex gap-2 items-center justify-center text-center p-2 bg-blue-950">
                <h1 className="font-poppins items-center text-white font-bold">Detalhes da sala</h1>
                  {salasAdmin
                  .filter((sala) => sala.id === salaSelecionada)
                  .map((sala) => {
                    const bloco = blocosAdmin.find((bloco) => bloco.id === sala.blocoId);
                    const setor = setoresAdmin.find((setor) => setor.id === bloco?.setorId)
                    return(
                      <p key={sala.id} className="font-poppins font-bold text-white w-24 bg-orange-400 justify-center rounded-full">
                        {setor?.nome}{String(bloco?.numero).padStart(2, "0")} - {sala.numero}
                      </p>
                    )
                  })
                }
                </div>
                {setorSelecionado && blocoSelecionado && eventosDetalhes ?
                  salasAdmin
                  .filter((sala) => sala.id === salaSelecionada)
                  .map((sala) => {
                    return (
                      <CartaoDetalhe
                      key={sala.id}
                      equipamentos={sala.Equipamentos}
                      mobiliarios={sala.Mobiliarios}
                      />
                    )
                  }) : null
                }
                {loadingEventos ? (
                  <p className="mt-6 text-gray-600">Carregando eventos da sala...</p>
                ) : erroEventos ? (
                  <p className="mt-6 text-gray-600">{erroEventos}</p>
                ) : (
                  <div className="flex flex-wrap justify-center gap-2">
                    {eventosAdmin.length == 0 && <p>Não há eventos registrados para hoje nessa sala</p>}
                    {!loadingEventos && !erroEventos && eventosAdmin.length > 0 &&
                      eventosAdmin
                      .sort((a, b) => {
                          const [hA, mA] = a.horario.horaInicio.slice(11, 16).split(":").map(Number)
                          const [hB, mB] = b.horario.horaInicio.slice(11, 16).split(":").map(Number)

                          return hA * 60 + mA - (hB * 60 + mB)
                        })
                      .map((evento) => {
                        return (
                          <CartaoEvento
                          key={evento.id}
                          tipoReserva={evento.tipoReserva}
                          tipoEvento={evento.tipoEvento}
                          dataInicio={evento.dataInicio}
                          dataFim={evento.dataFim}
                          horario={evento.horario.nome}
                          turma={evento.turma}
                          ministrante={evento.ministrante.nome}
                          horaInicioEvento={evento.horario.horaInicio}
                          horaFimEvento={evento.horario.horaFim}
                          />
                        )
                      })
                    }
                  </div>
                )}
            </div>
            {/* } */}
          {/* MONTAR DIV AQUI PARA RENDERIZAR OS DETALHES DA SALA E OS EVENTOS DO DIA */}
    </div>
  );
}