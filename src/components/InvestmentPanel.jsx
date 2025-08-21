import React from 'react'
import { useGameStore } from '../store/gameStore'
import { STOCKS, SECTOR_COLORS } from '../data/stocks'

export default function InvestmentPanel() {
  const { teams, selectedInvestments, setInvestment, status } = useGameStore()

  return (
    <div className="card">
      <h2 className="text-lg font-semibold mb-3">투자하기</h2>
      {teams.length===0 && <div className="text-sm text-gray-500">팀을 먼저 생성하세요.</div>}
      {teams.map(team => {
        const allocations = selectedInvestments[team.id] || {}
        const sum = Object.values(allocations).reduce((a,b)=>a+(+b||0),0)
        return (
          <div key={team.id} className="mb-6">
            <div className="flex items-center justify-between">
              <div className="font-medium">{team.name}</div>
              <div className={"text-sm " + (sum>100 ? "text-red-600":"text-gray-600")}>합계: {Math.round(sum)}%</div>
            </div>
            <div className="grid md:grid-cols-2 gap-3 mt-2">
              {STOCKS.map(stock => (
                <div key={stock.id} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-medium">{stock.name}</div>
                      <div className="text-xs text-gray-500">{stock.sector}</div>
                    </div>
                    <span className="inline-block w-3 h-3 rounded-full" style={{background: SECTOR_COLORS[stock.sector]}} />
                  </div>
                  <input
                    type="range"
                    min="0" max="100" step="5"
                    value={allocations[stock.id] || 0}
                    onChange={(e)=> setInvestment(team.id, stock.id, Number(e.target.value))}
                    disabled={status!=='playing'}
                    className="w-full"
                  />
                  <div className="text-sm mt-1">투자 비율: <b>{allocations[stock.id] || 0}%</b></div>
                </div>
              ))}
            </div>
          </div>
        )
      })}
      <div className="text-xs text-gray-500">* 합계가 100%를 초과하면 자동으로 비율이 정규화되어 정산됩니다.</div>
    </div>
  )
}
