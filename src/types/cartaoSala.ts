export interface cartaoSalas {
  escola: string,
  setor: string,
  corredor: string,
  sala: string,
  statusSala: ("livre" | "ocupada" | "desativada")[];
}