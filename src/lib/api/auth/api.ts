export async function login(email: string, senha: string) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, senha }),
    credentials: 'include',
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Erro ao logar');
  }
  const data = await res.json();
  return data
}

export async function logout() {
  localStorage.removeItem('access_token');
}