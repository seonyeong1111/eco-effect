import { useLocation, useNavigate } from "react-router-dom";

export default function Result() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { assets } = state || { assets: 0 };

  return (
    <div className="flex flex-col items-center justify-center p-6 gap-6">
      <h1 className="text-3xl font-bold">🏆 최종 결과</h1>
      <p className="text-lg text-gray-700">
        최종 자산: {assets.toLocaleString()}원
      </p>
      <button
        onClick={() => navigate("/")}
        className="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700"
      >
        홈으로 돌아가기
      </button>
    </div>
  );
}
