"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, File } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface FileUploadProps {
  onFileUpload: (file: File) => void
}

export function FileUpload({ onFileUpload }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (uploadProgress === 100 && pendingFile) {
      onFileUpload(pendingFile)
      toast({
        title: "Fichier uploadé",
        description: `${pendingFile.name} a été uploadé avec succès`,
      })
      setPendingFile(null)
      setIsUploading(false)
      setUploadProgress(0)
    }
  }, [uploadProgress, pendingFile, onFileUpload, toast])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) {
      uploadFile(file)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      uploadFile(file)
    }
  }

  const uploadFile = (file: File) => {
    setPendingFile(file)
    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="rounded-lg gradient-cyan-green p-1.5">
            <Upload className="h-4 w-4 text-white" />
          </div>
          Uploader un fichier
        </CardTitle>
        <CardDescription>Glissez-déposez ou cliquez pour sélectionner</CardDescription>
      </CardHeader>
      <CardContent>
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative rounded-lg border-2 border-dashed p-8 text-center transition-all
            ${isDragging ? "border-cyan bg-cyan/5 scale-[1.02]" : "border-border hover:border-cyan/50"}
          `}
        >
          <input ref={fileInputRef} type="file" onChange={handleFileSelect} className="hidden" />

          {!isUploading ? (
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="rounded-full gradient-cyan-purple p-4 shadow-lg shadow-cyan/20">
                  <File className="h-8 w-8 text-white" />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Glissez votre fichier ici</p>
                <p className="text-xs text-muted-foreground">ou</p>
              </div>
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="w-full border-cyan/50 hover:bg-cyan/10 hover:text-cyan hover:border-cyan"
              >
                Choisir un fichier
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="rounded-full gradient-cyan-green p-4 animate-pulse shadow-lg shadow-green/20">
                  <Upload className="h-8 w-8 text-white" />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-green">Upload en cours...</p>
                <div className="relative h-2 rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full gradient-cyan-green transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-xs text-green">{uploadProgress}%</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
