"use client"

import { AuthPage } from "@/components/auth-page"
import { Dashboard } from "@/components/dashboard"
import { useAuth } from "@/context/AuthContext"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"

export default function Home() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen">
      {!user ? (
        <AuthPage />
      ) : (
        <Dashboard
          onLogout={async () => {
            await signOut(auth)
          }}
        />
      )}
    </main>
  )
}
