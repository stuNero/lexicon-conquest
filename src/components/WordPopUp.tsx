export default function WordPopUp({ word, onClose }: { word: string; onClose: () => void; }) {
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl p-6 max-w-md w-full shadow-lg"
        onClick={e => e.stopPropagation()}
      >
        <p className="text-gray-600 mb-4">{word}</p>
        <button
          className="bg-black text-white px-4 py-2 rounded-lg hover:opacity-100 opacity-50"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}