import { UsuarioAdmin } from "@/types/usuario";

export async function getUsuarios() {
  const res = await fetch(`/api/usuario`, {
    method: "GET",
    credentials: 'include'
  });
  if (!res.ok) throw new Error('Erro ao carregar os usuários');
  return res.json();
}

export async function getUsuarioById(usuarioId: string) {
  const res = await fetch(`/api/usuario/${usuarioId}`, {
    method: "GET",
    credentials: "include"
  });
  if (!res.ok) throw new Error('Erro ao carregar os usuários');
  return res.json();
}

export async function getUsuarioByNome(nomeUsuario: string) {
  const res = await fetch(`/api/usuario?nome=${nomeUsuario}`, {
    method: "GET",
    credentials: "include"
  });
  if (!res.ok) throw new Error('Erro ao carregar os usuários');
  return res.json();
}

export async function getUsuarioMinistranteByNome(nomeUsuario: string) {
  const res = await fetch(`/api/usuario?nome=${nomeUsuario}&cargo=true`, {
    method: "GET",
    credentials: "include"
  });
  if (!res.ok) throw new Error('Erro ao carregar os usuários');
  return res.json();
}

export async function updateUsuario(usuarioId: string, usuarioData: UsuarioAdmin) {
  const res = await fetch(`/api/usuario/${usuarioId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(usuarioData),
    credentials: "include"
  });
  if (!res.ok) throw new Error('Erro ao atualizar o usuário');
  return res.json();
}

export async function deleteUsuario(usuarioId: string) {
  const res = await fetch(`/api/usuario/${usuarioId}`, {
    method: "DELETE",
    credentials: "include"
  });
  if (!res.ok){
    const data = await res.json().catch(() => null)
      throw new Error(data?.error || "Erro ao excluir o usuário");
  }
  return true
}