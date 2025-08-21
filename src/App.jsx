import React from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'

export default function App() {
  const { pathname } = useLocation()
  return (
    <div>
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container-like py-3 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold">💹 재태크 팀 게임</Link>
          <nav className="flex gap-4">
            <Link to="/" className={pathname==='/'?'font-bold':''}>홈</Link>
            <Link to="/game" className={pathname.startsWith('/game')?'font-bold':''}>게임</Link>
            <Link to="/result" className={pathname.startsWith('/result')?'font-bold':''}>결과</Link>
          </nav>
        </div>
      </header>
      <main className="container-like py-6">
        <Outlet />
      </main>
      <footer className="container-like py-10 text-center text-sm text-gray-500">
        © 2025 Prototype • React + Vite + Tailwind + Zustand
      </footer>
    </div>
  )
}
