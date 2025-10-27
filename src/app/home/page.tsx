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
import { FcTodoList } from "react-icons/fc"

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
    async function handleConfirmar(salaId: string | null) {
        if (!eventoSelecionado || !tipoAcao || !salaId) return;
        switch (tipoAcao) {
        case "APROVAR":
            await handleAprovar(eventoSelecionado, salaId);
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

    async function handleAprovar(evento: EventoAdmin, salaId: string){
        setIsLoadingReservas(true)
        try {
            const reservaAtualizada = { id: evento.id, statusReserva: "APROVADA", salaId: salaId} as UpdateReservaDto
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
            setIsModalAprovacaoOpen(false)
        }
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
        <div className="grid grid-cols-4 gap-4">
            <CardResumo titulo="Aprovadas" cor="text-green-600" icone={<BiCheckCircle size={24}/>} total={reservas.filter(r => r.solicitanteId === user.sub && r.statusReserva === "APROVADA").length} />
            <CardResumo titulo="Solicitações Pendentes" cor="text-yellow-600" icone={<BsClock size={20}/>} total={reservas.filter(r => r.solicitanteId === user.sub && r.statusReserva === "PENDENTE").length} />
            <CardResumo titulo="Canceladas" cor="text-red-600" icone={<BiXCircle size={24}/>} total={reservas.filter(r => r.solicitanteId === user.sub && r.statusReserva === "CANCELADA").length} />
            <CardResumo titulo="Ações Pendentes" cor="text-yellow-600" icone={<FaClock size={20.6}/>} total={reservas.filter(r => r.aprovadorId === user.sub && r.statusReserva === "PENDENTE").length} />
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                <FcTodoList size={30}/> Para Aprovação
            </h2>

            <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-inner max-h-[600px] overflow-y-auto">
                <table className="min-w-full text-sm text-gray-700">
                <thead className="bg-gradient-to-b from-blue-100 to-blue-50 sticky top-0 z-10">
                    <tr>

                    {[
                        "Setor de preferência",
                        "Capacidade Necessária",
                        "Data início",
                        "Data fim",
                        "Horário",
                        "Ministrante",
                        "Solicitante",
                        "Status",
                        "Ações",
                    ].map((titulo) => (
                        <th
                        key={titulo}
                        className={`${titulo === "Horário" ? "text-center" : "text-left"} px-4 py-3 font-semibold text-gray-700 uppercase text-xs tracking-wider border-b border-gray-200`}
                        >
                        {titulo}
                        </th>
                    ))}
                    </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                    {reservas
                    .filter(
                        (r) => r.statusReserva === "PENDENTE" && r.aprovadorId === user.sub
                    )
                    .sort((a, b) => {
                        const horaInicioA = formataHorarioLocal(a.horaInicial);
                        const horaInicioB = formataHorarioLocal(b.horaInicial);
                        const [hA, mA] = horaInicioA.split(":").map(Number);
                        const [hB, mB] = horaInicioB.split(":").map(Number);
                        const dataHoraA = new Date(a.dataInicio);
                        dataHoraA.setHours(hA, mA);
                        const dataHoraB = new Date(b.dataInicio);
                        dataHoraB.setHours(hB, mB);
                        return dataHoraA.getTime() - dataHoraB.getTime();
                    })
                    .map((r) => {
                        const dataInicial = new Date(r.dataInicio).toISOString();
                        const dataFinal = new Date(r.dataFim).toISOString();
                        const setor = setores.find((s) => s.id === r.setorPreferidoId);
                        if (r.solicitanteId !== user.sub && r.statusReserva === "CANCELADA")
                        return;

                        return (
                        <tr
                            key={r.id}
                            className="hover:bg-gray-50 transition-colors duration-150"
                        >
                            <td className="p-3">
                            {setor ? (
                                <div className="flex items-center gap-1 text-gray-800">
                                <p className="font-medium">{setor.nome}</p>
                                <span className="text-gray-400">-</span>
                                <p className="text-gray-700 truncate max-w-[150px]">{setor.descricao}</p>
                                </div>
                            ) : (
                                <span className="italic text-gray-400">Sem preferência</span>
                            )}
                            </td>
                            <td className="p-3 text-center">{r.qtdPessoas}</td>
                            <td className="p-3">{criarDataLocalSemHorario(dataInicial)}</td>
                            <td className="p-3">{criarDataLocalSemHorario(dataFinal)}</td>

                            <td className="p-3">
                            <div className="flex justify-center text-gray-800">
                                <span>{formataHorarioLocal(r.horaInicial)}</span>
                                <span className="mx-1 text-gray-500">às</span>
                                <span>{formataHorarioLocal(r.horaFinal)}</span>
                            </div>
                            </td>

                            <td className="p-3 text-gray-800 whitespace-nowrap">
                            {r.ministrante.nome} {r.ministrante.sobrenome}
                            </td>
                            <td className="p-3 text-gray-800 whitespace-nowrap">
                            {r.solicitante.nome} {r.solicitante.sobrenome}
                            </td>

                            <td className="p-3 text-center">
                            {corStatus(r.statusReserva)}
                            </td>

                            <td className="p-3 relative">
                            <DropdownAcoesReserva
                                reserva={r}
                                user={user}
                                onAcao={(acao) => abrirModal(acao, r)}
                            />
                            </td>
                        </tr>
                        );
                    })}
                </tbody>
                </table>
            </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                Minhas Reservas
            </h2>

            <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-inner max-h-[600px] overflow-y-auto">
                <table className="min-w-full text-sm text-gray-700">
                <thead className="bg-gradient-to-b from-blue-100 to-blue-50 sticky top-0 z-10">
                    <tr>
                    {[
                        "Sala",
                        "Capacidade",
                        "Data início",
                        "Data fim",
                        "Horário",
                        "Ministrante",
                        "Aprovador",
                        "Status",
                        "Ações",
                    ].map((titulo) => (
                        <th
                        key={titulo}
                        className={`${titulo === "Horário" ? "text-center" : "text-left"} px-4 py-3 font-semibold text-gray-700 uppercase text-xs tracking-wider border-b border-gray-200`}
                        >
                        {titulo}
                        </th>
                    ))}
                    </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                    {reservas
                    .filter((r) => r.solicitanteId === user.sub)
                    .sort((a, b) => {
                        const horaInicioA = formataHorarioLocal(a.horaInicial);
                        const horaInicioB = formataHorarioLocal(b.horaInicial);
                        const [hA, mA] = horaInicioA.split(":").map(Number);
                        const [hB, mB] = horaInicioB.split(":").map(Number);
                        const dataHoraA = new Date(a.dataInicio);
                        dataHoraA.setHours(hA, mA);
                        const dataHoraB = new Date(b.dataInicio);
                        dataHoraB.setHours(hB, mB);
                        return dataHoraA.getTime() - dataHoraB.getTime();
                    })
                    .map((r) => {
                        const dataInicial = new Date(r.dataInicio).toISOString();
                        const dataFinal = new Date(r.dataFim).toISOString();
                        if (r.solicitanteId !== user.sub && r.statusReserva === "CANCELADA")
                        return null;

                        return (
                        <tr
                            key={r.id}
                            className="hover:bg-blue-50 transition-all duration-150 ease-in-out relative"
                        >
                            <td className="px-4 py-3 font-medium text-gray-800 text-center">
                            {r.sala ? r.sala.bloco.setor.nome + String(r.sala.bloco.numero).padStart(2, "0") + " " + r.sala.numero : "-"}
                            </td>


                            <td className="px-4 py-3 text-center text-gray-700">
                            {r.sala ? r.sala.capacidade : "-"}
                            </td>


                            <td className="px-4 py-3 text-gray-700">
                            {criarDataLocalSemHorario(dataInicial)}
                            </td>
                            <td className="px-4 py-3 text-gray-700">
                            {criarDataLocalSemHorario(dataFinal)}
                            </td>


                            <td className="px-4 py-3">
                            <div className="flex justify-between gap-1 items-center text-gray-800">
                                <div className="max-w-12 min-w-10 w-fit text-left">
                                    <span>{formataHorarioLocal(r.horaInicial)}</span>
                                </div>
                                <div className="w-fit">
                                    <span className="text-gray-400">→</span>
                                </div>
                                <div className="max-w-12 min-w-10 w-fit text-left">
                                    <span>{formataHorarioLocal(r.horaFinal)}</span>
                                </div>
                            </div>
                            </td>


                            <td className="px-4 py-3 font-medium text-gray-700">
                            {r.ministrante.nome} {r.ministrante.sobrenome}
                            </td>


                            <td className="px-4 py-3 text-gray-700">
                            {r.aprovador.nome} {r.aprovador.sobrenome}
                            </td>


                            <td className="px-4 py-3 text-center font-semibold">
                            {corStatus(r.statusReserva)}
                            </td>

                            {/* Ações */}
                            <td className="px-4 py-3 text-center">
                            <DropdownAcoesReserva
                                reserva={r}
                                user={user}
                                onAcao={(acao) => abrirModal(acao, r)}
                            />
                            </td>
                        </tr>
                        );
                    })}
                </tbody>
                </table>
            </div>
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
            tipoAcao === "RECUSAR"
                ? "Recusar Solicitação"
                : tipoAcao === "CANCELAR"
                ? "Cancelar Solicitação"
                :"Excluir Solicitação"
            }
            message={
            tipoAcao === "RECUSAR"
                ? "Deseja realmente recusar esta solicitação?"
                : tipoAcao === "CANCELAR"
                ? "Deseja realmente cancelar esta solicitação?"
                : "Deseja realmente excluir esta solicitação?"
            }
            confirmLabel={
            tipoAcao === "RECUSAR"
                ? "Recusar"
                : tipoAcao === "CANCELAR"
                ? "Cancelar Solicitação"
                : "Excluir"
            }
            confirmColor={
            tipoAcao === "RECUSAR"
                ? "bg-amber-600 hover:bg-amber-700"
                : "bg-red-600 hover:bg-red-700"
            }
            onConfirm={handleConfirmar}
            onCancel={() => setIsModalOpen(false)}
        />
        </div>
    )
}