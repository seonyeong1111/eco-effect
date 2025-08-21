export default function HintModal({ onClose }) {
  const hints = [
    "IT 산업의 성장이 예상됩니다.",
    "부동산 시장이 하락세를 보이고 있습니다.",
    "전기차 시장에 새로운 기업 진입!",
    "해외 투자 리스크가 증가하고 있습니다.",
    "금리 인상 가능성이 있습니다.",
  ];

  const randomHint = hints[Math.floor(Math.random() * hints.length)];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-96 text-center">
        <h2 className="text-xl font-bold mb-4">💡 투자 힌트</h2>
        <p className="text-gray-700 mb-4">{randomHint}</p>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition"
        >
          닫기
        </button>
      </div>
    </div>
  );
}
