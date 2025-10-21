export default function AcessoNegado() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-5xl font-bold text-red-600 mb-4">Acesso negado</h1>
      <p className="text-lg text-gray-700">
        Você não tem permissão para acessar esta página.
      </p>
      <a
        href="/home"
        className="mt-6 px-4 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700 transition"
      >
        Voltar à página inicial
      </a>
    </div>
  );
}