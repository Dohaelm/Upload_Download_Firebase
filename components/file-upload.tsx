"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, File } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useUploadThing } from "@/lib/uploadthing"
import { addFileMetadata, type FileMetadata } from "@/services/firestoreFiles"

interface FileUploadProps {
  onFileUpload: (file: FileMetadata) => void
}

export function FileUpload({ onFileUpload }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const { startUpload } = useUploadThing("fileUploader", {
    onClientUploadComplete: async (res) => {
      if (!res || res.length === 0) {
        setIsUploading(false)
        setUploadProgress(0)
        return
      }

      // Process each uploaded file
      for (const uploadedFile of res) {
        try {
          console.log("Uploaded file from UploadThing:", uploadedFile)

          // Save metadata to Firestore
          const fileMetadata = {
            name: uploadedFile.name,
            size: uploadedFile.size,
            type: uploadedFile.type || "application/octet-stream",
            url: uploadedFile.url,
          }

          console.log("Saving to Firestore:", fileMetadata)
          const docId = await addFileMetadata(fileMetadata)
          console.log("Firestore doc ID:", docId)

          // Call parent callback with complete metadata including Firestore ID
          const completeFile: FileMetadata = {
            id: docId,
            name: uploadedFile.name,
            size: uploadedFile.size,
            type: uploadedFile.type || "application/octet-stream",
            url: uploadedFile.url,
            uploadDate: new Date(),
          }

          console.log("Calling onFileUpload with:", completeFile)
          onFileUpload(completeFile)

          toast({
            title: "Fichier uploadé",
            description: `${uploadedFile.name} a été uploadé avec succès`,
          })
        } catch (error: any) {
          console.error("Firestore error:", error)
          toast({
            title: "Erreur",
            description: `Impossible d'enregistrer les métadonnées: ${error.message}`,
            
          })
        }
      }

      setIsUploading(false)
      setUploadProgress(0)
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    },
    onUploadError: (error: Error) => {
      console.error("Upload error:", error)
      toast({
        title: "Erreur d'upload",
        description: error.message || "Impossible d'uploader le fichier",
      
      })
      setIsUploading(false)
      setUploadProgress(0)
    },
    onUploadBegin: (fileName: string) => {
      setIsUploading(true)
      setUploadProgress(0)
      toast({
        title: "Upload démarré",
        description: `Upload de ${fileName} en cours...`,
      })
    },
    onUploadProgress: (progress: number) => {
      setUploadProgress(progress)
    },
  })

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

  const uploadFile = async (file: File) => {
    // Validate file size (max 64MB for videos, 16MB for PDFs, 4MB for images)
    const maxSize = 64 * 1024 * 1024 // 64MB
    if (file.size > maxSize) {
      toast({
        title: "Erreur",
        description: "Le fichier est trop volumineux (max 64MB)",
        
      })
      return
    }

    try {
      await startUpload([file])
    } catch (error: any) {
      console.error("Upload initiation error:", error)
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'initialiser l'upload",
     
      })
      setIsUploading(false)
      setUploadProgress(0)
    }
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
            ${isUploading ? "pointer-events-none opacity-75" : ""}
          `}
        >
          <input 
            ref={fileInputRef} 
            type="file" 
            onChange={handleFileSelect} 
            className="hidden"
            accept="image/*,.pdf,video/*"
            disabled={isUploading}
          />

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
                disabled={isUploading}
              >
                Choisir un fichier
              </Button>
              <p className="text-xs text-muted-foreground">
                Images (4MB), PDFs (16MB), Vidéos (64MB)
              </p>
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