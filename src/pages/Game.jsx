import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// 회사별 초기 가격 설정
const companies = [
  { id: 1, name: "삼성전자", price: 500000 },
  { id: 2, name: "현대자동차", price: 300000 },
  { id: 3, name: "네이버", price: 200000 },
  { id: 4, name: "카카오", price: 150000 },
  { id: 5, name: "LG화학", price: 400000 },
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
    companies.reduce((acc, c) => ({ ...acc, [c.id]: c.price }), {})
  );

  // 디버깅용 상태 확인
  useEffect(() => {
    const totalStockValue = companies.reduce(
      (sum, c) => sum + (holdings[c.id] || 0) * prices[c.id],
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

  const handleBuy = (companyId, quantity) => {
    const totalCost = prices[companyId] * quantity;
    if (cash < totalCost) return alert("현금이 부족합니다!");
    setCash(cash - totalCost);
    setHoldings((prev) => ({
      ...prev,
      [companyId]: prev[companyId] + quantity,
    }));
  };

  const handleSell = (companyId, quantity) => {
    if ((holdings[companyId] || 0) < quantity)
      return alert("보유 주식이 부족합니다!");
    const totalGain = prices[companyId] * quantity;
    setCash(cash + totalGain);
    setHoldings((prev) => ({
      ...prev,
      [companyId]: prev[companyId] - quantity,
    }));
  };

  const handleNextRound = () => {
    // 주가 변동률 랜덤 계산 (-20% ~ +20%)
    const newPrices = {};
    companies.forEach((c) => {
      const changePercent = parseFloat((Math.random() * 40 - 20).toFixed(2));
      newPrices[c.id] = Math.max(
        1000,
        Math.round(prices[c.id] * (1 + changePercent / 100))
      );
      c.change = changePercent; // 변동률 저장
    });
    setPrices(newPrices);
    if (round >= totalRounds) {
      const totalStockValue = companies.reduce(
        (sum, c) => sum + (holdings[c.id] || 0) * newPrices[c.id],
        0
      );
      navigate("/result", { state: { totalAssets: cash + totalStockValue } });
    } else {
      setRound(round + 1);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* 라운드 */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          Round {round} / {totalRounds}
        </h1>
        <button
          onClick={handleNextRound}
          className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold"
        >
          {round >= totalRounds ? "최종 결과 보기" : "다음 라운드"}
        </button>
      </div>

      {/* 회사별 주식 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {companies.map((c) => (
          <div
            key={c.id}
            className="border rounded-xl p-3 flex flex-col items-center"
          >
            <span className="font-semibold">{c.name}</span>
            <span
              className={`font-bold ${
                c.change > 0
                  ? "text-red-500"
                  : c.change < 0
                  ? "text-blue-500"
                  : "text-gray-500"
              }`}
            >
              {c.change
                ? c.change > 0
                  ? `+${c.change}%`
                  : `${c.change}%`
                : "0%"}
            </span>
            <span className="mt-1 text-gray-700">
              가격: {prices[c.id].toLocaleString()} 원
            </span>
            <span className="mt-1 text-gray-700">
              보유: {holdings[c.id]} 주
            </span>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => handleBuy(c.id, 1)}
                className="px-2 py-1 bg-green-500 text-white rounded-lg"
              >
                매수 +1
              </button>
              <button
                onClick={() => handleSell(c.id, 1)}
                className="px-2 py-1 bg-red-500 text-white rounded-lg"
              >
                매도 -1
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 팀 자산 */}
      <div className="bg-white p-4 rounded-2xl shadow space-y-3">
        <h2 className="text-xl font-semibold">팀 자산</h2>
        <p className="text-lg font-bold">
          {(
            cash +
            companies.reduce(
              (sum, c) => sum + (holdings[c.id] || 0) * prices[c.id],
              0
            )
          ).toLocaleString()}{" "}
          원
        </p>
        <p className="text-gray-500">현금: {cash.toLocaleString()} 원</p>
      </div>
    </div>
  );
}
