export const SECTORS = ['Tech','Finance','Energy','Healthcare','Consumer','Industrial']

export const EVENTS = [
  { id: 1,  hint: '닷컴 버블 붕괴 조짐', effects: { Tech: -0.25, Finance: -0.05 } },
  { id: 2,  hint: '저금리 기조, 금융완화', effects: { Finance: 0.12, Consumer: 0.05 } },
  { id: 3,  hint: '원유 급등', effects: { Energy: 0.18, Industrial: -0.04 } },
  { id: 4,  hint: '바이오 임상 호재', effects: { Healthcare: 0.2 } },
  { id: 5,  hint: '소비 회복, 내수 강세', effects: { Consumer: 0.14 } },
  { id: 6,  hint: '제조 PMI 둔화', effects: { Industrial: -0.08 } },
  { id: 7,  hint: '스마트폰 슈퍼사이클', effects: { Tech: 0.22, Consumer: 0.04 } },
  { id: 8,  hint: '부동산 규제 강화', effects: { Finance: -0.07 } },
  { id: 9,  hint: '전쟁 리스크 확대', effects: { Energy: 0.12, Consumer: -0.06 } },
  { id: 10, hint: '원/달러 급등', effects: { Tech: -0.04, Energy: 0.06 } },
  { id: 11, hint: '금리 인상 사이클', effects: { Finance: 0.08, Tech: -0.05, Consumer: -0.03 } },
  { id: 12, hint: '친환경 보조금 확대', effects: { Industrial: 0.09, Energy: -0.05 } },
  { id: 13, hint: '백신 승인', effects: { Healthcare: 0.18, Consumer: 0.03 } },
  { id: 14, hint: '원자재 가격 급등', effects: { Industrial: -0.05, Consumer: -0.04, Energy: 0.1 } },
  { id: 15, hint: '핀테크 규제 완화', effects: { Finance: 0.15, Tech: 0.05 } },
  { id: 16, hint: '해외여행 재개', effects: { Consumer: 0.12, Energy: 0.02 } },
  { id: 17, hint: '반도체 업황 상승', effects: { Tech: 0.2, Industrial: 0.03 } },
  { id: 18, hint: '의료비 보장 확대', effects: { Healthcare: 0.12 } },
  { id: 19, hint: '전력 공급난', effects: { Energy: 0.14, Industrial: -0.06 } },
  { id: 20, hint: 'AI 투자 붐', effects: { Tech: 0.25, Industrial: 0.04 } },
]

// helper: get random event by round
export function pickRandomEvent() {
  return EVENTS[Math.floor(Math.random() * EVENTS.length)]
}
