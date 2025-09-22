export function sanitizeEmail(emailInput: string){
  let email = emailInput.trim().toLowerCase()

  if(email.includes('@')) {
    const parts = email.split('@')
    const localPart = parts[0]
    const domain = parts[1] || ''

    if(domain !== 'unisinos.br'){
      throw new Error("O domínio deve ser @unisinos.br")
    }

    email = `${localPart}@unisinos.br`
  } else {
    email += '@unisinos.br'
  }
  const regex = /^[a-zA-Z0-9]+([._]?[a-zA-Z0-9]+)*@unisinos\.br$/
  if(!regex.test(email)) {
    throw new Error("Formato de e-mail inválido")
  }

  return email
}