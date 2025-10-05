"use client"

import type { FileMetadata } from "@/services/firestoreFiles"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Download, Trash2, Link2, FileText, ImageIcon, File } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface FileDetailsModalProps {
  file: FileMetadata
  onClose: () => void
  onDelete: () => void
}

export function FileDetailsModal({ file, onClose, onDelete }: FileDetailsModalProps) {
  const { toast } = useToast()

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(file.url)
    toast({
      title: "Lien copié",
      description: "Le lien du fichier a été copié dans le presse-papier",
    })
  }

  const handleDownload = () => {
    const link = document.createElement("a")
    link.href = file.url
    link.download = file.name
    link.target = "_blank"
    link.rel = "noopener noreferrer"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Téléchargement",
      description: `Téléchargement de ${file.name}...`,
    })
  }

  const handleDelete = () => {
    onDelete()
    toast({
      title: "Fichier supprimé",
      description: `${file.name} a été supprimé`,
      variant: "destructive",
    })
    onClose()
  }

  const getFileIcon = () => {
    if (file.type.startsWith("image/"))
      return (
        <div className="rounded-2xl gradient-purple-pink p-6 shadow-lg shadow-purple/20">
          <ImageIcon className="h-12 w-12 text-white" />
        </div>
      )
    if (file.type.includes("pdf"))
      return (
        <div className="rounded-2xl gradient-orange-pink p-6 shadow-lg shadow-orange/20">
          <FileText className="h-12 w-12 text-white" />
        </div>
      )
    return (
      <div className="rounded-2xl gradient-cyan-purple p-6 shadow-lg shadow-cyan/20">
        <File className="h-12 w-12 text-white" />
      </div>
    )
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Détails du fichier</DialogTitle>
          <DialogDescription>Informations et actions pour ce fichier</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Preview */}
          <div className="rounded-lg border border-border/50 bg-secondary/30 p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan/5 via-purple/5 to-pink/5 -z-10" />
            {file.type.startsWith("image/") ? (
              <img
                src={file.url || "/placeholder.svg"}
                alt={file.name}
                className="mx-auto max-h-64 rounded-lg object-contain shadow-lg"
              />
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                {getFileIcon()}
                <p className="mt-4 text-sm text-muted-foreground">Aperçu non disponible</p>
              </div>
            )}
          </div>

          {/* File Info */}
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1 rounded-lg border border-cyan/20 bg-cyan/5 p-3">
                <p className="text-sm text-cyan">Nom du fichier</p>
                <p className="font-medium break-all">{file.name}</p>
              </div>
              <div className="space-y-1 rounded-lg border border-purple/20 bg-purple/5 p-3">
                <p className="text-sm text-purple">Taille</p>
                <p className="font-medium">{formatFileSize(file.size)}</p>
              </div>
              <div className="space-y-1 rounded-lg border border-orange/20 bg-orange/5 p-3">
                <p className="text-sm text-orange">Type</p>
                <p className="font-medium">{file.type}</p>
              </div>
              <div className="space-y-1 rounded-lg border border-green/20 bg-green/5 p-3">
                <p className="text-sm text-green">Date d'upload</p>
                <p className="font-medium">{formatDate(file.uploadDate || new Date())}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleDownload} className="flex-1 gradient-cyan-green hover:opacity-90">
              <Download className="mr-2 h-4 w-4" />
              Télécharger
            </Button>
            <Button
              onClick={handleCopyLink}
              variant="outline"
              className="flex-1 bg-transparent border-purple/50 hover:bg-purple/10 hover:text-purple hover:border-purple"
            >
              <Link2 className="mr-2 h-4 w-4" />
              Copier le lien
            </Button>
            <Button
              onClick={handleDelete}
              variant="destructive"
              className="flex-1 gradient-orange-pink hover:opacity-90"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}