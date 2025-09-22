// eslint-disable-next-line @typescript-eslint/no-unused-vars
'use client'
import { createUsuario } from "@/lib/api/usuario/api";
import { Cargo } from "@/types/usuario";
import { sanitizeEmail } from "@/utils/sanitizeEmail";
import Link from "next/link";
import { useState } from "react";
import Select, { GroupBase, OptionsOrGroups, StylesConfig } from 'react-select'

export default function Cadastro() {
  const [showPopup, setShowPopup] = useState(false)
  const [popupMessage, setPopupMessage] = useState("")
  const [erroCadastro, setErroCadastro] = useState(false)

  const [nome, setNome] = useState("")
  const [sobrenome, setSobrenome] = useState("")
  const [dataNascimento, setDataNascimento] = useState<string>("")
  const [cargos, setCargos] = useState<Cargo[]>([])
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const dataFormatada = new Date(dataNascimento)
    const nomeFormatado = nome[0].toUpperCase() + nome.slice(1).toLowerCase()
    const sobrenomeFormatado = sobrenome[0].toUpperCase() + sobrenome.slice(1).toLowerCase()
    if (!cargos) {
      alert("Selecione um cargo")
      return
    }

    try {
      const emailSanitizado = sanitizeEmail(`${email}@unisinos.br`)
      await createUsuario({
        nome: nomeFormatado,
        sobrenome: sobrenomeFormatado,
        dataNascimento: dataFormatada,
        cargos: cargos,
        email: emailSanitizado,
        senha,
      })
      setErroCadastro(false)
      setPopupMessage("Cadastro realizado com sucesso")
      setShowPopup(true)
      setTimeout(() => setShowPopup(false), 3000)

    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro desconhecido"
        console.log("Erro no cadastro:", err)
        setPopupMessage(message)
        setShowPopup(true)
        setErroCadastro(true)
        setTimeout(() => setShowPopup(false), 4000)
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
      <div className="w-full max-w-md bg-white text-blue-950 rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Criar conta no UniSalas</h2>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            className="px-4 py-3 border-gray-400 rounded-lg border placeholder-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-950"
          />

          <input
            type="text"
            placeholder="Sobrenome"
            value={sobrenome}
            onChange={(e) => setSobrenome(e.target.value)}
            required
            className="px-4 py-3 rounded-lg border border-gray-400 placeholder-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-950"
          />

          <input
            type="date"
            placeholder="Data de Nascimento"
            value={dataNascimento}
            onChange={(e) => setDataNascimento(e.target.value)}
            required
            className="px-4 py-3 rounded-lg border border-gray-400 placeholder-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-950"
          />

          <Select
            options={options}
            styles={customStyles}
            isMulti
            required
            onChange={selected => setCargos(selected.map(s => s.value))}
            value={cargos.map(c => ({ value: c, label: c }))}
            placeholder="Selecione um ou mais cargos"
          />

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

          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            className="px-4 py-3 rounded-lg border border-gray-400 placeholder-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-950"
          />
          <input
            type="password"
            placeholder="Confirmar senha"
            required
            className="px-4 py-3 rounded-lg border border-gray-400 placeholder-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-950"
          />

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
          <Link href="/login" className="text-orange-400 hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </main>
  );
}