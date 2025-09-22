import { CreateUsuario, UsuarioAdmin } from "@/types/usuario";

export async function createUsuario(usuarioData: CreateUsuario) {
  const res = await fetch(`/api/usuario`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(usuarioData)
  });

  const data = await res.json()
  if (!res.ok){
    throw new Error(data?.error || "Erro ao registrar o usuário");
  }
  return data
}

export async function getUsuarios() {
  const res = await fetch(`/api/usuario`);
  if (!res.ok) throw new Error('Erro ao carregar os usuários');
  return res.json();
}

export async function getUsuarioById(usuarioId: string) {
  const res = await fetch(`/api/usuario/${usuarioId}`);
  if (!res.ok) throw new Error('Erro ao carregar os usuários');
  return res.json();
}

export async function updateUsuario(usuarioId: string, usuarioData: UsuarioAdmin) {
  const res = await fetch(`/api/usuario/${usuarioId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(usuarioData)
  });
  if (!res.ok) throw new Error('Erro ao atualizar o usuário');
  return res.json();
}

export async function deleteUsuario(usuarioId: string) {
  const res = await fetch(`/api/usuario/${usuarioId}`, {
    method: "DELETE"
  });
  if (!res.ok){
    const data = await res.json().catch(() => null)
      throw new Error(data?.error || "Erro ao excluir o usuário");
  }
  return true
}