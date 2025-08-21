import React from 'react'
import TeamManager from '../components/TeamManager'

export default function Home() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <TeamManager />
      <div className="card">
        <h2 className="text-lg font-semibold mb-3">게임 소개</h2>
        <ul className="list-disc pl-5 space-y-2 text-sm">
          <li>팀을 만들고 시드머니(1,000,000원)로 15라운드 동안 운용합니다.</li>
          <li>라운드마다 사건 힌트를 받아 업종/종목에 분산 투자합니다.</li>
          <li>정산 후 리더보드로 경쟁하고, 최종 우승팀을 가립니다.</li>
        </ul>
        <div className="mt-4 text-sm text-gray-600">
          * 본 프로토타입은 교육/체험용입니다.
        </div>
      </div>
    </div>
  )
}
