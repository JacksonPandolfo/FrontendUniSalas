export enum Mobiliario {
  MESADESENHO = "Mesa de desenho",
  CADEIRABRACO = "Cadeira com braço",
  MESAREUNIAO = "Mesa de reunião",
  MOBILIARIOMOVEL = "Mobiliário móvel",
}

export type TipoMobiliario = {
    id?: string
    salaId: string
    tipoMobiliario: Mobiliario
}

export type UpdateMobiliarioSala = {
    tipoMobiliario: Mobiliario[]
}