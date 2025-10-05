import { createUploadthing, type FileRouter } from "uploadthing/next"

const f = createUploadthing()

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      // No auth required - return empty metadata
      return {}
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete!")
      console.log("file url", file.url)

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { 
        url: file.url,
        name: file.name,
        size: file.size,
        type: file.type,
      }
    }),

  // Define other file routes
  pdfUploader: f({ pdf: { maxFileSize: "16MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      return {}
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("PDF Upload complete!")
      console.log("file url", file.url)
      return { 
        url: file.url,
        name: file.name,
        size: file.size,
        type: file.type,
      }
    }),

  // Universal file uploader - accepts multiple file types
  fileUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 5 },
    pdf: { maxFileSize: "16MB", maxFileCount: 3 },
    video: { maxFileSize: "64MB", maxFileCount: 1 },
  })
    .middleware(async ({ req }) => {
      // No auth required
      return {}
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("File Upload complete!")
      console.log("file url", file.url)

      // You can save to Firestore here if needed
      // const { addFileMetadata } = await import("@/services/firestoreFiles")
      // await addFileMetadata({
      //   name: file.name,
      //   size: file.size,
      //   type: file.type,
      //   url: file.url,
      // })

      return { 
        url: file.url,
        name: file.name,
        size: file.size,
        type: file.type,
      }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter