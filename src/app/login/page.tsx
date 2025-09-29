'use client'
import { login } from "@/lib/api/auth/api";
import { sanitizeEmail } from "@/utils/sanitizeEmail";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";


export default function Login() {
  const router = useRouter()
  const [showPopup, setShowPopup] = useState(false)
  const [popupMessage, setPopupMessage] = useState("")
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [erroLogin, setErroLogin] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const emailSanitizado = sanitizeEmail(email)
      await login(emailSanitizado, senha)

      setErroLogin(false)
      setPopupMessage("Login realizado com sucesso")
      setShowPopup(true)

      setTimeout(() => {
        setShowPopup(false)
        router.push('/reservas')
      }, 1000)
    } catch (err) {
        console.log("Erro no login:", err)
        setPopupMessage("E-mail ou senha inválidos")
        setShowPopup(true)
        setErroLogin(true)
        setTimeout(() => setShowPopup(false), 4000)
      }
  }

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-blue-950 text-white px-4">
      <div className="w-full max-w-md bg-white text-blue-950 rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Entrar no UniSalas</h2>

        <form className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="E-mail institucional"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value) }
            className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <input
            type="password"
            placeholder="Senha"
            required
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          {showPopup && erroLogin && (
            <div className={`bg-red-500 font-bold text-white text-center px-6 py-3 rounded-lg shadow-lg z-50`}>
              {popupMessage}
            </div>
          )}
          {showPopup && !erroLogin && (
            <div className={`bg-green-400 font-bold text-white text-center px-6 py-3 rounded-lg shadow-lg z-50`}>
              ✅ {popupMessage}
            </div>
          )}
          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full bg-blue-950 text-white py-3 rounded-lg font-semibold hover:bg-orange-400 hover:cursor-pointer transition-all"
          >
            Entrar
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-gray-600">
          Não tem uma conta?{" "}
          <Link href="/cadastro" className="text-orange-400 hover:underline">
            Cadastre-se
          </Link>
        </p>
      </div>
    </main>
  );
}