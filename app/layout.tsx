import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { AuthProvider } from '@/context/AuthContext' 

export const metadata: Metadata = {
  title: 'CloudFiles - Gestionnaire de fichiers',
  description: 'Gérez vos fichiers en toute simplicité avec CloudFiles',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <AuthProvider> 
          {children}
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}