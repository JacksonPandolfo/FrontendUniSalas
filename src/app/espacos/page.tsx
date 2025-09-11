'use client'
import { useEffect, useState } from "react";
import { getSetores } from "../api/setores/route";
import { getSalasBloco, getSalasSetor } from "../api/salas/route";

import { SetorAdmin } from "@/types/setor";
import { BlocoAdmin } from "@/types/bloco";
import { SalaAdmin } from "@/types/sala";

import { CartaoSetor } from "@/components/cartaoSetor";
import { getBlocosSetor } from "../api/blocos/route";
import { CartaoBloco } from "@/components/cartaoBloco";

import { TbCircleArrowLeftFilled } from "react-icons/tb";
import { CartaoSala } from "@/components/cartaoSala";
import { getEventosSala } from "../api/reservas/route";
import { EventoAdmin } from "@/types/evento";
import { CartaoEvento } from "@/components/cartaoEvento";

export default function Espacos() {
  const [setoresAdmin, setSetoresAdmin] = useState<SetorAdmin[]>([]);
  const [blocosAdmin, setBlocosAdmin] = useState<BlocoAdmin[]>([])
  const [salasAdmin, setSalasAdmin] = useState<SalaAdmin[]>([]);
  const [eventosAdmin, setEventosAdmin] = useState<EventoAdmin[]>([]);

  const [setorSelecionado, setSetorSelecionado] = useState<number | null>(null)
  const [blocoSelecionado, setBlocoSelecionado] = useState<number | null>(null)
  const [salaSelecionada, setSalaSelecionada] = useState<number | null>(null)

  const [loadingSetores, setLoadingSetores] = useState(false);
  const [loadingBlocos, setLoadingBlocos] = useState(false);
  const [loadingSalas, setLoadingSalas] = useState(false);
  const [loadingEventos, setLoadingEventos] = useState(false)
  const [erro, setErro] = useState("");
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
        setErro("Não foi possível carregar os setores")
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

  async function carregarSalasSetor(setorId: number) {
    getSalasSetor(setorId)
    .then(setSalasAdmin)
    .catch((err) => {
        console.log(err)
        setErro("Não foi possível carregar as salas do setor")
      })
  }

  async function carregarBlocos(setorId: number) {
    getBlocosSetor(setorId)
    .then(setBlocosAdmin)
    .catch((err) => {
        console.log(err)
        setErro("Não foi possível carregar os blocos")
      })
    .finally(() => setLoadingBlocos(false))
  }

  useEffect(() => {
    if(blocoSelecionado !== null){
      setLoadingSalas(true)
      carregarSalas(blocoSelecionado)
    }
  }, [blocoSelecionado])

  async function carregarSalas(blocoId: number) {
    getSalasBloco(blocoId)
    .then(setSalasAdmin)
    .catch((err) => {
        console.log(err)
        setErro("Não foi possível carregar as salas")
      })
    .finally(() => setLoadingSalas(false))
  }

  useEffect(() => {
    if(salaSelecionada !== null){
      setLoadingEventos(true)
      carregarEventosSala(salaSelecionada, inicioDia, fimDia)
    }
  }, [salaSelecionada])

  async function carregarEventosSala(salaId: number, dataInicio: Date, dataFim: Date) {
    try {
      setLoadingEventos(true)
      setErroEventos("")
      const eventos = await getEventosSala(salaId, dataInicio, dataFim)
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
    <div className="flex flex-col items-center justify-center min-h-screen">
        {loadingSetores ? (
          <p className="mt-6 text-gray-600">Carregando setores...</p>
        ) : erro ? (
          <p className="mt-6 text-gray-600">{erro}</p>
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
        ) : erro ? (
          <p className="mt-6 text-gray-600">{erro}</p>
        ) : ( blocosAdmin.length > 0 && (
          <div>
            {setorSelecionado && !blocoSelecionado ? (
              <div className="flex justify-center items-center">
                <button className="border-2 flex gap-2 items-center border-blue-950 text-blue-950 font-poppins rounded-2xl p-2 hover:cursor-pointer hover:bg-blue-950 hover:text-white hover:scale-105 transition-all transform duration-500"
                  onClick={() => {setSetorSelecionado(null)
                                  setErro("")
                          }}>
                    <TbCircleArrowLeftFilled size={30}/> Voltar aos setores</button>
              </div>
            ) : ("")}
            <div className="flex flex-wrap justify-center gap-3 my-4">
              {setorSelecionado && !blocoSelecionado &&
                blocosAdmin
                .filter((bloco) => bloco.setorId === setorSelecionado)
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

          {loadingSalas ? (
            <p className="mt-6 text-gray-600">Carregando salas...</p>
          ) : erro ? (
            <p className="mt-6 text-gray-600">{erro}</p>
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
                <div className="flex flex-wrap justify-center gap-2 mt-4">
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
                          onClick={() => setSalaSelecionada(sala.id)}
                        />
                      )
                    })
                  }
                </div>
              )}
            </div>
            )
          )}

          {loadingEventos ? (
            <p className="mt-6 text-gray-600">Carregando eventos da sala...</p>
          ) : erroEventos ? (
            <p className="mt-6 text-gray-600">{erroEventos}</p>
          ) : (
            <div className="flex flex-wrap justify-center gap-2 mt-4">
          {!loadingEventos && !erroEventos && eventosAdmin.length > 0 &&
              eventosAdmin.map((evento) => {
                return (
                  <CartaoEvento
                  key={evento.id}
                  {...evento}
                  tipoReserva={evento.tipoReserva}
                  tipoEvento={evento.tipoEvento}
                  dataInicio={evento.dataInicio}
                  dataFim={evento.dataFim}
                  horario={evento.horario.nome}
                  nomeTurma={evento.turma?.nome ?? ""}
                  ministrante={evento.ministrante.nome}
                  horaInicioEvento={evento.horario.horaInicio}
                  horaFimEvento={evento.horario.horaFim}
                  />
                )
              })}
          </div>
          )}
    </div>
  );
}