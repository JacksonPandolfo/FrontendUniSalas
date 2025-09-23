
type FooterProps={
  className?: string
}

export function Footer({className} : FooterProps) {
  return (
    <footer className={`${className}`}>
      <div className="flex flex-col items-center justify-center max-w-8xl mx-auto px-4">
        <p className="text-sm">© {new Date().getFullYear()} UniSalas. Todos os direitos reservados.</p>
        <p className="text-sm">Desenvolvido por Jackson Pandolfo</p>
      </div>
    </footer>
  )
}
