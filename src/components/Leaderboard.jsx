import React from 'react'
import { useGameStore } from '../store/gameStore'

export default function Leaderboard() {
  const { leaderboard } = useGameStore()
  if (!leaderboard?.length) return (
    <div className="card">
      <h2 className="text-lg font-semibold mb-3">리더보드</h2>
      <div className="text-sm text-gray-500">라운드를 진행하면 순위가 표시됩니다.</div>
    </div>
  )
  return (
    <div className="card">
      <h2 className="text-lg font-semibold mb-3">리더보드</h2>
      <ol className="space-y-2">
        {leaderboard.map((t, i)=> (
          <li key={t.id} className="flex justify-between">
            <span>{i+1}위 - {t.name}</span>
            <span className="font-medium">{t.assets.toLocaleString()}원</span>
          </li>
        ))}
      </ol>
    </div>
  )
}
