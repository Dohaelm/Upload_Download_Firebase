"use client"

import { useState } from "react"
import { AuthPage } from "@/components/auth-page"
import { Dashboard } from "@/components/dashboard"

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  return (
    <main className="min-h-screen">
      {!isAuthenticated ? (
        <AuthPage onAuthSuccess={() => setIsAuthenticated(true)} />
      ) : (
        <Dashboard onLogout={() => setIsAuthenticated(false)} />
      )}
    </main>
  )
}
