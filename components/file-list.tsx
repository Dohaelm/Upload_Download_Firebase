"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { FileItem } from "@/components/dashboard"
import { Download, Trash2, Link2, Search, FileText, ImageIcon, File } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface FileListProps {
  files: FileItem[]
  onFileClick: (file: FileItem) => void
  onDeleteFile: (id: string) => void
}

export function FileList({ files, onFileClick, onDeleteFile }: FileListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()

  const filteredFiles = files.filter((file) => file.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date)
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/"))
      return (
        <div className="rounded-lg bg-purple/10 p-2">
          <ImageIcon className="h-5 w-5 text-purple" />
        </div>
      )
    if (type.includes("pdf"))
      return (
        <div className="rounded-lg bg-orange/10 p-2">
          <FileText className="h-5 w-5 text-orange" />
        </div>
      )
    return (
      <div className="rounded-lg bg-cyan/10 p-2">
        <File className="h-5 w-5 text-cyan" />
      </div>
    )
  }

  const handleCopyLink = (file: FileItem) => {
    navigator.clipboard.writeText(file.url)
    toast({
      title: "Lien copié",
      description: "Le lien du fichier a été copié dans le presse-papier",
    })
  }

  const handleDownload = (file: FileItem) => {
    toast({
      title: "Téléchargement",
      description: `Téléchargement de ${file.name}...`,
    })
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Mes fichiers
          <span className="text-xs font-normal px-2 py-1 rounded-full gradient-purple-pink text-white">
            {files.length}
          </span>
        </CardTitle>
        <CardDescription>{files.length} fichier(s) stocké(s)</CardDescription>

        {/* Search */}
        <div className="relative pt-2">
          <Search className="absolute left-3 top-5 h-4 w-4 text-purple" />
          <Input
            placeholder="Rechercher un fichier..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 focus-visible:ring-purple"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {filteredFiles.length === 0 ? (
            <div className="py-12 text-center">
              <File className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-sm text-muted-foreground">
                {searchQuery ? "Aucun fichier trouvé" : "Aucun fichier uploadé"}
              </p>
            </div>
          ) : (
            filteredFiles.map((file) => (
              <div
                key={file.id}
                className="group flex items-center gap-4 rounded-lg border border-border/50 bg-secondary/30 p-4 transition-all hover:bg-secondary/50 hover:border-cyan/30 hover:shadow-lg hover:shadow-cyan/5 cursor-pointer"
                onClick={() => onFileClick(file)}
              >
                {getFileIcon(file.type)}

                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{file.name}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{formatFileSize(file.size)}</span>
                    <span>•</span>
                    <span>{formatDate(file.uploadDate)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="hover:bg-green/10 hover:text-green"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDownload(file)
                    }}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="hover:bg-cyan/10 hover:text-cyan"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCopyLink(file)
                    }}
                  >
                    <Link2 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="hover:bg-orange/10 hover:text-orange"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeleteFile(file.id)
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
