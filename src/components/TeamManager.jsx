import React, { useState } from 'react'
import { useGameStore } from '../store/gameStore'

export default function TeamManager() {
  const { teams, createTeam, addMember, status } = useGameStore()
  const [name, setName] = useState('')
  const [leader, setLeader] = useState('')
  const [memberName, setMemberName] = useState('')
  const [selectedTeam, setSelectedTeam] = useState(null)

  return (
    <div className="card">
      <h2 className="text-lg font-semibold mb-3">팀 관리</h2>
      <div className="space-y-2">
        <input className="border rounded px-3 py-2 w-full" placeholder="팀 이름" value={name} onChange={e=>setName(e.target.value)} />
        <input className="border rounded px-3 py-2 w-full" placeholder="팀장 이름" value={leader} onChange={e=>setLeader(e.target.value)} />
        <button className="btn btn-primary w-full" onClick={()=>{ if(name && leader) { createTeam(name, leader); setName(''); setLeader('') }}} disabled={status!=='setup'}>팀 생성 (시드머니 1,000,000원)</button>
      </div>
      <hr className="my-4"/>
      <div className="space-y-2">
        <select className="border rounded px-3 py-2 w-full" onChange={e=>setSelectedTeam(e.target.value)}>
          <option value="">팀 선택</option>
          {teams.map(t=> <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
        <div className="flex gap-2">
          <input className="border rounded px-3 py-2 flex-1" placeholder="팀원 이름" value={memberName} onChange={e=>setMemberName(e.target.value)} />
          <button className="btn btn-success" onClick={()=>{ if(selectedTeam && memberName) { addMember(selectedTeam, memberName); setMemberName('') } }} disabled={!selectedTeam || !memberName}>추가</button>
        </div>
      </div>
      <ul className="mt-4 space-y-2">
        {teams.map(t=> (
          <li key={t.id} className="border rounded p-3">
            <div className="font-medium">{t.name} <span className="text-sm text-gray-500">({t.assets.toLocaleString()}원)</span></div>
            <div className="text-sm text-gray-600">팀장: {t.leader}</div>
            <div className="text-sm text-gray-600">팀원: {t.members.join(', ')}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}
