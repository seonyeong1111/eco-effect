import React, { useMemo } from 'react'
import { useGameStore } from '../store/gameStore'
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function AssetDashboard() {
  const { teams, history } = useGameStore()

  const chartData = useMemo(()=>{
    // Build data points per round with each team's assets
    const rounds = history.map(h => ({ round: h.round, year: h.year, ...Object.fromEntries(h.teams.map(t=>[t.name, t.assets])) }))
    return rounds
  }, [history])

  return (
    <div className="card">
      <h2 className="text-lg font-semibold mb-3">자산 현황 & 변동</h2>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2">팀</th>
                <th className="py-2">자산</th>
              </tr>
            </thead>
            <tbody>
              {teams.map(t => (
                <tr key={t.id} className="border-b">
                  <td className="py-2">{t.name}</td>
                  <td className="py-2">{t.assets.toLocaleString()}원</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="year"/>
              <YAxis/>
              <Tooltip/>
              <Legend/>
              {teams.map((t, idx)=> (
                <Line key={t.id} type="monotone" dataKey={t.name} dot={false} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
