import { SalaAdmin } from "@/types/sala";
import { useEffect, useState } from "react";

export default function ModalAlocacaoSala({ reserva, isOpen, onClose, onConfirm }) {
  const [salas, setSalas] = useState<SalaAdmin[]>([]);
  const [salaSelecionada, setSalaSelecionada] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && reserva) {
      buscarSalasCompatíveis();
    }
  }, [isOpen, reserva]);

  async function buscarSalasCompatíveis() {
    try {
      const res = await fetch(`/api/salas/compatíveis/${reserva.id}`);
      const data = await res.json();
      setSalas(data);
    } catch (err) {
      console.error("Erro ao buscar salas compatíveis", err);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[500px] max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4 text-blue-950">
          Alocar Sala para a Reserva
        </h2>

        {salas.length === 0 ? (
          <p className="text-gray-600 text-center">
            Nenhuma sala encontrada com as características solicitadas.
          </p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {salas.map((sala) => (
              <li
                key={sala.id}
                onClick={() => setSalaSelecionada(sala.id)}
                className={`p-3 cursor-pointer rounded hover:bg-blue-50 ${
                  salaSelecionada === sala.id ? "bg-blue-100 border-l-4 border-blue-600" : ""
                }`}
              >
                <h3 className="font-semibold text-blue-950">{sala.numero}</h3>
                <p className="text-sm text-gray-600">
                  Capacidade: {sala.capacidade} | Acessibilidade: {sala.temAcessibilidade ? "Sim" : "Não"}
                </p>
                <p className="text-xs text-gray-500">
                  Equipamentos: {sala.Equipamentos.map(e => e.tipoEquipamento).join(", ") || "Nenhum"}
                </p>
              </li>
            ))}
          </ul>
        )}

        <div className="flex justify-end gap-3 mt-6">
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