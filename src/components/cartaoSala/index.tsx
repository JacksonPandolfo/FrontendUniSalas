import { cartaoSalas } from "@/types/cartaoSala";

export function CartaoSala({ escola, setor, corredor, sala, statusSala }: cartaoSalas) {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 hover:shadow-xl transition cursor-pointer">

      <h3 className="text-lg font-bold">{escola}</h3>
      <div className="flex mt-2 space-x-1">
        {statusSala.map((status, index) => {
          const color =
            status === "livre"
              ? "bg-green-500"
              : status === "ocupada"
              ? "bg-red-500"
              : "bg-gray-400";
          return <span key={index} className={`w-3 h-3 rounded-full ${color}`} />;
        })}
      </div>
      <p className="text-sm text-gray-500 mt-2">
        {setor} - {corredor} {sala}
      </p>
    </div>
  );
}