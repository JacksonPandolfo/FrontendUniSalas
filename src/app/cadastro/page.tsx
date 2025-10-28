// eslint-disable-next-line @typescript-eslint/no-unused-vars
'use client'
import { createUsuario } from "@/lib/api/auth/api";
import { Cargo } from "@/types/usuario";
import { useNavigate } from "@/utils/navigation";
import { sanitizeEmail } from "@/utils/sanitizeEmail";
import Link from "next/link";
import { useState } from "react";
import Select, { GroupBase, OptionsOrGroups, StylesConfig } from 'react-select'
import NProgress from 'nprogress'

export default function Cadastro() {
  const { push } = useNavigate()
  const [showPopup, setShowPopup] = useState(false)
  const [popupMessage, setPopupMessage] = useState("")
  const [erroCadastro, setErroCadastro] = useState(false)

  const [nome, setNome] = useState("")
  const [sobrenome, setSobrenome] = useState("")
  const [dataNascimento, setDataNascimento] = useState<string>("")
  const [telefone, setTelefone] = useState("")
  const [cargos, setCargos] = useState<Cargo[]>([])
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [confirmaSenha, setConfirmaSenha] = useState("")


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    let permiteAtualizar = true
    const dataFormatada = new Date(dataNascimento)
    const nomeFormatado = nome[0].toUpperCase() + nome.slice(1).toLowerCase()
    const sobrenomeFormatado = sobrenome[0].toUpperCase() + sobrenome.slice(1).toLowerCase()
    if (!cargos) {
      setErroCadastro(true)
      setPopupMessage("Selecione o seu cargo")
      setShowPopup(true)
      setTimeout(() => setShowPopup(false), 3000)
      permiteAtualizar = false
    }

    if(senha !== confirmaSenha) {
      setErroCadastro(true)
      setPopupMessage("As senhas não são iguais")
      setShowPopup(true)
      setTimeout(() => setShowPopup(false), 3000)
      permiteAtualizar = false
    }

    if(permiteAtualizar){
      try {
        const emailSanitizado = sanitizeEmail(`${email}@unisinos.br`)
        await createUsuario({
        nome: nomeFormatado,
        sobrenome: sobrenomeFormatado,
        dataNascimento: dataFormatada,
        telefone: telefone,
        cargos: cargos,
        email: emailSanitizado,
        senha,
      })
      setErroCadastro(false)
      setPopupMessage("Cadastro realizado com sucesso")
      setShowPopup(true)
      setTimeout(() => {
        setShowPopup(false)
        push('/login')
      }, 3000)

      } catch (err) {
        const message = err instanceof Error ? err.message : "Erro desconhecido"
        console.log("Erro no cadastro:", err)
        setPopupMessage(message)
        setShowPopup(true)
        setErroCadastro(true)
        setTimeout(() => setShowPopup(false), 4000)
      }
    }
  }

  type OptionType = {
    value: Cargo;
    label: string;
  };

  const options: OptionsOrGroups<OptionType, GroupBase<OptionType>> = [
    { value: Cargo.MINISTRANTE, label: 'Ministrante' },
    { value: Cargo.ATENDIMENTO, label: 'Atendimento' },
    { value: Cargo.FUNCIONARIO, label: 'Funcionário(a)' },
  ];

  const customStyles: StylesConfig<OptionType, true> = {
    control: (provided) => ({
      ...provided,
      borderRadius: '8px',
      borderColor: '#99a1af',
      padding: '2px',
      boxShadow: 'none',
      color: '#162456',
      cursor: 'pointer',
      '&:hover': { borderColor: '#162456' },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#162456' : state.isFocused ? '#bedbff' : 'white',
      color: state.isSelected ? 'white' : 'black',
      cursor: 'pointer',
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: '#bedbff',
      borderRadius: '4px',
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: '#162456',
      fontWeight: 500,
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#162456',
    }),
  };

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-blue-950 bg-blue- text-white px-4">
      <div className="w-full max-w-xl bg-white text-blue-950 rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Criar conta</h2>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex gap-2 w-full">
            <div className="flex flex-col w-full">
              <label htmlFor="" className="font-semibold mb-1">
                Nome:
              </label>
              <input
                type="text"
                placeholder="Nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
                className="px-4 py-3 border-gray-400 rounded-lg border placeholder-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-950"
                />
            </div>
            <div className="flex flex-col w-full">
              <label htmlFor="" className="font-semibold mb-1">
                Sobrenome:
              </label>
              <input
                type="text"
                placeholder="Sobrenome"
                value={sobrenome}
                onChange={(e) => setSobrenome(e.target.value)}
                required
                className="px-4 py-3 rounded-lg border border-gray-400 placeholder-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-950"
              />
            </div>
          </div>
          <div className="flex gap-2 w-full">
            <div className="flex flex-col w-full">
              <label htmlFor="" className="font-semibold mb-1">
                Data de nascimento:
              </label>
              <input
                type="date"
                placeholder="Data de Nascimento"
                value={dataNascimento}
                onChange={(e) => setDataNascimento(e.target.value)}
                required
                className="px-4 py-3 rounded-lg border border-gray-400 placeholder-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-950"
              />
            </div>
            <div className="flex flex-col w-full">
              <label htmlFor="" className="font-semibold mb-1">
                Telefone:
              </label>
              <input
                type="tel"
                placeholder="Telefone"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                className="px-4 py-3 rounded-lg border border-gray-400 placeholder-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-950"
              />
            </div>
          </div>

            <div className="flex flex-col w-full">
              <label htmlFor="" className="font-semibold mb-1">
                Cargo:
              </label>
              <Select
                required
                options={options}
                styles={customStyles}
                isMulti
                onChange={selected => setCargos(selected.map(s => s.value))}
                value={cargos.map(c => ({ value: c, label: c }))}
                placeholder="Selecione um ou mais cargos"
                />
            </div>
            <div className="flex flex-col w-full">
              <label htmlFor="" className="font-semibold mb-1">
                E-mail:
              </label>
              <div className="flex rounded-xl border border-gray-400 overflow-hidden focus-within:ring-2 focus-within:ring-blue-950 focus:ring-blue-950">
                <input
                  id="email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="E-mail institucional"
                  className="px-4 py-2 flex-1 outline-none placeholder-blue-950"
                  required
                  />
                <span className="bg-blue-100 px-3 py-2 text-blue-950 select-none">
                  @unisinos.br
                </span>
              </div>
            </div>

          <div className="flex gap-2 w-full">
            <div className="flex flex-col w-full">
              <label htmlFor="" className="font-semibold mb-1">
                Senha:
              </label>
              <input
                type="password"
                placeholder="Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                className="px-4 py-3 rounded-lg border border-gray-400 placeholder-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-950"
                />
            </div>
            <div className="flex flex-col w-full">
              <label htmlFor="" className="font-semibold mb-1">
                Confirmar a senha:
              </label>
              <input
                type="password"
                placeholder="Confirmar senha"
                value={confirmaSenha}
                onChange={(e) => setConfirmaSenha(e.target.value)}
                required
                className="px-4 py-3 rounded-lg border border-gray-400 placeholder-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-950"
                />
            </div>
          </div>

          {showPopup && erroCadastro && (
            <div className={`bg-red-400 font-bold text-white text-center px-6 py-3 rounded-lg shadow-lg z-50`}>
              ❌ {popupMessage}
            </div>
          )}
          {showPopup && !erroCadastro && (
            <div className={`bg-green-400 font-bold text-white text-center px-6 py-3 rounded-lg shadow-lg z-50`}>
              ✅ {popupMessage}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-950 text-white py-3 rounded-lg font-semibold hover:bg-orange-400 transition-all"
          >
            Criar conta
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-gray-600">
          Já tem uma conta?{" "}
          <Link href="/login" onClick={() => NProgress.start()} className="text-orange-400 hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </main>
  );
}