import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const companies = [
  { id: 1, name: "삼성전자" },
  { id: 2, name: "현대자동차" },
  { id: 3, name: "네이버" },
  { id: 4, name: "카카오" },
  { id: 5, name: "LG화학" },
];

export default function Game() {
  const navigate = useNavigate();
  const totalRounds = 15;

  const [round, setRound] = useState(1);
  const [cash, setCash] = useState(1000000); // 현금
  const [holdings, setHoldings] = useState(
    companies.reduce((acc, c) => ({ ...acc, [c.id]: 0 }), {})
  );
  const [returns, setReturns] = useState(
    companies.map((c) => ({ ...c, change: 0 }))
  );
  const [showHint, setShowHint] = useState(false);
  const [hintCount, setHintCount] = useState(0);

  const maxHints = 5;
  const hints = [
    "IT 산업 성장 예상",
    "부동산 시장 하락세",
    "전기차 시장 신규 진입",
    "해외 투자 리스크 증가",
    "금리 인상 가능성",
  ];

  // 상태 디버깅
  useEffect(() => {
    console.log("===== 상태 확인 =====");
    console.log("Round:", round);
    console.log("Cash:", cash);
    console.log("Holdings:", holdings);
    console.log("Returns:", returns);
    const totalAssets =
      cash + Object.values(holdings).reduce((sum, val) => sum + val, 0);
    console.log("총 자산(현금+주식):", totalAssets);
    console.log("====================");
  }, [round, cash, holdings, returns]);

  const handleUseHint = () => {
    if (hintCount >= maxHints) {
      alert("힌트는 최대 5회만 사용 가능합니다!");
      return;
    }
    setHintCount(hintCount + 1);
    setShowHint(true);
  };

  const handleBuy = (companyId, amount) => {
    if (cash < amount) return;
    setCash(cash - amount);
    setHoldings((prev) => ({ ...prev, [companyId]: prev[companyId] + amount }));
  };

  const handleSell = (companyId, amount) => {
    if (holdings[companyId] < amount) return;
    setCash(cash + amount);
    setHoldings((prev) => ({ ...prev, [companyId]: prev[companyId] - amount }));
  };

  const handleNextRound = () => {
    // 랜덤 주가 변동 (-20% ~ +20%)
    const newReturns = companies.map((c) => ({
      ...c,
      change: parseFloat((Math.random() * 40 - 20).toFixed(2)),
    }));
    setReturns(newReturns);

    // 주식 가치 반영
    let newHoldings = {};
    companies.forEach((c) => {
      const oldValue = holdings[c.id] || 0;
      const newValue = Math.round(
        oldValue * (1 + newReturns.find((r) => r.id === c.id).change / 100)
      );
      newHoldings[c.id] = newValue;
    });
    setHoldings(newHoldings);

    if (round >= totalRounds) {
      const totalAssets =
        cash + Object.values(newHoldings).reduce((sum, val) => sum + val, 0);
      navigate("/result", { state: { assets: totalAssets } });
    } else {
      setRound(round + 1);
      setShowHint(false);
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-screen-md mx-auto">
      {/* 라운드 / 버튼 */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
        <h1 className="text-2xl font-bold">
          Round {round} / {totalRounds}
        </h1>
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={handleUseHint}
            disabled={hintCount >= maxHints}
            className={`px-4 py-2 rounded-xl font-semibold ${
              hintCount < maxHints
                ? "bg-yellow-400 hover:bg-yellow-500 text-black"
                : "bg-gray-300 text-gray-600 cursor-not-allowed"
            }`}
          >
            힌트 사용 ({hintCount}/{maxHints})
          </button>
          <button
            onClick={handleNextRound}
            className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold"
          >
            {round >= totalRounds ? "최종 결과 보기" : "다음 라운드"}
          </button>
        </div>
      </div>

      {/* 힌트 모달 */}
      {showHint && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg max-w-[90vw] text-center">
            <h2 className="text-xl font-bold mb-4">💡 투자 힌트</h2>
            <p className="text-gray-700 mb-4">
              {hints[Math.floor(Math.random() * hints.length)]}
            </p>
            <button
              onClick={() => setShowHint(false)}
              className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
            >
              닫기
            </button>
          </div>
        </div>
      )}

      {/* 회사별 투자 */}
      <div className="bg-white p-4 rounded-2xl shadow space-y-4">
        <h2 className="text-xl font-semibold mb-2">
          회사별 주가 변동률 / 투자
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {companies.map((c) => {
            const ret = returns.find((r) => r.id === c.id)?.change || 0;
            return (
              <div
                key={c.id}
                className="border rounded-xl p-3 flex flex-col items-center"
              >
                <span className="font-semibold">{c.name}</span>
                <span
                  className={`font-bold ${
                    ret > 0
                      ? "text-red-500"
                      : ret < 0
                      ? "text-blue-500"
                      : "text-gray-500"
                  }`}
                >
                  {ret > 0 ? `+${ret}%` : `${ret}%`}
                </span>
                <div className="flex flex-col sm:flex-row gap-1 mt-2">
                  <button
                    onClick={() => handleBuy(c.id, 100000)}
                    className="px-2 py-1 bg-green-500 text-white rounded-lg text-sm md:text-base"
                  >
                    매수
                  </button>
                  <button
                    onClick={() => handleSell(c.id, 100000)}
                    className="px-2 py-1 bg-red-500 text-white rounded-lg text-sm md:text-base"
                  >
                    매도
                  </button>
                </div>
                <span className="mt-1 text-gray-700">
                  보유: {holdings[c.id].toLocaleString()} 원
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 팀 자산 */}
      <div className="bg-white p-4 rounded-2xl shadow space-y-2 text-center">
        <h2 className="text-xl font-semibold">팀 자산</h2>
        <p className="text-lg md:text-xl font-bold">
          {(
            cash + Object.values(holdings).reduce((sum, val) => sum + val, 0)
          ).toLocaleString()}{" "}
          원
        </p>
      </div>
    </div>
  );
}
