'use client'

import { useUser } from "@/hooks/useUser"
import { deleteSolicitacaoById, getEventosByUsuario, updateReservaById } from "@/lib/api/reservas/api"
import { EventoAdmin, UpdateReservaDto } from "@/types/evento"
import { useState, useEffect } from "react"
import { BiCheckCircle, BiXCircle } from "react-icons/bi"
import { BsClock } from "react-icons/bs"

import { FaCheckCircle } from "react-icons/fa";
import { FaTimesCircle } from "react-icons/fa";
import { FaClock } from "react-icons/fa";
import ConfirmarAcao from "@/components/modalConfirmacao"
import { CardResumo } from "@/components/cartaoResumoReserva"
import { SetorAdmin } from "@/types/setor"
import { getSetores } from "@/lib/api/setores/api"
import DropdownAcoesReserva from "@/components/dropdownAcoesReserva"
import ModalAlocacaoSala from "@/components/modalSelecaoSala"
import formataHorarioLocal from "@/utils/formataHora"
import criarDataLocalSemHorario from "@/utils/criaDataSemHorario"

export default function Home(){
    const [reservas, setReservas] = useState<EventoAdmin[]>([])
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [erroBuscarReservas, setErroBuscarReservas] = useState<boolean>(false)
    const [isLoadingReservas, setIsLoadingReservas] = useState<boolean>(false)
    const [mensagemErroBuscarReservas, setMensagemErroBuscarReservas] = useState<string>("")
    const [setores, setSetores] = useState<SetorAdmin[]>([])
    const [erroBuscarSetores, setErroBuscarSetores] = useState<boolean>(false)
    const [isLoadingSetores, setIsLoadingSetores] = useState<boolean>(false)
    const [mensagemErroBuscarSetores, setMensagemErroBuscarSetores] = useState<string>("")

    const [tipoAcao, setTipoAcao] = useState<"APROVAR" | "RECUSAR" | "DELETAR" | "CANCELAR" | null>(null);
    const [eventoSelecionado, setEventoSelecionado] = useState<EventoAdmin | null>(null);
    const [isModalAprovacaoOpen, setIsModalAprovacaoOpen] = useState<boolean>(false)
    const [isReservaAtualizada, setIsReservaAtualizada] = useState<boolean>(false)
    const [isReservaDeletada, setIsReservaDeletada] = useState<boolean>(false)
    const [erroAtualizarReserva, setErroAtualizarReserva] = useState<boolean>(false)
    const [mensagemErroAtualizarReserva, setMensagemErroAtualizarReserva] = useState<string>("")
    const user = useUser()

    useEffect(() => {
        if(!user) return
        setIsLoadingReservas(true)
        setIsLoadingSetores(true)
        buscarReservas(user.sub)
        buscarSetores()
    }, [user])

    useEffect(() => {
        if(!user) return
        if(isReservaAtualizada){
            setIsLoadingReservas(true)
            buscarReservas(user.sub)
        }
    }, [user, isReservaAtualizada])

    async function buscarSetores(){
        try {
        const setores = await getSetores()
        setSetores(setores)
        } catch (err) {
            const mensagem = err instanceof Error ? err.message : String(err);
            console.error("Erro ao buscar os setores:", mensagem);
            setErroBuscarSetores(true)
            setMensagemErroBuscarSetores("Não foi possível buscar os setores")
        } finally {
            setIsLoadingSetores(false)
        }
    }
    async function buscarReservas(usuarioId: string) {
        try {
            const reservas = await getEventosByUsuario(usuarioId)
            setReservas(reservas)
        } catch (err) {
            const mensagem = err instanceof Error ? err.message : String(err);
            console.error("Erro ao buscar os horários:", mensagem);
            setErroBuscarReservas(true)
            setMensagemErroBuscarReservas("Não foi possível buscar as reservas")
        } finally {
            setIsLoadingReservas(false)
        }
    }

    function corStatus(status: string) {
        const baseClasses = "flex justify-center items-center h-full";

        switch (status) {
            case "APROVADA":
            return (
                <div className={`${baseClasses} text-green-600`} title="Aprovada">
                <FaCheckCircle className="text-lg" />
                </div>
            );

            case "CANCELADA":
            return (
                <div className={`${baseClasses} text-red-600`} title="Cancelada">
                <FaTimesCircle className="text-lg" />
                </div>
            );

            case "PENDENTE":
            return (
                <div className={`${baseClasses} text-amber-500`} title="Pendente">
                <FaClock className="text-lg animate-pulse" />
                </div>
            );

            default:
            return (
                <div className={`${baseClasses} text-gray-400`} title="Desconhecido">
                —
                </div>
            );
        }
    }

    function abrirModal(acao: "APROVAR" | "RECUSAR" | "DELETAR" | "CANCELAR", evento: EventoAdmin) {
        setTipoAcao(acao);
        if(acao === "APROVAR"){
            setEventoSelecionado(evento);;
            setIsModalAprovacaoOpen(true)
            return
        }
        setEventoSelecionado(evento);
        setIsModalOpen(true);
    }

    //executa a função após confirmação dada pelos modais
    async function handleConfirmar() {
        if (!eventoSelecionado || !tipoAcao) return;
        switch (tipoAcao) {
        case "APROVAR":
            await handleAprovar(eventoSelecionado);
            break;
        case "CANCELAR":
        case "RECUSAR":
            await handleRecusar(eventoSelecionado);
            break;
        case "DELETAR":
            await handleDeletar(eventoSelecionado.id);
            break;
        }

        setIsModalOpen(false);
    }

    async function handleDeletar(eventoId: string){
        setIsLoadingReservas(true)
        try {
            await deleteSolicitacaoById(eventoId)
            setReservas((prev) => prev.filter((r) => r.id !== eventoId))
            setIsReservaDeletada(true)
            setTimeout(() => setIsReservaDeletada(false), 5000)
        } catch (err) {
            const mensagem = err instanceof Error ? err.message : String(err);
            console.error("Erro ao deletar a solicitação:", mensagem);
            setErroAtualizarReserva(true)
            setMensagemErroAtualizarReserva("Erro ao deletar a reserva")
            setTimeout(() => setErroAtualizarReserva(false), 3000)
        } finally {
            setIsLoadingReservas(false)
        }
    }

    async function handleRecusar(evento: EventoAdmin){
        setIsLoadingReservas(true)
        try {
            const reservaAtualizada = { id: evento.id, statusReserva: "CANCELADA"} as UpdateReservaDto
            await updateReservaById(reservaAtualizada)
            setIsReservaAtualizada(true)
        } catch (err) {
            const mensagem = err instanceof Error ? err.message : String(err);
            console.error("Erro ao atualizar a reserva:", mensagem);
            setErroAtualizarReserva(true)
            setMensagemErroAtualizarReserva("Erro ao atualizar a reserva")
            setTimeout(() => setErroAtualizarReserva(false), 3000)
        } finally {
            setTimeout(() => setIsReservaAtualizada(false), 3000)
            setIsLoadingReservas(false)
        }
    }

    async function handleAprovar(evento: EventoAdmin){
        console.log("Aprovada", evento.id)
    }

    return (
        <div className="p-8 space-y-8">
        {isLoadingReservas || isLoadingSetores || !user || !reservas ? (
            <div className="flex justify-center items-center">
                <p className="mt-6 text-gray-600">{"Carregando...".split("").map((char, i) => (
                  <span key={i} className="inline-block animate-bounce">{char}</span>
                ))}
                </p>
            </div>
        ) : (
        <>
        <h1 className="text-2xl font-bold">Bem-vindo, <span className="text-blue-950">{user ? user.nome : ""}</span></h1>
        <div className="grid grid-cols-3 gap-4">
            <CardResumo titulo="Aprovadas" cor="text-green-600" icone={<BiCheckCircle />} total={reservas.filter(r => r.statusReserva === "APROVADA").length} />
            <CardResumo titulo="Pendentes" cor="text-yellow-600" icone={<BsClock />} total={reservas.filter(r => r.statusReserva === "PENDENTE").length} />
            <CardResumo titulo="Canceladas" cor="text-red-600" icone={<BiXCircle />} total={reservas.filter(r => r.statusReserva === "CANCELADA").filter(r => r.solicitanteId === user.sub).length} />
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Minhas Reservas</h2>
            <table className="w-full border-collapse">
                <thead>
                    <tr className="border-b">
                    <th className="text-left p-2">Setor de preferência</th>
                    <th className="text-left p-2">Sala</th>
                    <th className="text-left p-2">Capacidade</th>
                    <th className="text-left p-2">Data inicio</th>
                    <th className="text-left p-2">Data fim</th>
                    <th className="text-left p-2">Horário</th>
                    <th className="text-left p-2">Ministrante</th>
                    <th className="text-left p-2">Aprovador</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {reservas.map((r) => {
                        const dataInicial = new Date(r.dataInicio).toISOString()
                        const dataFinal = new Date(r.dataFim).toISOString()
                        const setor = setores.find(s => s.id === r.setorPreferidoId)
                        if(r.solicitanteId !== user.sub && r.statusReserva === "CANCELADA") return
                        return (
                            <tr key={r.id} className="border-b hover:bg-gray-50 transition">
                                <td className="p-2">
                                    {setor ? (
                                    <div className="flex">
                                        <div className="flex items-center max-w-4 w-4">
                                            <p className="font-medium text-gray-800 text-left">{setor ? setor?.nome : ""}</p>
                                        </div>
                                            <div className="flex items-center max-w-6 w-6">
                                                <span className="mx-1 text-left text-gray-500">-</span>
                                            </div>
                                        <div className="flex items-center max-w-60">
                                            <p className="font-medium text-left text-gray-800">
                                                {setor ? setor?.descricao : "-"}
                                            </p>
                                        </div>
                                    </div>
                                    ) : "Sem preferência"}
                                </td>
                                <td className="p-2">{r.sala ? r.sala.numero : "-"}</td>
                                <td className="p-2 text-center">{r.qtdPessoas}</td>
                                <td className="p-2">{criarDataLocalSemHorario(dataInicial)}</td>
                                <td className="p-2">{criarDataLocalSemHorario(dataFinal)}</td>
                                <td className="p-2">
                                    <div className="flex justify-center">
                                        <div className="max-w-14 w-12">
                                            <p className="font-medium text-gray-800">{formataHorarioLocal(r.horaInicial)}</p>
                                        </div>
                                        <div className="max-w-8 w-8">
                                            <span className="mx-1 text-center text-gray-500">às</span>
                                        </div>
                                        <div className="max-w-14 w-14">
                                            <p className="font-medium text-gray-800">
                                                {formataHorarioLocal(r.horaFinal)}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-2">{r.ministrante.nome + " " + r.ministrante.sobrenome}</td>
                                <td className="p-2">{r.aprovador.nome + " " + r.aprovador.sobrenome}</td>
                                <td className="p-2 text-center">{corStatus(r.statusReserva)}</td>
                                <td className="p-2 relative">
                                    <DropdownAcoesReserva reserva={r} user={user} onAcao={(acao) => abrirModal(acao, r)}/>
                                </td>
                            </tr>
                    )})}
                </tbody>
            </table>
        </div>
        <div className="flex flex-col gap-2 items-center justify-center">
            {erroAtualizarReserva && (
              <div className="bg-red-400 font-bold text-white text-center p-3 rounded-lg shadow-lg z-50">
                <p>{mensagemErroAtualizarReserva}</p>
              </div>
            )}
            {erroBuscarReservas && (
              <div className="bg-red-400 font-bold text-white text-center p-3 rounded-lg shadow-lg z-50">
                <p>{mensagemErroBuscarReservas}</p>
              </div>
            )}
            {erroBuscarSetores && (
              <div className="bg-red-400 font-bold text-white text-center p-3 rounded-lg shadow-lg z-50">
                <p>{mensagemErroBuscarSetores}</p>
              </div>
            )}
            {isReservaAtualizada && (
              <div className="bg-green-400 font-bold text-white text-center p-3 rounded-lg shadow-lg z-50">
                <p>✅ Dados salvos com sucesso!</p>
              </div>
            )}
            {isReservaDeletada && (
              <div className="bg-green-400 font-bold text-white text-center p-3 rounded-lg shadow-lg z-50">
                <p>✅ Reserva excluída com sucesso!</p>
              </div>
            )}
        </div>
        </>
        )}

        <ModalAlocacaoSala
            reserva={eventoSelecionado}
            isOpen={isModalAprovacaoOpen}
            onConfirm={handleConfirmar}
            onClose={() => setIsModalAprovacaoOpen(false)}
        />

        <ConfirmarAcao
            isOpen={isModalOpen}
            title={
            tipoAcao === "APROVAR"
                ? "Aprovar Solicitação"
                : tipoAcao === "RECUSAR"
                ? "Recusar Solicitação"
                : tipoAcao === "CANCELAR"
                ? "Cancelar Solicitação"
                :"Excluir Solicitação"
            }
            message={
            tipoAcao === "APROVAR"
                ? "Deseja realmente aprovar esta solicitação?"
                : tipoAcao === "RECUSAR"
                ? "Deseja realmente recusar esta solicitação?"
                : tipoAcao === "CANCELAR"
                ? "Deseja realmente cancelar esta solicitação?"
                : "Deseja realmente excluir esta solicitação?"
            }
            confirmLabel={
            tipoAcao === "APROVAR"
                ? "Aprovar"
                : tipoAcao === "RECUSAR"
                ? "Recusar"
                : tipoAcao === "CANCELAR"
                ? "Cancelar"
                : "Excluir"
            }
            confirmColor={
            tipoAcao === "APROVAR"
                ? "bg-green-600 hover:bg-green-700"
                : tipoAcao === "RECUSAR"
                ? "bg-amber-600 hover:bg-amber-700"
                : "bg-red-600 hover:bg-red-700"
            }
            onConfirm={handleConfirmar}
            onCancel={() => setIsModalOpen(false)}
        />
        </div>
    )
}