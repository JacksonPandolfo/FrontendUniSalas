/* eslint-disable react-hooks/exhaustive-deps */
import { getSalasCompativeisComReserva } from "@/lib/api/salas/api";
import { EventoAdmin } from "@/types/evento";
import { SalaAdmin } from "@/types/sala";
import criarDataLocalSemHorario from "@/utils/criaDataSemHorario";
import formataHorarioLocal from "@/utils/formataHora";
import { tipoEquipamentoMap } from "@/utils/tipoEquipamentoMap";
import { tipoMobiliarioMap } from "@/utils/tipoMobiliarioMap";
import { useEffect, useState } from "react";
import { FaExclamationTriangle } from "react-icons/fa";

export default function ModalAlocacaoSala({
  reserva,
  isOpen,
  onClose,
  onConfirm,
}: {
  reserva: EventoAdmin | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (salaId: string | null) => void;
}) {

  const [salas, setSalas] = useState<SalaAdmin[]>([]);
  const [salaSelecionada, setSalaSelecionada] = useState<string | null>(null);
  const [isLoadingSalas, setIsLoadingSalas] = useState<boolean>(false)

  useEffect(() => {
    if (isOpen && reserva) {
      setIsLoadingSalas(true)
      buscarSalasCompatíveis();
    }
  }, [isOpen, reserva]);

  if(!reserva) return

  async function buscarSalasCompatíveis() {
    if(!reserva) return
    try {
      const salas = await getSalasCompativeisComReserva(reserva.id)
      setSalas(salas);
      setTimeout(() => setIsLoadingSalas(false), 3000)
    } catch (err) {
      console.error("Erro ao buscar salas compatíveis", err);
    }
  }
  const dataInicial = new Date(reserva.dataInicio).toISOString()
  const dataFinal = new Date(reserva.dataFim).toISOString()

  if (!isOpen) return null;

  return (
  <div className="fixed inset-0 bg-gray-900/40 flex items-center justify-center z-50 backdrop-blur-sm">
    <div className="bg-white rounded-lg shadow-lg w-[900px] max-h-[80vh] flex flex-col">
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold text-blue-950">
          Alocar sala para a reserva
        </h2>
      </div>

      {/* 🔹 Conteúdo dividido em duas colunas */}
      <div className="flex flex-1 overflow-hidden">
        {/* 🔸 Coluna Esquerda — informações da reserva */}
        <div className="w-1/2 p-6 border-r overflow-y-auto">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            Características da Reserva
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li><span className="font-semibold">Data:</span> {criarDataLocalSemHorario(dataInicial)} até {criarDataLocalSemHorario(dataFinal)}</li>
            <li><span className="font-semibold">Horário:</span> {formataHorarioLocal(reserva.horaInicial)} - {formataHorarioLocal(reserva.horaFinal)}</li>
            <li><span className="font-semibold">Quantidade de Pessoas:</span> {reserva.qtdPessoas}</li>
            <li><span className="font-semibold">Acessibilidade:</span> {reserva.acessibilidade ? "Sim" : "Não"}</li>
            <li><span className="font-semibold">Setor preferido:</span> {reserva.setor ? reserva.setor.nome + " - " + reserva.setor.descricao : "Não informado"}</li>
            <li>
              <span className="font-semibold">Equipamentos:</span>{" "}
              {reserva.equipamentos?.length
                ? reserva.equipamentos.map(e => tipoEquipamentoMap[e]).join(", ")
                : "Nenhum"}
            </li>
            <li>
              <span className="font-semibold">Mobiliários:</span>{" "}
              {reserva.mobiliarios?.length
                ? reserva.mobiliarios.map(m => tipoMobiliarioMap[m]).join(", ")
                : "Nenhum"}
            </li>
          </ul>
        </div>

        {/* 🔸 Coluna Direita — lista de salas (scroll só aqui) */}
        <div className="w-1/2 p-6 overflow-y-auto">
          {isLoadingSalas ? (
            <div className="flex items-center justify-center">
              <p className="mt-6 text-gray-600">{"Carregando...".split("").map((char, i) => (
                <span key={i} className="inline-block animate-bounce">{char}</span>
              ))}</p>
            </div>
          ) : salas.length === 0 ?
          (
            <p className="text-gray-600 text-center">
              Nenhuma sala encontrada com as características solicitadas.
            </p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {salas
              .sort((a, b) => {
                const nomeSetorA = a.bloco.setor.nome
                const nomeSetorB = b.bloco.setor.nome
                const numeroBlocoA = a.bloco.numero
                const numeroBlocoB = b.bloco.numero
                const numeroSalaA = a.numero
                const numeroSalaB = b.numero

                const setorDiferente = nomeSetorA.localeCompare(nomeSetorB, 'pt-BR', {
                  numeric: true, sensitivity: 'base'
                })
                if(setorDiferente !== 0) return setorDiferente

                const blocoDiferente = numeroBlocoA - numeroBlocoB
                if(blocoDiferente !== 0) return blocoDiferente

                return numeroSalaA - numeroSalaB
              })
              .map((sala) => {
                const naoAtendeCapacidade = (reserva.qtdPessoas > sala.capacidade)
                const naoAtendeAcessibilidade = (reserva.acessibilidade && !sala.temAcessibilidade)
                const naoAtendeMobiliarios =
                  (reserva.mobiliarios?.length > 0 &&
                    !reserva.mobiliarios.every((mob) =>
                      sala.Mobiliarios.some((s) => s.tipoMobiliario === mob)
                    ))
                const naoAtendeEquipamentos =
                  (reserva.equipamentos?.length > 0 &&
                    !reserva.equipamentos.every((eq) =>
                      sala.Equipamentos.some((s) => s.tipoEquipamento === eq)
                  ));
                const naoAtendeSetorPreferido = (reserva.setorPreferidoId ? reserva.setorPreferidoId !== sala.bloco.setor.id : false)

                const naoAtendeRequisitos = (naoAtendeAcessibilidade || naoAtendeCapacidade || naoAtendeMobiliarios || naoAtendeEquipamentos || naoAtendeSetorPreferido)

                return (
                <li
                  key={sala.id}
                  onClick={() => setSalaSelecionada(sala.id)}
                  className={`p-3 cursor-pointer rounded hover:bg-blue-50 transition ${
                    salaSelecionada === sala.id
                      ? "bg-blue-100 border-l-4 border-blue-600"
                      : ""
                  }`}
                >
                  <div className="flex items-center justify-between gap-10">
                    <div>
                      <h3 className="font-semibold text-blue-950">
                        Sala {sala.bloco.setor.nome + String(sala.bloco.numero).padStart(2, "0") + " - " + sala.numero}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Capacidade: {sala.capacidade} | Acessibilidade:{" "}
                        {sala.temAcessibilidade ? "Sim" : "Não"}
                      </p>
                      <p className="text-xs text-gray-500">
                        Equipamentos:{" "}
                        {sala.Equipamentos?.map((e) => tipoEquipamentoMap[e.tipoEquipamento]).join(", ") ||
                          "Nenhum"}
                      </p>
                      <p className="text-xs text-gray-500">
                        Mobiliarios:{" "}
                        {sala.Mobiliarios?.map((e) => tipoMobiliarioMap[e.tipoMobiliario]).join(", ") ||
                          "Nenhum"}
                      </p>
                    </div>
                    { naoAtendeRequisitos &&
                      <FaExclamationTriangle
                        className="text-yellow-400"
                        size={36}
                        title={naoAtendeAcessibilidade
                                ? "Não atende a acessibilidade"
                                : naoAtendeCapacidade
                                ? "Não atende a capacidade"
                                : naoAtendeEquipamentos
                                ? "Não atende aos equipamentos"
                                : naoAtendeMobiliarios
                                ? "Não atende aos mobiliários"
                                : naoAtendeSetorPreferido
                                ? "Não atende ao setor preferido"
                                : ""}/>
                    }
                  </div>
                </li>
              )})}
            </ul>
          )}
        </div>
      </div>

      {/* 🔹 Rodapé fixo */}
      <div className="p-4 border-t flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Cancelar
        </button>
        <button
          disabled={!salaSelecionada}
          onClick={() => onConfirm(salaSelecionada)}
          className={`px-4 py-2 text-white rounded ${
            salaSelecionada
              ? "bg-green-600 hover:bg-green-700"
              : "bg-green-300 cursor-not-allowed"
          }`}
        >
          Confirmar Alocação
        </button>
      </div>
    </div>
  </div>
);
}