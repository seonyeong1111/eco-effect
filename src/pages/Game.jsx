import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/**
 * ===============================
 * 1) 종목 정의 (원래 5개 포함 + 확장 15개 유지)
 *    - id: 고유값
 *    - basePrice: 시작 가격(원)
 *    - sector: 연도별 시나리오 바이어스 적용 섹터
 * ===============================
 */
const initialCompanies = [
  { id: 1, name: "삼성전자", basePrice: 70000, sector: "tech" },
  { id: 2, name: "현대자동차", basePrice: 200000, sector: "auto" },
  { id: 3, name: "네이버", basePrice: 200000, sector: "internet" },
  { id: 4, name: "카카오", basePrice: 80000, sector: "platform" },
  { id: 5, name: "LG화학", basePrice: 450000, sector: "battery" },
  { id: 6, name: "SK하이닉스", basePrice: 120000, sector: "tech" },
  { id: 7, name: "기아", basePrice: 110000, sector: "auto" },
  { id: 8, name: "Korea Zinc", basePrice: 500000, sector: "metal" },
  { id: 9, name: "대한항공", basePrice: 24000, sector: "airline" },
  { id: 10, name: "HMM", basePrice: 18000, sector: "logistics" },
  { id: 11, name: "한화시스템", basePrice: 13500, sector: "defense" },
  { id: 12, name: "한국전력(KEPCO)", basePrice: 20000, sector: "utility" },
  { id: 13, name: "KB금융", basePrice: 52000, sector: "bank" },
  { id: 14, name: "셀트리온", basePrice: 170000, sector: "bio" },
  { id: 15, name: "KOSPI ETF", basePrice: 30000, sector: "etf" },
];

/**
 * ===============================
 * 2) 10년(2016~2025) 시나리오
 *    - baseVol: 연간 변동성 정도(±X%)
 *    - tilts: 섹터별 기대방향/강도
 *    - hint: 해당 연도 요약(힌트)
 * ===============================
 */
const SCENARIOS = {
  2016: {
    baseVol: 12,
    tilts: {
      internet: { direction: "up", magnitude: "low" },
      platform: { direction: "up", magnitude: "low" },
      auto: { direction: "down", magnitude: "low" },
    },
    hint: "완만한 성장, 온라인 비즈 강세 시작. 자동차 변동성 유의.",
  },
  2017: {
    baseVol: 13,
    tilts: {
      tech: { direction: "up", magnitude: "high" }, // 반도체 슈퍼사이클
      battery: { direction: "up", magnitude: "low" },
    },
    hint: "반도체 슈퍼사이클: Tech 강세, 2차전지 관심.",
  },
  2018: {
    baseVol: 15,
    tilts: {
      tech: { direction: "down", magnitude: "mid" }, // 무역분쟁/조정
      auto: { direction: "down", magnitude: "low" },
      defense: { direction: "up", magnitude: "low" },
    },
    hint: "무역분쟁 영향: 성장주 조정, 방산 방어력.",
  },
  2019: {
    baseVol: 11,
    tilts: {
      internet: { direction: "up", magnitude: "low" },
      platform: { direction: "up", magnitude: "low" },
      airline: { direction: "up", magnitude: "low" },
      logistics: { direction: "up", magnitude: "low" },
    },
    hint: "완만한 회복: 온라인, 항공/물류 개선.",
  },
  2020: {
    baseVol: 18,
    tilts: {
      bio: { direction: "up", magnitude: "high" },
      internet: { direction: "up", magnitude: "mid" },
      platform: { direction: "up", magnitude: "mid" },
      airline: { direction: "down", magnitude: "high" },
      logistics: { direction: "down", magnitude: "mid" },
      auto: { direction: "down", magnitude: "mid" },
      etf: { direction: "down", magnitude: "mid" },
    },
    hint: "팬데믹 충격: 바이오/온라인 강세, 여행·운송 약세.",
  },
  2021: {
    baseVol: 12,
    tilts: {
      airline: { direction: "up", magnitude: "mid" },
      logistics: { direction: "up", magnitude: "low" },
      auto: { direction: "up", magnitude: "low" },
      bio: { direction: "down", magnitude: "low" },
    },
    hint: "회복 국면 & 항공 M&A: 항공/운송 회복.",
  },
  2022: {
    baseVol: 16,
    tilts: {
      tech: { direction: "down", magnitude: "mid" },
      internet: { direction: "down", magnitude: "low" },
      platform: { direction: "down", magnitude: "low" },
      utility: { direction: "up", magnitude: "low" },
      bank: { direction: "up", magnitude: "low" },
      etf: { direction: "down", magnitude: "mid" },
    },
    hint: "긴축/인플레: 성장주 약세, 방어·금융 선방.",
  },
  2023: {
    baseVol: 13,
    tilts: {
      tech: { direction: "up", magnitude: "mid" }, // AI/반도체 투자
      battery: { direction: "up", magnitude: "low" },
      metal: { direction: "up", magnitude: "low" },
    },
    hint: "AI/반도체 투자 모멘텀: 밸류체인 우호적.",
  },
  2024: {
    baseVol: 12,
    tilts: {
      bank: { direction: "down", magnitude: "low" }, // 규제/공매도 이슈
      metal: { direction: "up", magnitude: "low" }, // 지배구조/인수전 테마
      etf: { direction: "down", magnitude: "low" },
    },
    hint: "규제·지배구조 변수: 금융 변동, 소재 테마.",
  },
  2025: {
    baseVol: 15,
    tilts: {
      tech: { direction: "up", magnitude: "high" }, // AI 수요
      defense: { direction: "up", magnitude: "mid" }, // 지정학
      etf: { direction: "down", magnitude: "mid" }, // 지수 변동성 확대
    },
    hint: "AI·지정학: 반도체 강세, 방산 수요, 지수 변동성 확대.",
  },
};

function tiltShift(mag) {
  switch (mag) {
    case "high":
      return 10;
    case "mid":
      return 6;
    case "low":
    default:
      return 3;
  }
}

function round2(n) {
  return Math.round(n * 100) / 100;
}

/** 연도/섹터 기반 확률적 변동률(%) 생성 */
function genYearlyChangePct(sector, year) {
  const sc = SCENARIOS[year];
  const baseVol = sc?.baseVol ?? 12;
  const base = (Math.random() * 2 - 1) * baseVol; // 균등 [-baseVol, +baseVol]
  const tilt = sc?.tilts?.[sector];

  if (!tilt) return round2(base);

  const shift = tiltShift(tilt.magnitude) * (tilt.direction === "up" ? 1 : -1);
  // 확률적 기울기: base 0.7 + tilted 0.3
  const mixed = 0.7 * base + 0.3 * (base + shift);
  // 꼬리 위험 약간
  const tailKick = Math.random() < 0.1 ? (tilt.direction === "up" ? 2 : -2) : 0;

  return round2(mixed + tailKick);
}

export default function Game() {
  const navigate = useNavigate();

  // ✅ 10년: 2016~2025
  const YEARS = useMemo(
    () => Array.from({ length: 10 }, (_, i) => 2016 + i),
    []
  );
  const totalYears = YEARS.length;

  // 상태
  const [companies] = useState(initialCompanies);
  const [yearIndex, setYearIndex] = useState(0); // 0 => 2016
  const year = YEARS[yearIndex];

  const [cash, setCash] = useState(1_000_000); // 초기 현금
  const [holdings, setHoldings] = useState(
    companies.reduce((acc, c) => ((acc[c.id] = 0), acc), {})
  );
  const [prices, setPrices] = useState(
    companies.reduce((acc, c) => ((acc[c.id] = c.basePrice), acc), {})
  );
  const [changes, setChanges] = useState(
    companies.reduce((acc, c) => ((acc[c.id] = 0), acc), {})
  );

  // 힌트(최대 5회 사용)
  const [hintCount, setHintCount] = useState(5);
  const [showHint, setShowHint] = useState(false);
  const hintText = SCENARIOS[year]?.hint ?? "해당 연도 시나리오 정보 없음";

  // 총자산
  const totalAssets =
    cash +
    companies.reduce(
      (sum, c) => sum + (holdings[c.id] || 0) * (prices[c.id] || 0),
      0
    );

  // 자산 히스토리(그래프)
  const [assetHistory, setAssetHistory] = useState([
    { year: YEARS[0], totalAssets: 1_000_000 },
  ]);

  // 매수/매도
  const handleBuy = (companyId) => {
    const price = prices[companyId];
    if (cash < price) {
      alert("현금이 부족합니다!");
      return;
    }
    setCash((v) => v - price);
    setHoldings((prev) => ({ ...prev, [companyId]: prev[companyId] + 1 }));
  };

  const handleSell = (companyId) => {
    if ((holdings[companyId] || 0) <= 0) {
      alert("보유 주식이 없습니다!");
      return;
    }
    const price = prices[companyId];
    setCash((v) => v + price);
    setHoldings((prev) => ({ ...prev, [companyId]: prev[companyId] - 1 }));
  };

  // 힌트 사용
  const handleUseHint = () => {
    if (hintCount <= 0) return;
    setShowHint(true);
    setHintCount((n) => n - 1);
  };

  // 다음 연도
  const handleNextYear = () => {
    // 현재 연도(year)에 대한 수익률 계산 → 가격 갱신
    const newPrices = {};
    const newChanges = {};
    companies.forEach((c) => {
      const pct = genYearlyChangePct(c.sector, year);
      const next = Math.max(
        1000,
        Math.round((prices[c.id] || 0) * (1 + pct / 100))
      );
      newPrices[c.id] = next;
      newChanges[c.id] = pct;
    });

    setPrices(newPrices);
    setChanges(newChanges);

    // 연도 종료 시점 자산 기록
    const newTotalAssets =
      cash +
      companies.reduce(
        (sum, c) => sum + (holdings[c.id] || 0) * newPrices[c.id],
        0
      );

    setAssetHistory((prev) => {
      const exists = prev.some((d) => d.year === year);
      const nextArr = exists
        ? prev.map((d) =>
            d.year === year ? { ...d, totalAssets: newTotalAssets } : d
          )
        : [...prev, { year, totalAssets: newTotalAssets }];
      return nextArr.sort((a, b) => a.year - b.year);
    });

    // 마지막 연도였으면 결과 이동
    if (yearIndex >= totalYears - 1) {
      navigate("/result", { state: { assets: newTotalAssets } });
      return;
    }

    // 다음 연도로
    setYearIndex((i) => i + 1);
    setShowHint(false);
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-screen-lg mx-auto">
      {/* 상단: 현재 연도 / 버튼 */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
        <h1 className="text-2xl font-bold">
          Year {year} / {YEARS[totalYears - 1]}
        </h1>
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={handleUseHint}
            disabled={hintCount <= 0}
            className={`px-4 py-2 rounded-xl font-semibold ${
              hintCount > 0
                ? "bg-purple-600 hover:bg-purple-700 text-white"
                : "bg-gray-400 text-white cursor-not-allowed"
            }`}
          >
            힌트 보기 ({hintCount}회 남음)
          </button>
          <button
            onClick={handleNextYear}
            className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold"
          >
            {yearIndex >= totalYears - 1 ? "최종 결과 보기" : "다음 연도"}
          </button>
        </div>
      </div>

      {/* 힌트 박스 (사용 시에만 노출) */}
      {showHint && (
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl">
          <div className="font-semibold text-yellow-800">해당 연도 힌트</div>
          <div className="text-yellow-700">{hintText}</div>
          <div className="text-xs text-yellow-700 mt-2">
            * 힌트는 총 5회까지 사용할 수 있어요.
          </div>
        </div>
      )}

      {/* 회사 카드 */}
      <div className="bg-white p-4 rounded-2xl shadow space-y-4">
        <h2 className="text-xl font-semibold">회사별 주가 / 변동률 / 보유</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {companies.map((c) => (
            <div
              key={c.id}
              className="border rounded-xl p-3 flex flex-col items-center text-center"
            >
              <span className="font-semibold">{c.name}</span>
              <span className="text-xs text-gray-500 mb-1">[{c.sector}]</span>
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
              <span className="mt-1">
                보유: {(holdings[c.id] || 0).toLocaleString()} 주
              </span>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleBuy(c.id)}
                  className="px-2 py-1 bg-green-500 text-white rounded-lg"
                >
                  매수 +1
                </button>
                <button
                  onClick={() => handleSell(c.id)}
                  className="px-2 py-1 bg-red-500 text-white rounded-lg"
                >
                  매도 -1
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

      {/* 총자산 그래프 */}
      <div className="bg-white p-4 rounded-2xl shadow">
        <h2 className="text-xl font-semibold mb-2">총자산 그래프</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={[...assetHistory].sort((a, b) => a.year - b.year)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis
              tickFormatter={(v) => `${Math.round(v / 1000)}k`}
              width={70}
            />
            <Tooltip
              formatter={(value) => `${Number(value).toLocaleString()} 원`}
              labelFormatter={(label) => `${label}년`}
            />
            <Line
              type="monotone"
              dataKey="totalAssets"
              stroke="#8884d8"
              strokeWidth={2}
              dot
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
