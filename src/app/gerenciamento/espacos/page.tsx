'use client'
import { CartaoSetor } from "@/components/cartaoSetor";
import { getSetores } from "@/lib/api/setores/api";
import { SetorAdmin } from "@/types/setor";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BsBuilding, BsGear } from "react-icons/bs";
import { TbCircleArrowLeftFilled } from "react-icons/tb";

export default function GerenciamentoEspacos(){
    const [loadingSetores, setLoadingSetores] = useState(false);
    const [setoresAdmin, setSetoresAdmin] = useState<SetorAdmin[]>([]);
    // const [blocosAdmin, setBlocosAdmin] = useState<BlocoAdmin[]>([])
    // const [salasAdmin, setSalasAdmin] = useState<SalaAdmin[]>([]);
    const [erroSetor, setErroSetor] = useState("")

    const [setorSelecionado, setSetorSelecionado] = useState<string | null>(null)
    // const [blocoSelecionado, setBlocoSelecionado] = useState<string | null>(null)
    // const [salaSelecionada, setSalaSelecionada] = useState<string | null>(null)

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

    function renderBotoes(setorId?: string, blocoId?: string, salaId?: string) {
        return (
        <div className="mt-2 flex flex-col gap-2">
            <Link href={`/gerenciamento/espacos/${setorId}`} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                <BsGear/>Gerenciar
            </Link>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition sm:w-32">
            <BsBuilding />Ver blocos
            </button>
        </div>
        );
    }

    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen pb-4 px-8">
            {loadingSetores ? (
          <p className="mt-6 text-gray-600">{"Carregando setores...".split("").map((char, i) => (
            <span key={i} className="inline-block animate-bounce">{char}</span>
          ))}</p>
        ) : erroSetor ? (
          <p className="mt-6 text-gray-600">{erroSetor}</p>
        ) : (
            <>
                <h1 className="absolute top-2 text-4xl font-poppins text-blue-950 font-bold">Gerenciamento de espaços</h1>
                <Link href={'/gerenciamento'}>
                    <button className="border-2 flex gap-2 items-center border-blue-950 text-blue-950 font-poppins rounded-2xl p-2 hover:cursor-pointer hover:bg-blue-950 hover:text-white hover:scale-105">
                        <TbCircleArrowLeftFilled size={30}/> Voltar para gerenciamento
                    </button>
                </Link>
                <div className="flex justify-center gap-2 mt-4">
                {setoresAdmin
                  .sort((x, y) => x.nome.localeCompare(y.nome))
                  .map((setor) => (
                      <div key={setor.id} className="flex flex-col gap-2 items-center">
                          <CartaoSetor
                              {...setor}
                              onClick={() => setSetorSelecionado(setorSelecionado === setor.id ? null : setor.id)}/>
                          {setorSelecionado === setor.id && renderBotoes(setor.id)}
                      </div>
                  ))}
                  {/* INSERIR BOTÃO DE CRIAÇÃO DE ESPAÇO */}
                </div>
            </>
        )}
        </div>
    )
}