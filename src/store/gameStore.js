import { create } from 'zustand'
import { STOCKS } from '../data/stocks'
import { pickRandomEvent } from '../data/events'

const START_YEAR = 2000
const MAX_ROUNDS = 15
const SEED = 1000000

export const useGameStore = create((set, get) => ({
  round: 1,
  year: START_YEAR,
  maxRounds: MAX_ROUNDS,
  teams: [],
  stocks: STOCKS,
  currentEvent: null,
  selectedInvestments: {}, // {teamId: {stockId: pct}}
  history: [], // [{ round, year, event, teamsSnapshot }]
  leaderboard: [],
  status: 'setup', // setup | playing | finished

  // 팀
  createTeam: (name, leader) => set((state) => ({
    teams: [...state.teams, { id: crypto.randomUUID(), name, leader, members:[leader], assets: SEED }],
  })),
  addMember: (teamId, member) => set((state)=> ({
    teams: state.teams.map(t => t.id===teamId ? { ...t, members:[...t.members, member]} : t )
  })),
  resetGame: () => set({
    round: 1, year: START_YEAR, currentEvent: null, selectedInvestments: {}, history: [], status: 'setup',
    teams: []
  }),

  // 게임 시작
  startGame: () => {
    const ev = pickRandomEvent()
    set({ status:'playing', currentEvent: ev, round:1, year: START_YEAR })
  },

  // 투자 설정
  setInvestment: (teamId, stockId, pct) => set((state)=> ({
    selectedInvestments: {
      ...state.selectedInvestments,
      [teamId]: { ...(state.selectedInvestments[teamId]||{}), [stockId]: pct }
    }
  })),
  clearInvestments: () => set({ selectedInvestments: {} }),

  // 라운드 종료/정산
  endRound: () => {
    const { round, maxRounds, teams, selectedInvestments, stocks, currentEvent, year } = get()

    const rateForStock = (stock) => {
      const sector = stock.sector
      const base = 0 // base 0%
      const bonus = currentEvent?.effects?.[sector] ?? 0
      return base + bonus
    }

    const updatedTeams = teams.map((team) => {
      const allocations = selectedInvestments[team.id] || {}
      // sum allocations cap at 100
      const sum = Object.values(allocations).reduce((a,b)=>a+(+b||0),0)
      const norm = sum>100 ? 100/sum : 1

      let newAssets = team.assets
      for (const [stockId, pctRaw] of Object.entries(allocations)) {
        const pct = (+pctRaw||0)*norm
        const stock = stocks.find(s=> s.id === stockId)
        if (!stock || pct<=0) continue
        const invest = team.assets * (pct/100)
        const rate = rateForStock(stock)
        const settled = invest * (1 + rate)
        newAssets = newAssets - invest + settled
      }
      return { ...team, assets: Math.round(newAssets) }
    })

    // 기록 저장
    const snapshot = updatedTeams.map(t => ({ id:t.id, name:t.name, assets:t.assets }))
    const newHistory = [...get().history, { round, year, event: currentEvent, teams: snapshot, investments: selectedInvestments }]

    // 다음 라운드 or 종료
    const nextRound = round + 1
    const done = nextRound > maxRounds
    set({
      teams: updatedTeams,
      history: newHistory,
      leaderboard: [...updatedTeams].sort((a,b)=> b.assets - a.assets),
      selectedInvestments: {},
      round: done ? maxRounds : nextRound,
      year: done ? START_YEAR + maxRounds -1 : year + 1,
      currentEvent: done ? null : pickRandomEvent(),
      status: done ? 'finished' : 'playing'
    })
  },
}))
