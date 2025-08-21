import React from 'react'
import { useGameStore } from '../store/gameStore'

export default function RoundController() {
  const { round, year, maxRounds, status, currentEvent, startGame, endRound } = useGameStore()
  return (
    <div className="card flex items-center justify-between gap-4">
      <div>
        <div className="text-lg font-semibold">라운드 {round} / {maxRounds} <span className="text-gray-500">({year}년)</span></div>
        {status==='playing' && currentEvent && (
          <div className="text-sm text-gray-700 mt-1">📰 사건 힌트: <span className="font-medium">{currentEvent.hint}</span></div>
        )}
      </div>
      <div className="flex gap-2">
        <button className="btn btn-primary" onClick={startGame} disabled={status!=='setup'}>게임 시작</button>
        <button className="btn btn-danger" onClick={endRound} disabled={status!=='playing'}>라운드 종료 & 정산</button>
      </div>
    </div>
  )
}
