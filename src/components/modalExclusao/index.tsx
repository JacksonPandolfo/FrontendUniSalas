export default function DeleteConfirmation({ onConfirm, onCancel, isOpen } ) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100/90  z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 ">
        <h2 className="text-xl font-semibold mb-4">Confirmar Exclusão</h2>
        <p className="mb-6">Tem certeza que deseja excluir este item?</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}