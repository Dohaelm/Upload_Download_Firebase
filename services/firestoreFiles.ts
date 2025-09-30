import { db } from "@/lib/firebase"
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
  where,
} from "firebase/firestore"
import { auth } from "@/lib/firebase"

export interface FileMetadata {
  id?: string
  name: string
  size: number
  type: string
  url: string
  uploadDate?: Date
  owner?: string
}


export async function addFileMetadata(file: FileMetadata) {
  const user = auth.currentUser
  if (!user) throw new Error("Utilisateur non connecté")

  const docRef = await addDoc(collection(db, "files"), {
    name: file.name,
    size: file.size,
    type: file.type,
    url: file.url,
    owner: user.uid, 
    uploadDate: serverTimestamp(),
  })

  return docRef.id
}


export async function getUserFiles(): Promise<FileMetadata[]> {
  const user = auth.currentUser
  if (!user) return []

  const q = query(
    collection(db, "files"),
    where("owner", "==", user.uid),
    orderBy("uploadDate", "desc")
  )
  
  const snap = await getDocs(q)

  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
    uploadDate: d.data().uploadDate?.toDate() || new Date(),
  })) as FileMetadata[]
}

export async function deleteFileMetadata(id: string) {
  await deleteDoc(doc(db, "files", id))
}

