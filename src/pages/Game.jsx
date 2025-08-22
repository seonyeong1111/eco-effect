import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const companies = [
  { id: 1, name: "삼성전자", basePrice: 50000 },
  { id: 2, name: "현대자동차", basePrice: 200000 },
  { id: 3, name: "네이버", basePrice: 100000 },
  { id: 4, name: "카카오", basePrice: 80000 },
  { id: 5, name: "LG화학", basePrice: 300000 },
];

export default function Game() {
  const navigate = useNavigate();
  const totalRounds = 15;

  const [round, setRound] = useState(1);
  const [cash, setCash] = useState(1000000); // 초기 현금
  const [holdings, setHoldings] = useState(
    companies.reduce((acc, c) => ({ ...acc, [c.id]: 0 }), {})
  );
  const [prices, setPrices] = useState(
    companies.reduce((acc, c) => ({ ...acc, [c.id]: c.basePrice }), {})
  );
  const [changes, setChanges] = useState(
    companies.reduce((acc, c) => ({ ...acc, [c.id]: 0 }), {})
  );

  // 힌트 관련 상태
  const [hintCount, setHintCount] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const maxHints = 5;
  const hints = [
    "IT 산업 성장 예상",
    "자동차 산업 회복 가능성",
    "금리 인상 가능성",
    "친환경 관련 투자 유망",
    "AI 기술 기업 상승 가능성",
  ];

  // 디버깅용 상태 확인
  useEffect(() => {
    const totalStockValue = companies.reduce(
      (sum, c) => sum + (holdings[c.id] * prices[c.id] || 0),
      0
    );
    console.log("===== 상태 확인 =====");
    console.log("Round:", round);
    console.log("Cash:", cash);
    console.log("Holdings:", holdings);
    console.log("Prices:", prices);
    console.log("총 자산(현금+주식):", cash + totalStockValue);
    console.log("====================");
  }, [round, cash, holdings, prices]);

  // 힌트 사용
  const handleUseHint = () => {
    if (hintCount >= maxHints) {
      alert("힌트는 최대 5회만 사용 가능합니다!");
      return;
    }
    setHintCount(hintCount + 1);
    setShowHint(true);
  };

  // 매수
  const handleBuy = (companyId) => {
    const price = prices[companyId];
    if (cash >= price) {
      setCash(cash - price);
      setHoldings({ ...holdings, [companyId]: holdings[companyId] + 1 });
    } else {
      alert("현금이 부족합니다!");
    }
  };

  // 매도
  const handleSell = (companyId) => {
    if (holdings[companyId] > 0) {
      setCash(cash + prices[companyId]);
      setHoldings({ ...holdings, [companyId]: holdings[companyId] - 1 });
    } else {
      alert("보유 주식이 없습니다!");
    }
  };

  // 다음 라운드
  const handleNextRound = () => {
    const newPrices = {};
    const newChanges = {};
    companies.forEach((c) => {
      const changePercent = parseFloat((Math.random() * 40 - 20).toFixed(2));
      newPrices[c.id] = Math.max(
        1000,
        Math.round(prices[c.id] * (1 + changePercent / 100))
      );
      newChanges[c.id] = changePercent;
    });
    setPrices(newPrices);
    setChanges(newChanges);

    if (round >= totalRounds) {
      const totalAssets =
        cash +
        companies.reduce((sum, c) => sum + holdings[c.id] * newPrices[c.id], 0);
      navigate("/result", { state: { assets: totalAssets } });
    } else {
      setRound(round + 1);
      setShowHint(false);
    }
  };

  const totalAssets =
    cash + companies.reduce((sum, c) => sum + holdings[c.id] * prices[c.id], 0);

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-screen-md mx-auto">
      {/* 라운드 정보 & 버튼 */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
        <h1 className="text-2xl font-bold">
          Round {round} / {totalRounds}
        </h1>
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={handleUseHint}
            disabled={hintCount >= maxHints}
            className="px-4 py-2 bg-yellow-400 text-white rounded-lg"
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
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96 text-center">
            <h2 className="text-xl font-bold mb-4">💡 투자 힌트</h2>
            <p className="text-gray-700 mb-4">
              {hints[Math.floor(Math.random() * hints.length)]}
            </p>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              onClick={() => setShowHint(false)}
            >
              닫기
            </button>
          </div>
        </div>
      )}

      {/* 회사별 주식 / 변동률 */}
      <div className="bg-white p-4 rounded-2xl shadow space-y-4">
        <h2 className="text-xl font-semibold mb-2">
          회사별 주가 변동률 / 투자
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {companies.map((c) => (
            <div
              key={c.id}
              className="border rounded-xl p-3 flex flex-col items-center"
            >
              <span className="font-semibold">{c.name}</span>
              <span
                className={`font-bold ${
                  changes[c.id] > 0
                    ? "text-red-500"
                    : changes[c.id] < 0
                    ? "text-blue-500"
                    : "text-gray-500"
                }`}
              >
                {changes[c.id] > 0 ? `+${changes[c.id]}%` : `${changes[c.id]}%`}
              </span>
              <span className="mt-1">
                가격: {prices[c.id].toLocaleString()} 원
              </span>
              <span className="mt-1">보유: {holdings[c.id]} 주</span>
              <div className="flex flex-col sm:flex-row gap-1 mt-2">
                <button
                  onClick={() => handleBuy(c.id)}
                  className="px-2 py-1 bg-green-500 text-white rounded-lg"
                >
                  매수
                </button>
                <button
                  onClick={() => handleSell(c.id)}
                  className="px-2 py-1 bg-red-500 text-white rounded-lg"
                >
                  매도
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 팀 자산 */}
      <div className="bg-white p-4 rounded-2xl shadow space-y-2 text-center">
        <h2 className="text-xl font-semibold">팀 자산</h2>
        <p className="text-lg font-bold">{totalAssets.toLocaleString()} 원</p>
        <p>현금: {cash.toLocaleString()} 원</p>
      </div>
    </div>
  );
}
