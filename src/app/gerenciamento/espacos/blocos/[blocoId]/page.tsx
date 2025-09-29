'use client'
import { getBlocoById, getBlocos, updateBlocoById } from "@/lib/api/blocos/api"
import { getSetores } from "@/lib/api/setores/api"
import { BlocoAdmin, UpdateBloco } from "@/types/bloco"
import { SetorAdmin } from "@/types/setor"
import Link from "next/link"
import React, { useEffect, useState } from "react"
import { TbCircleArrowLeftFilled } from "react-icons/tb"

export default function GerenciamentoBloco({ params }: { params: Promise<{ blocoId: string }> }){
    const { blocoId } = React.use(params)
    const [bloco, setBloco] = useState<BlocoAdmin>()
    const [blocos, setBlocos] = useState<BlocoAdmin[]>([])
    const [setores, setSetores] = useState<SetorAdmin[]>([])
    const [novoNumero, setNovoNumero] = useState<number>()
    const [nomeNovoSetor, setNomeNovoSetor] = useState("")

    const [isBlocoAtualizado, setIsBlocoAtualizado] = useState(false)
    const [erroAtualizar, setErroAtualizar] = useState(false)
    const [erroCarregarSetor, setErroCarregarSetor] = useState(false)
    const [erroCarregarBloco, setErroCarregarBloco] = useState(false)

    const [mensagemErroBuscarSetor, setMensagemErroBuscarSetor] = useState("")
    const [mensagemErroBuscarBloco, setMensagemErroBuscarBloco] = useState("")
    const [mensagemErroAtualizarBloco, setMensagemErroAtualizarBloco] = useState("")
    const [loadingDataBloco, setLoadingDataBloco] = useState(false)
    const [loadingDataSetor, setLoadingDataSetor] = useState(false)

    useEffect(() => {
        buscarBlocos()
        carregarSetores()
        carregarBlocosById(blocoId)
    }, [blocoId]);

    useEffect(() => {
    if (bloco?.setorId) {
      setNomeNovoSetor(String(bloco.setorId));
    }
    if(bloco?.numero) {
        setNovoNumero(bloco.numero)
    }
  }, [bloco]);

    async function carregarSetores() {
      getSetores()
      .then(setSetores)
      .catch((err) => {
            const mensagem = err instanceof Error ? err.message : String(err);
            setErroCarregarSetor(true);
            setMensagemErroBuscarSetor(mensagem);
      })
      .finally(() => setLoadingDataSetor(false))
    }


    async function carregarBlocosById(blocoId: string) {
        getBlocoById(blocoId)
        .then(setBloco)
        .catch((err) => {
            const mensagem = err instanceof Error ? err.message : String(err)
            setErroCarregarBloco(true)
            setMensagemErroBuscarBloco(mensagem)
        })
        .finally(() => setLoadingDataBloco(false))
    }
    async function buscarBlocos(){
        getBlocos()
        .then(setBlocos)
        .catch((err) => {
            const mensagem = err instanceof Error ? err.message : String(err)
            setErroCarregarBloco(true)
            setMensagemErroBuscarBloco(mensagem)
        })
        .finally(() => setLoadingDataBloco(false))
    }

    async function salvarAlteracoes(){
        let permiteAtualizar = true
        setErroAtualizar(false)
        setIsBlocoAtualizado(false)
        if(!bloco) return
        if (novoNumero === bloco.numero && nomeNovoSetor === setores.find(s => s.id === bloco?.setorId)?.id) {
            setErroAtualizar(true)
            setMensagemErroAtualizarBloco("Nenhuma alteração foi feita!");
            setTimeout(() => setErroAtualizar(false), 3000)
            permiteAtualizar = true
            return;
        }
        if(novoNumero === undefined || bloco.setorId === ""){
            setErroAtualizar(true)
            setMensagemErroAtualizarBloco("Os valores não podem ser vazios");
            setTimeout(() => setErroAtualizar(false), 3000)
            permiteAtualizar = true
            return;
        }

        if(novoNumero){
            // const setorDoBloco = setores.find(s => s.id === bloco?.setorId);
            const setorDoBloco = setores.find(s => s.id === nomeNovoSetor);

            if(setorDoBloco){
                const existeMesmoNumero = blocos
                    .filter(b => b.setorId === setorDoBloco.id)
                    .some(b => b.numero === novoNumero)

                    if(existeMesmoNumero){
                        setErroAtualizar(true)
                        setMensagemErroAtualizarBloco("Já existe um bloco com este número setor");
                        setTimeout(() => setErroAtualizar(false), 3000)
                        permiteAtualizar = true
                    }
            }
        }

        const dataUpdateSetor: UpdateBloco = {
            numero: novoNumero,
            setorId: nomeNovoSetor
        }

        if(permiteAtualizar){
            try {
                const blocoAtualizado = await updateBlocoById(blocoId, dataUpdateSetor)
                setBloco(blocoAtualizado)
                setBlocos(prev => prev.map(b => b.id === blocoId ? blocoAtualizado : b));
                setIsBlocoAtualizado(true)
                setTimeout(() => setIsBlocoAtualizado(false), 3000)
            } catch (err) {
                const mensagem = err instanceof Error ? err.message : String(err);
                console.error("Erro ao atualizar o setor:", mensagem);
                setErroAtualizar(true)
                setMensagemErroAtualizarBloco("Erro ao atualizar o bloco")
                setTimeout(() => setErroAtualizar(false), 3000)
            }
        }
    }

    return (
        <div className="relative flex flex-col gap-4 items-center justify-center w-full">
            {loadingDataSetor || loadingDataBloco ? (
                <p className="mt-6 text-gray-600">{"Carregando...".split("").map((char, i) => (
                      <span key={i} className="inline-block animate-bounce">{char}</span>
                  ))}
                </p>
            ) : erroCarregarSetor ? (
                <div className="bg-red-400 font-bold text-white text-center p-3 rounded-lg shadow-lg z-50">
                    <p>❌ {mensagemErroBuscarSetor}</p>
                </div>
            ) : erroCarregarBloco ? (
                <div className="bg-red-400 font-bold text-white text-center p-3 rounded-lg shadow-lg z-50">
                    <p>❌ {mensagemErroBuscarBloco}</p>
                </div>
            ) : ( setores && bloco &&
            <>
                <h1 className="flex gap-2 absolute top-2 text-4xl font-poppins text-blue-950 font-bold">Gerenciamento do bloco
                    <span className="text-orange-400">{ setores.find(s => s.id === bloco?.setorId)?.nome}{ String(bloco?.numero).padStart(2, "0") }</span>
                </h1>
                <Link href={'/gerenciamento/espacos/blocos'}>
                    <button className="border-2 flex gap-2 items-center border-blue-950 text-blue-950 font-poppins rounded-lg p-1 hover:cursor-pointer hover:bg-blue-950 hover:text-white hover:scale-105 transition-all transform duration-500">
                        <TbCircleArrowLeftFilled size={30}/> Voltar para blocos
                    </button>
                </Link>
                <div className="flex gap-2 items-center justify-center">
                    <div className="flex flex-col border-2 border-blue-950 p-4 rounded-lg bg-gray-100">
                        <p className="text-center font-bold text-blue-950">Dados atuais</p>
                        <div className="mb-4">
                            <label className="block font-semibold mb-1">Número</label>
                            <input
                                type="number"
                                value={String(bloco.numero).padStart(2, "0")}
                                readOnly
                                className="w-full border rounded p-2 bg-gray-200"
                                />
                        </div>
                        <div>
                            <label className="block font-semibold mb-1">Setor</label>
                            <input
                            type="text"
                                value={setores.find(s => s.id === bloco.setorId)?.nome}
                                readOnly
                                className="w-full border rounded p-2 bg-gray-200"
                                />
                        </div>
                    </div>
                    <div className="flex flex-col border-2 border-blue-950 p-4 rounded-lg bg-gray-100">
                        <p className="text-center font-bold text-blue-950">Dados para atualizar</p>
                        <div className="mb-4">
                            <label className="block font-semibold mb-1">Número</label>
                            <input
                                type="number"
                                min={0}
                                value={novoNumero !== undefined ? String(novoNumero).padStart(2, "0") : (bloco?.numero !== undefined ? String(bloco.numero).padStart(2, "0") : "")}
                                required
                                onChange={(e) => {
                                    const valor = e.target.value
                                    setNovoNumero(valor !== "" ? Number(valor) : undefined)
                                }}
                                className="w-full border rounded p-2"
                                />
                        </div>

                        <div>
                            <label className="block font-semibold mb-1">Setor</label>
                            <select className="w-full border rounded p-2"
                                value={nomeNovoSetor}
                                onChange={(e) => setNomeNovoSetor(e.target.value)}
                            >
                                {setores
                                    .sort((x, y) => x.nome.localeCompare(y.nome))
                                       .map((setor) => {
                                           return(
                                               <option key={setor.id} value={String(setor.id)}>{setor.nome}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2 items-center justify-center">
                    <button
                    onClick={salvarAlteracoes}
                    className="bg-blue-700 font-poppins text-white px-4 py-2 rounded-lg hover:bg-blue-950 hover:cursor-pointer transition duration-300"
                      >
                      Salvar alterações
                    </button>

                    {erroAtualizar &&
                    <div className="absolute top-32 bg-red-400 font-bold text-white text-center p-3 rounded-lg shadow-lg z-50">
                        <p>{mensagemErroAtualizarBloco}</p>
                    </div>
                    }
                    {isBlocoAtualizado &&
                        <div className="absolute top-32 bg-green-400 font-bold text-white text-center p-3 rounded-lg shadow-lg z-50">
                            <p>✅ Dados salvos com sucesso!</p>
                        </div>
                    }
                </div>
            </>
        )}
        </div>
    )
}