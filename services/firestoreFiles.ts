import { db } from "@/lib/firebase"
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore"
import { getAuth } from "firebase/auth"
import { ref, deleteObject } from "firebase/storage"
import { storage } from "@/lib/firebase"

export interface FileMetadata {
  id?: string
  name: string
  size: number
  type: string
  url: string
  uploadDate?: Date
  userId?: string
}

interface FirestoreFileData {
  name: string
  size: number
  type: string
  url: string
  userId: string
  createdAt: ReturnType<typeof serverTimestamp>
}

/**
 * Add file metadata to Firestore
 */
export async function addFileMetadata(file: {
  name: string
  size: number
  type: string
  url: string
}): Promise<string> {
  const auth = getAuth()
  const user = auth.currentUser

  if (!user) {
    throw new Error("User must be authenticated to upload files")
  }

  console.log("Adding file metadata for user:", user.uid)

  const fileData: FirestoreFileData = {
    name: file.name,
    size: file.size,
    type: file.type,
    url: file.url,
    userId: user.uid,
    createdAt: serverTimestamp(),
  }

  try {
    const docRef = await addDoc(collection(db, "files"), fileData)
    console.log("File metadata saved with ID:", docRef.id)
    return docRef.id
  } catch (error) {
    console.error("Error adding file metadata:", error)
    throw error
  }
}

/**
 * Get all files for the current user
 */
export async function getUserFiles(): Promise<FileMetadata[]> {
  const auth = getAuth()
  const user = auth.currentUser

  console.log("Fetching files for user:", user?.uid)

  if (!user) {
    console.log("No authenticated user, returning empty array")
    return []
  }

  try {
    const filesRef = collection(db, "files")
    const q = query(
      filesRef,
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    )

    const querySnapshot = await getDocs(q)
    console.log("Found documents:", querySnapshot.size)
    
    const files: FileMetadata[] = []

    querySnapshot.forEach((doc) => {
      const data = doc.data()
      console.log("Document data:", { id: doc.id, ...data })
      
      files.push({
        id: doc.id,
        name: data.name,
        size: data.size,
        type: data.type,
        url: data.url,
        uploadDate: data.createdAt ? (data.createdAt as Timestamp).toDate() : new Date(),
        userId: data.userId,
      })
    })

    console.log("Returning files:", files.length)
    return files
  } catch (error) {
    console.error("Error fetching user files:", error)
    throw error
  }
}

/**
 * Delete file metadata from Firestore
 */
export async function deleteFileMetadata(fileId: string): Promise<void> {
  const auth = getAuth()
  const user = auth.currentUser

  if (!user) {
    throw new Error("User must be authenticated to delete files")
  }

  try {
    console.log("Deleting file with ID:", fileId)
    const fileDocRef = doc(db, "files", fileId)
    await deleteDoc(fileDocRef)
    console.log("File deleted successfully")
  } catch (error) {
    console.error("Error deleting file:", error)
    throw error
  }
}

/**
 * Helper function to extract storage path from Firebase Storage URL
 */
function extractStoragePathFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url)
    const pathMatch = urlObj.pathname.match(/\/o\/(.+)\?/)
    if (pathMatch && pathMatch[1]) {
      return decodeURIComponent(pathMatch[1])
    }
    return null
  } catch (error) {
    console.error("Error parsing storage URL:", error)
    return null
  }
}

/**
 * Delete file from Firebase Storage (optional - for UploadThing you may not need this)
 */
export async function deleteFileFromStorage(fileUrl: string): Promise<void> {
  const storagePath = extractStoragePathFromUrl(fileUrl)
  if (!storagePath) {
    throw new Error("Invalid storage URL")
  }

  const storageRef = ref(storage, storagePath)
  await deleteObject(storageRef)
}