import Link from "next/link";
import NProgress from 'nprogress'

export default function NotFound(){
  return(
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-center font-bold mt-9 text-6xl">
        Página 404 não encontrada!
      </h1>
      <p>Essa página que tentou acessar não existe!</p>
      <Link href='/' onClick={() => NProgress.start()}>
        Voltar para Home
      </Link>
    </div>
  )
}