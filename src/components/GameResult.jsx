import React from 'react'
import { useGameStore } from '../store/gameStore'

export default function GameResult() {
  const { history } = useGameStore()
  const last = history[history.length-1]
  if (!last) return null
  const winner = [...last.teams].sort((a,b)=> b.assets - a.assets)[0]

  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4">최종 결과</h2>
      <div className="mb-4">
        🏆 우승 팀: <b>{winner.name}</b> — {winner.assets.toLocaleString()}원
      </div>
      <div className="space-y-3">
        {history.map(h => (
          <div key={h.round} className="border rounded p-3">
            <div className="font-medium">라운드 {h.round} • {h.year}년 — 힌트: {h.event?.hint}</div>
            <div className="text-sm text-gray-600">투자 & 결과 요약</div>
            <ul className="text-sm mt-2 list-disc pl-5">
              {h.teams.map(t => (
                <li key={t.id}>{t.name}: {t.assets.toLocaleString()}원</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
