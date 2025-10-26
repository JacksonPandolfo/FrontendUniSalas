import { EventoAdmin } from "@/types/evento";
import { UsuarioPayload } from "@/types/usuario";
import { useState, useRef, useEffect } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";

export default function DropdownAcoesReserva({ reserva, user, onAcao }: {reserva: EventoAdmin, user: UsuarioPayload, onAcao: (acao: "APROVAR" | "RECUSAR" | "CANCELAR" | "DELETAR", reservaId: string) => void}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fecha o menu ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex justify-center" ref={dropdownRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="p-2 rounded hover:bg-gray-200 transition-colors"
      >
        <BsThreeDotsVertical size={18} />
      </button>

      {open && (
        <div className="absolute right-0 top-0.5 mt-2 w-22 bg-white border border-gray-200 rounded shadow-lg z-50">
          <ul className="text-sm text-gray-700">
            {reserva.statusReserva === "PENDENTE" && user?.sub === reserva.aprovadorId && (
              <>
                <li>
                  <button
                    onClick={() => {
                      onAcao("APROVAR", reserva.id);
                      setOpen(false);
                    }}
                    className="w-full text-center p-2 hover:bg-green-100 text-green-700"
                  >
                    Aprovar
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      onAcao("RECUSAR", reserva.id);
                      setOpen(false);
                    }}
                    className="w-full text-center p-2 hover:bg-yellow-100 text-yellow-700"
                  >
                    Recusar
                  </button>
                </li>
              </>
            )}

            {reserva.statusReserva !== "CANCELADA" && user?.sub === reserva.solicitanteId && (
              <li>
                <button
                  onClick={() => {
                    onAcao("CANCELAR", reserva.id);
                    setOpen(false);
                  }}
                  className="w-full text-center p-2 hover:bg-red-100 text-red-700"
                >
                  Cancelar
                </button>
              </li>
            )}

            {reserva.statusReserva === "CANCELADA" && user?.sub === reserva.solicitanteId && (
              <li>
                <button
                  onClick={() => {
                    onAcao("DELETAR", reserva.id);
                    setOpen(false);
                  }}
                  className="w-full text-center p-2 hover:bg-red-100 text-red-700"
                >
                  Deletar
                </button>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}