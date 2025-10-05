"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Cloud, LogOut, User } from "lucide-react"
import { FileUpload } from "@/components/file-upload"
import { FileList } from "@/components/file-list"
import { FileDetailsModal } from "@/components/file-details-modal"

import {
  getUserFiles,
  deleteFileMetadata,
  type FileMetadata,
  addFileMetadata,
} from "@/services/firestoreFiles"
import { getAuth, onAuthStateChanged } from "firebase/auth"

interface DashboardProps {
  onLogout: () => void
}

export function Dashboard({ onLogout }: DashboardProps) {
  const [files, setFiles] = useState<FileMetadata[]>([])
  const [selectedFile, setSelectedFile] = useState<FileMetadata | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
  const fetchFiles = async () => {
    const data = await getUserFiles()
    setFiles(data)
  }
  fetchFiles()
}, [])


   
const handleFileUpload = async (uploadedFile: any) => {
  const fileUrl = uploadedFile.ufsUrl || uploadedFile.url
  if (!fileUrl) {
    console.error("UploadThing file missing url/ufsUrl:", uploadedFile)
    return
  }

  const newFile = {
    name: uploadedFile.name,
    size: uploadedFile.size,
    type: uploadedFile.type,
    url: fileUrl, // now guaranteed
  }

  const id = await addFileMetadata(newFile)

  setFiles((prevFiles) => [{ ...newFile, id, uploadDate: new Date() }, ...prevFiles])
}



  const handleDeleteFile = async (id: string) => {
    try {
      await deleteFileMetadata(id)
      setFiles((prevFiles) => prevFiles.filter((f) => f.id !== id))
      if (selectedFile?.id === id) setSelectedFile(null)
    } catch (error) {
      console.error("Error deleting file:", error)
    }
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-border/50 bg-card/30 backdrop-blur relative">
        <div className="absolute inset-x-0 bottom-0 h-px gradient-cyan-purple opacity-50" />
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg gradient-cyan-purple p-2 ring-1 ring-primary/20">
              <Cloud className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-cyan to-purple bg-clip-text text-transparent">
              CloudFiles
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-purple/10 hover:text-purple"
            >
              <User className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onLogout}
              className="hover:bg-orange/10 hover:text-orange"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-4 md:p-6 lg:p-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <FileUpload onFileUpload={handleFileUpload} />
          </div>

          <div className="lg:col-span-2">
            <FileList
              files={files}
              onFileClick={setSelectedFile}
              onDeleteFile={handleDeleteFile}
            />
          </div>
        </div>
      </div>

      {selectedFile && (
        <FileDetailsModal
          file={selectedFile}
          onClose={() => setSelectedFile(null)}
          onDelete={() => handleDeleteFile(selectedFile.id!)}
        />
      )}
    </div>
  )
}