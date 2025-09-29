'use client'
import { getSetorById, updateSetorById } from "@/lib/api/setores/api"
import { SetorAdmin, UpdateSetor } from "@/types/setor"
import Link from "next/link"
import * as React from "react"
import { useEffect, useState } from "react"
import { TbCircleArrowLeftFilled } from "react-icons/tb"

export default function GereciamentoSetor({ params }: { params: Promise<{ setorId: string }> }){
    const [dataSetor, setDataSetor] = useState<SetorAdmin>()
    const [mensagemErroBuscarSetor, setMensagemErroBuscarSetor] = useState("")
    const [mensagemErroAtualizarSetor, setMensagemErroAtualizarSetor] = useState("")
    const [loadingDataSetor, setLoadingDataSetor] = useState(false)

    const [newNome, setNewNome] = useState("")
    const [newDescricao, setNewDescricao] = useState("")
    const [isSetorAtualizado, setIsSetorAtualizado] = useState(false)
    const [erroAtualizar, setErroAtualizar] = useState(false)
    const [erroCarregarSetor, setErroCarregarSetor] = useState(false)

    const { setorId } = React.use(params)


    useEffect(() => {
        setLoadingDataSetor(true)
        buscarSetorById(setorId)
    }, [setorId])

    async function buscarSetorById(setorId: string){
        getSetorById(setorId)
        .then(setDataSetor)
        .catch((err) => {
            const mensagem = err instanceof Error ? err.message : String(err);
            console.error("Erro ao buscar setor:", mensagem);
            setErroCarregarSetor(true);
            setMensagemErroBuscarSetor("Não foi possível carregar os setores");
      })
      .finally(() => setLoadingDataSetor(false))
    }

    useEffect(() => {
        if (dataSetor) {
            setNewNome(dataSetor.nome);
            setNewDescricao(dataSetor.descricao);
        }
    }, [dataSetor])

    async function salvarAlteracoes(){
        setErroAtualizar(false)
        setIsSetorAtualizado(false)
        if(!dataSetor) return

        if (newNome === dataSetor.nome && newDescricao === dataSetor.descricao) {
            setErroAtualizar(true)
            setMensagemErroAtualizarSetor("Nenhuma alteração foi feita!");
            setTimeout(() => setErroAtualizar(false), 3000)
            return;
        }

        if(newNome === "" || newDescricao === ""){
            setErroAtualizar(true)
            setMensagemErroAtualizarSetor("Os valores não podem ser vazios");
            setTimeout(() => setErroAtualizar(false), 3000)
            return;
        }

        const dataUpdateSetor: UpdateSetor = {
            nome: newNome,
            descricao: newDescricao
        }

        try {
            const setorAtualizado = await updateSetorById(dataSetor.id, dataUpdateSetor)
            setDataSetor(setorAtualizado)
            setIsSetorAtualizado(true)
            setTimeout(() => setIsSetorAtualizado(false), 3000)
        } catch (err) {
            const mensagem = err instanceof Error ? err.message : String(err);
            console.error("Erro ao atualizar o setor:", mensagem);
            setErroAtualizar(true)
            setMensagemErroAtualizarSetor("Erro ao atualizar o setor")
            setTimeout(() => setErroAtualizar(false), 3000)
        }
    }

    return(
        <div className="relative flex flex-col gap-4 items-center justify-center">
            {loadingDataSetor ? (
                <p className="mt-6 text-gray-600">{"Carregando setores" + "...".split("").map((char, i) => (
                      <span key={i} className="inline-block animate-bounce">{char}</span>
                  ))}
                </p>
            ) : ( erroCarregarSetor ?
                <div className="bg-red-400 font-bold text-white text-center p-3 rounded-lg shadow-lg z-50">
                    <p>❌ {mensagemErroBuscarSetor}</p>
                </div> :
            <>
                <h1 className="absolute top-2 text-4xl font-poppins text-blue-950 font-bold">Gerenciamento do setor { dataSetor?.nome }</h1>
                <Link href={'/gerenciamento/espacos/setores'}>
                    <button className="border-2 flex gap-2 items-center border-blue-950 text-blue-950 font-poppins rounded-lg p-1 hover:cursor-pointer hover:bg-blue-950 hover:text-white hover:scale-105 transition-all transform duration-500">
                        <TbCircleArrowLeftFilled size={30}/> Voltar para setores
                    </button>
                </Link>
                <div className="flex gap-2 items-center justify-center">
                    <div className="flex flex-col border-2 border-blue-950 p-4 rounded-lg bg-gray-100">
                        <p className="text-center font-bold text-blue-950">Dados atuais</p>
                        <div className="mb-4">
                            <label className="block font-semibold mb-1">Nome</label>
                            <input
                                type="text"
                                value={newNome ? newNome : dataSetor?.nome}
                                readOnly
                                className="w-full border rounded p-2 bg-gray-200"
                                />
                        </div>

                        <div>
                        <label className="block font-semibold mb-1">Descrição</label>
                        <textarea
                            value={newDescricao ? newDescricao : dataSetor?.descricao}
                            readOnly
                            className="w-full border rounded p-2 bg-gray-200"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col border-2 border-blue-950 p-4 rounded-lg bg-gray-100">
                        <p className="text-center font-bold text-blue-950">Dados para atualizar</p>
                        <div className="mb-4">
                        <label className="block font-semibold mb-1">Nome</label>
                        <input
                            type="text"
                            value={newNome || dataSetor?.nome || ""}
                            required
                            onChange={(e) => {
                                const valor = e.target.value
                                setNewNome(valor === "" ? dataSetor?.nome || "" : valor)
                            }}
                            className="w-full border rounded p-2"
                            />
                        </div>

                        <div>
                        <label className="block font-semibold mb-1">Descrição</label>
                        <textarea
                            value={newDescricao || dataSetor?.descricao || ""}
                            required
                            onChange={(e) => {
                                const valor = e.target.value
                                setNewDescricao(valor === "" ? dataSetor?.descricao || "" : valor)
                            }}
                            className="w-full border rounded p-2"
                            />
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
                        <p>{mensagemErroAtualizarSetor}</p>
                    </div>
                    }
                    {isSetorAtualizado &&
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