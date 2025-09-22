export async function login(email: string, senha: string) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, senha }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Erro ao logar');
  }
  return res.json();
}

export async function logout() {
  localStorage.removeItem('access_token');
}