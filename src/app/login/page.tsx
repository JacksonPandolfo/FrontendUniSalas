import Link from "next/link";

export default function Login() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-blue-950 text-white px-4">
      <div className="w-full max-w-md bg-white text-blue-950 rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Entrar no UniSalas</h2>

        <form className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="E-mail institucional"
            required
            className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <input
            type="password"
            placeholder="Senha"
            required
            className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <button
            type="submit"
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