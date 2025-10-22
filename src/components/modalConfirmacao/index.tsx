// export default function DeleteConfirmation({ onConfirm, onCancel, isOpen } ) {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-gray-100/90  z-50">
//       <div className="bg-white rounded-lg shadow-lg p-6 ">
//         <h2 className="text-xl font-semibold mb-4">Confirmar Exclusão</h2>
//         <p className="mb-6">Tem certeza que deseja excluir?</p>
//         <div className="flex justify-end space-x-3">
//           <button
//             onClick={onCancel}
//             className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
//           >
//             Cancelar
//           </button>
//           <button
//             onClick={onConfirm}
//             className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
//           >
//             Excluir
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

export default function ConfirmarAcao({
  isOpen,
  title = "Confirmar ação",
  message = "Tem certeza que deseja continuar?",
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  confirmColor = "bg-blue-600 hover:bg-blue-700",
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900/40 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm">
        <h2 className="text-lg font-semibold mb-2 text-gray-900">{title}</h2>
        <p className="text-gray-600 mb-6">{message}</p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded text-white transition-colors ${confirmColor}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}