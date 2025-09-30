"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Cloud, Lock, Mail } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { auth } from "@/lib/firebase"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { useRouter } from "next/navigation"

export function AuthPage() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()


  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [signupEmail, setSignupEmail] = useState("")
  const [signupPassword, setSignupPassword] = useState("")

  const handleAuth = async (e: React.FormEvent<HTMLFormElement>, type: "login" | "signup") => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (type === "signup") {
        await createUserWithEmailAndPassword(auth, signupEmail, signupPassword)
        toast({
          title: "Inscription réussie",
          description: "Bienvenue sur CloudFiles",
        })
      } else {
        console.log("Tentative de connexion avec:", loginEmail) 
        const userCredential = await signInWithEmailAndPassword(auth, loginEmail, loginPassword)
        console.log("Connexion réussie:", userCredential.user)
        
        toast({
          title: "Connexion réussie",
          description: "Bienvenue sur CloudFiles",
        })
        router.refresh()
      }
    } catch (error: any) {
      console.error("Erreur d'authentification:", error) 
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 gradient-cyan-purple opacity-20 blur-3xl rounded-full" />
        <div className="absolute bottom-0 left-0 w-96 h-96 gradient-purple-pink opacity-20 blur-3xl rounded-full" />
      </div>

      <div className="w-full max-w-md space-y-8">
        {/* Logo and Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="rounded-2xl gradient-cyan-purple p-4 ring-1 ring-primary/20 shadow-lg shadow-primary/20">
              <Cloud className="h-12 w-12 text-white" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight text-balance bg-gradient-to-r from-cyan via-purple to-pink bg-clip-text text-transparent">
              CloudFiles
            </h1>
            <p className="text-muted-foreground text-pretty">Gérez vos fichiers en toute simplicité, partout</p>
          </div>
        </div>

        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle>Bienvenue</CardTitle>
            <CardDescription>Connectez-vous ou créez un compte pour continuer</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Se connecter</TabsTrigger>
                <TabsTrigger value="signup">S'inscrire</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4">
                <form onSubmit={(e) => handleAuth(e, "login")} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-cyan" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="vous@exemple.com"
                        className="pl-10"
                        required
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Mot de passe</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-purple" />
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full gradient-cyan-purple hover:opacity-90" disabled={isLoading}>
                    {isLoading ? "Connexion..." : "Se connecter"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={(e) => handleAuth(e, "signup")} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-cyan" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="vous@exemple.com"
                        className="pl-10"
                        required
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Mot de passe</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-purple" />
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        required
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full gradient-purple-pink hover:opacity-90" disabled={isLoading}>
                    {isLoading ? "Création..." : "Créer un compte"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground">Stockage sécurisé avec Firebase</p>
      </div>
    </div>
  )
}