export enum Equipamento {
  CAIXASOM = "Caixa de som",
  PROJETOR = "Projetor",
  COMPUTADOR = "Computador",
  MICROFONE = "Microfone",
  WEBCAM = "Webcam"
}

export type TipoEquipamento = {
    id?: string
    salaId: string
    tipoEquipamento: Equipamento
}

export type UpdateEquipamentoSala = {
    tipoEquipamento: Equipamento[]
}