'use client'
import { useEffect, useState } from "react";
import { getSetores } from "../api/setores/route";
import { getSalasBloco } from "../api/salas/route";

import { SetorAdmin } from "@/types/setor";
import { BlocoAdmin } from "@/types/bloco";
import { SalaAdmin } from "@/types/sala";

import { CartaoSetor } from "@/components/cartaoSetor";
import { getBlocosSetor } from "../api/blocos/route";

export default function Espacos() {
  const [setoresAdmin, setSetoresAdmin] = useState<SetorAdmin[]>([]);
  const [blocosAdmin, setBlocosAdmin] = useState<BlocoAdmin[]>([])
  const [salasAdmin, setSalasAdmin] = useState<SalaAdmin[]>([]);

  const [setorSelecionado, setSetorSelecioando] = useState<number | null>(null)
  const [blocoSelecionado, setBlocoSelecioando] = useState<number | null>(null)

  const [loadingSetores, setLoadingSetores] = useState(true);
  const [loadingBlocos, setLoadingBlocos] = useState(true);
  const [loadingSalas, setLoadingSalas] = useState(true);

  // 🔹 Função de busca na API
  useEffect(() => {
    carregarSetores()
  }, []);

  async function carregarSetores() {
      getSetores()
      .then(setSetoresAdmin)
      .catch(console.error)
      .finally(() => setLoadingSetores(false))
  }

  useEffect(() => {
    if(setorSelecionado){
      carregarBlocos(setorSelecionado)
    }
  }, [setorSelecionado])

  async function carregarBlocos(setorId: number) {
    getBlocosSetor(setorId)
    .then(setBlocosAdmin)
    .catch(console.error)
    .finally(() => setLoadingBlocos(false))
  }

  useEffect(() => {
    if(blocoSelecionado){
      carregarSalas(blocoSelecionado)
    }
  }, [blocoSelecionado])

  async function carregarSalas(blocoId: number) {
    getSalasBloco(blocoId)
    .then(setSalasAdmin)
    .catch(console.error)
    .finally(() => setLoadingSalas(false))
  }

//TERMINAR DE MONTAR A CHAMADA DAS SALAS
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
        {loadingSetores ? (
          <p className="mt-6 text-gray-600">Carregando setores...</p>
        ):(
          <div className="flex justify-center gap-2">
          {setoresAdmin
            .sort((x, y) => x.nome.localeCompare(y.nome))
            .map((setor) => (
              <CartaoSetor key={setor.id} {...setor} onClick={() => setSetorSelecioando(setor.id)}/>
            ))}
          </div>
          )}
    </div>
  );
}