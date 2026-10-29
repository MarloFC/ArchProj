"use client"

import { useRef, useState } from "react"
import { Loader2, Upload } from "lucide-react"
import { toast } from "sonner"

const MAX_SIZE_MB = 20
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"]

interface ImageUploadButtonProps {
  /** Called with the final Cloudinary URL after a successful upload. */
  onUploaded: (url: string) => void
  label?: string
  className?: string
}

/**
 * Uploads an image straight from the browser to Cloudinary using a signature
 * issued by /api/upload/sign (admin only), then hands back the delivery URL.
 */
export function ImageUploadButton({
  onUploaded,
  label = "Upload image",
  className = "",
}: ImageUploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const handleFile = async (file: File) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error("Unsupported file type. Use JPG, PNG, WebP, AVIF or GIF.")
      return
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      toast.error(`Image is too large (max ${MAX_SIZE_MB}MB).`)
      return
    }

    setUploading(true)
    try {
      const signRes = await fetch("/api/upload/sign", { method: "POST" })
      if (!signRes.ok) {
        const err = await signRes.json().catch(() => ({}))
        throw new Error(err.error || "Could not authorize upload")
      }
      const { cloudName, apiKey, timestamp, folder, allowedFormats, signature } =
        await signRes.json()

      const form = new FormData()
      form.append("file", file)
      form.append("api_key", apiKey)
      form.append("timestamp", String(timestamp))
      form.append("folder", folder)
      form.append("allowed_formats", allowedFormats)
      form.append("signature", signature)

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: "POST", body: form }
      )
      const data = await uploadRes.json()
      if (!uploadRes.ok || !data.secure_url) {
        throw new Error(data?.error?.message || "Upload failed")
      }

      onUploaded(data.secure_url)
      toast.success("Image uploaded!")
    } catch (error) {
      console.error("Upload error:", error)
      toast.error(error instanceof Error ? error.message : "Upload failed")
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
        }}
      />
      <button
        type="button"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        className={`inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium border border-gray-300 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed transition-colors ${className}`}
      >
        {uploading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Upload className="w-4 h-4" />
        )}
        {uploading ? "Uploading..." : label}
      </button>
    </>
  )
}
