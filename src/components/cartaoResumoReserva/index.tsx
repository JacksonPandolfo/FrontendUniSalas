// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function CardResumo({ titulo, cor, icone, total }: { titulo: string, cor: string, icone: any, total: number }) {
  return (
    <div className="bg-white shadow rounded-2xl p-4 flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{titulo}</p>
        <p className={`text-3xl font-bold ${cor}`}>{total}</p>
      </div>
      <div className={`${cor}`}>{icone}</div>
    </div>
  )
}