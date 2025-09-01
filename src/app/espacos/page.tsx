'use client'
import { CartaoSala } from "@/components/cartaoSala";
import { cartaoSalas } from "@/types/cartaoSala";
import { useEffect, useState } from "react";
import { BsBuildings } from "react-icons/bs";
import { TbCircleLetterAFilled, TbCircleLetterBFilled, TbCircleLetterCFilled, TbCircleLetterDFilled, TbCircleLetterEFilled } from "react-icons/tb";
import { getSetores } from "../api/setores/route";
import { getSalasSetor } from "../api/salas/route";
import { setor } from "@/types/setor";

export default function Espacos() {
  const [setores, setSetores] = useState<setor[]>([]);
  const [salas, setSalas] = useState<cartaoSalas[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Função de busca na API
  useEffect(() => {
    carregarSetores()
  }, []);

  async function carregarSetores() {
      getSetores()
      .then(setSetores)
      .catch(console.error)
      .finally(() => setLoading(false))
      // if (!res.ok) throw new Error("Erro ao carregar setores");
      // const data = await res.json();
      // setSetores(data);
    // } catch (err) {
    //   console.error(err);
    // } finally {
    //   setLoading(false);
    // }
  }

  async function carregarSalas(setorId: number) {
    getSalasSetor(setorId)
    .then(setSalas)
    .catch(console.error)
    .finally(() => setLoading(false))
    // if (!res.ok) throw new Error("Erro ao carregar setores");
    // const data = await res.json();
    // setSetores(data);
    // } catch (err) {
    //   console.error(err);
    // } finally {
    //   setLoading(false);
    // }
  }

  const renderizaSetor = (nomeSetor: string) => {
    switch (nomeSetor) {
      case "A":
        return <TbCircleLetterAFilled className="absolute top-2 left-2 text-blue-950 group-hover:text-white transition duration-500" size={50}/>
      case "B":
        return <TbCircleLetterBFilled className="absolute top-2 left-2 text-blue-950 group-hover:text-white transition duration-500" size={50}/>
      case "C":
        return <TbCircleLetterCFilled className="absolute top-2 left-2 text-blue-950 group-hover:text-white transition duration-500" size={50}/>
      case "D":
        return <TbCircleLetterDFilled className="absolute top-2 left-2 text-blue-950 group-hover:text-white transition duration-500" size={50}/>
      case "E":
        return <TbCircleLetterEFilled className="absolute top-2 left-2 text-blue-950 group-hover:text-white transition duration-500" size={50}/>
      default:
        break;
    }
  }
//TERMINAR DE MONTAR A CHAMADA DAS SALAS
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="flex justify-center gap-2">
        {setores
        .sort((x, y) => x.nome.localeCompare(y.nome))
        .map((setor) => (
          <div
            className="relative flex items-center justify-center w-70 h-100 border-6 rounded-lg border-blue-950 group hover:bg-blue-950 hover:cursor-pointer hover:scale-105 transition-all transform duration-500"
            key={setor.id}
            onClick={() => carregarSalas(setor.id)}
            >
            {renderizaSetor(setor.nome)}
            <BsBuildings className="text-blue-950 group-hover:text-white transition duration-500" size={200}/>
          </div>
        ))}
      </div>
      {loading ? (
        <p className="mt-6 text-gray-600">Carregando salas...</p>
      ) : (
        <div>
          {salas.length > 0 ? (
            salas.map((sala, index) => <CartaoSala key={index} {...sala} />)
          ) : (
            <p className="text-gray-600">Nenhuma sala encontrada.</p>
          )}
        </div>
      )}
    </div>
  );
}