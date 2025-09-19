'use client'
import Link from "next/link";
import { useState } from "react";

export default function Cadastro() {
  const [email, setEmail] = useState("")

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const emailFinal = `${email}@unisinos.br`
    console.log(emailFinal)
  }
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-blue-950 text-white px-4">
      <div className="w-full max-w-md bg-white text-blue-950 rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Criar conta no UniSalas</h2>

        <form className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Nome completo"
            required
            className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />

          <input
            type="date"
            placeholder="Data de Nascimento"
            required
            className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />

          <select className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2" name="cargo" id="" required>
            <option value="" disabled selected>Selecione seu cargo</option>
            <option value="ministrante">Ministrante</option>
            <option value="atendente">Atendente</option>
            <option value="funcionario">Funcionário(a)</option>
          </select>

          <div className="flex rounded-xl border border-gray-300 overflow-hidden focus-within:ring-2 focus-within:ring-blue-950">
            <input
              id="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-mail institucional"
              className="px-4 py-2 flex-1 outline-none"
              required
            />
            <span className="bg-gray-100 px-3 py-2 text-gray-600 select-none">
              @unisinos.br
            </span>
          </div>

          <input
            type="password"
            placeholder="Senha"
            required
            className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <input
            type="password"
            placeholder="Confirmar senha"
            required
            className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
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