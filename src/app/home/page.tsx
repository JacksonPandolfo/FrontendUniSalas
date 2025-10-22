'use client'

import { useUser } from "@/hooks/useUser"
import { getEventosByUsuario } from "@/lib/api/reservas/api"
import { EventoAdmin } from "@/types/evento"
import { useState, useEffect, useRef } from "react"
import { BiCheckCircle, BiXCircle } from "react-icons/bi"
import { BsClock } from "react-icons/bs"

import { FaCheckCircle } from "react-icons/fa";
import { FaTimesCircle } from "react-icons/fa";
import { FaClock } from "react-icons/fa";
import ConfirmarAcao from "@/components/modalConfirmacao"
import { CardResumo } from "@/components/cartaoResumoReserva"
import { SetorAdmin } from "@/types/setor"
import { getSetores } from "@/lib/api/setores/api"
import { tipoMobiliarioMap } from "@/utils/tipoMobiliarioMap"
import { tipoEquipamentoMap } from "@/utils/tipoEquipamentoMap"
import DropdownAcoesReserva from "@/components/dropdownAcoesReserva"

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

    const [tipoAcao, setTipoAcao] = useState<"APROVAR" | "RECUSAR" | "DELETAR" | null>(null);
    const [eventoSelecionado, setEventoSelecionado] = useState<string | null>(null);
    const [eventoAprovacaoSelecionado, setEventoAprovacaoSelecionado] = useState<EventoAdmin | null>(null);
    const user = useUser()

    useEffect(() => {
        if(!user) return
        setIsLoadingReservas(true)
        setErroBuscarSetores(true)
        buscarReservas(user.sub)
        buscarSetores()
    }, [user])

    function formataHorarioLocal(horario: Date) {
        const [h, m] = String(horario).slice(11, 16).split(":").map(Number);
        const horarioFormatado = String(h).padStart(2, "0") + ":" + String(m).padStart(2, "0")

        return horarioFormatado;
    }

    function criarDataLocal(isoString: string) {
        const d = new Date(isoString);
        const year = d.getUTCFullYear();
        const month = d.getUTCMonth(); // 0-indexed
        const day = d.getUTCDate();

        const localDate = new Date(year, month, day)
        return localDate.toLocaleDateString();
    }

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
            console.log(reservas)
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

    function abrirModal(acao: "APROVAR" | "RECUSAR" | "DELETAR", evento: EventoAdmin) {
        setTipoAcao(acao);
        if(acao === "APROVAR"){
            setEventoAprovacaoSelecionado(evento);
        }
        setEventoSelecionado(evento.id);
        setIsModalOpen(true);
    }

    async function handleConfirmar() {
        if (!eventoSelecionado || !tipoAcao || !eventoAprovacaoSelecionado) return;

        switch (tipoAcao) {
        case "APROVAR":
            await handleAprovar(eventoAprovacaoSelecionado);
            break;
        case "RECUSAR":
            await handleRecusar(eventoSelecionado);
            break;
        case "DELETAR":
            await handleDeletar(eventoSelecionado);
            break;
        }

        setIsModalOpen(false);
    }

    async function handleDeletar(eventoId: string){
        console.log("Deletada", eventoId)
    }
    async function handleRecusar(eventoId: string){
        console.log("Cancelada", eventoId)
    }
    async function handleAprovar(evento: EventoAdmin){
        console.log("Aprovada", evento.id)
    }

    return (
        <div className="p-8 space-y-8">
        {isLoadingReservas || isLoadingSetores || !user ? (
            <div className="flex justify-center items-center">
                <p className="mt-6 text-gray-600">{"Carregando...".split("").map((char, i) => (
                  <span key={i} className="inline-block animate-bounce">{char}</span>
                ))}
                </p>
            </div>
        ) : (
        <>
        <h1 className="text-2xl font-bold">Bem-vindo, <span className="text-blue-950">{user.nome}</span></h1>
        <div className="grid grid-cols-3 gap-4">
            <CardResumo titulo="Aprovadas" cor="text-green-600" icone={<BiCheckCircle />} total={reservas.filter(r => r.statusReserva === "APROVADA").length} />
            <CardResumo titulo="Pendentes" cor="text-yellow-600" icone={<BsClock />} total={reservas.filter(r => r.statusReserva === "PENDENTE").length} />
            <CardResumo titulo="Canceladas" cor="text-red-600" icone={<BiXCircle />} total={reservas.filter(r => r.statusReserva === "CANCELADA").length} />
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Minhas Reservas</h2>
            <table className="w-full border-collapse">
                <thead>
                    <tr className="border-b">
                    <th className="text-left p-2">Sala</th>
                    <th className="text-left p-2">Setor de preferência</th>
                    <th className="text-left p-2">Lugares</th>
                    {/* <th className="text-left p-2">Móveis</th>
                    <th className="text-left p-2">Equipamentos</th>
                    <th className="text-left p-2">Acessibilidade</th> */}
                    <th className="text-left p-2">Data inicio</th>
                    <th className="text-left p-2">Data fim</th>
                    <th className="text-left p-2">Horário</th>
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
                        return (
                    <tr key={r.id} className="border-b hover:bg-gray-50 transition">
                        <td className="p-2">{r.sala?.numero ? r.sala.numero : "-"}</td>
                        <td className="p-2">{setor?.nome + " - " + setor?.descricao }</td>
                        <td className="p-2 text-center">{r.qtdPessoas}</td>
                        {/* <td className="p-2 max-w-64">{r.mobiliarios.map(m => tipoMobiliarioMap[m]).join(", ")}</td>
                        <td className="p-2 max-w-64">{r.equipamentos.map(e => tipoEquipamentoMap[e]).join(", ")}</td>
                        <td className="p-2">{r.acessibilidade ? "Com acessibilidade" : "Sem acessibilidade"}</td> */}
                        <td className="p-2">{criarDataLocal(dataInicial)}</td>
                        <td className="p-2">{criarDataLocal(dataFinal)}</td>
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
                        <td className="p-2">{r.aprovador.nome + " " + r.aprovador.sobrenome}</td>
                        <td className="p-2 text-center">{corStatus(r.statusReserva)}</td>
                        <td className="p-2">
                            <DropdownAcoesReserva reserva={r} user={user} onAcao={(acao) => abrirModal(acao, r)}/>
                        </td>
                    </tr>
                    )})}
                </tbody>
            </table>
        </div>
        </>
        )}

        <ConfirmarAcao
            isOpen={isModalOpen}
            title={
            tipoAcao === "APROVAR"
                ? "Aprovar Solicitação"
                : tipoAcao === "RECUSAR"
                ? "Recusar Solicitação"
                : "Excluir Solicitação"
            }
            message={
            tipoAcao === "APROVAR"
                ? "Deseja realmente aprovar esta solicitação?"
                : tipoAcao === "RECUSAR"
                ? "Deseja realmente recusar esta solicitação?"
                : "Deseja realmente excluir esta solicitação?"
            }
            confirmLabel={
            tipoAcao === "APROVAR"
                ? "Aprovar"
                : tipoAcao === "RECUSAR"
                ? "Recusar"
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