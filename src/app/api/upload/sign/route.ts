import { NextResponse } from "next/server"
import { createHash } from "crypto"
import { isUserAdmin } from "@/lib/auth"

// Returns a short-lived signature so the admin's browser can upload directly to
// Cloudinary (bypasses serverless body-size limits). Admin only.
export async function POST() {
  try {
    const admin = await isUserAdmin()
    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized: Admin access required" },
        { status: 403 }
      )
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME
    const apiKey = process.env.CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        { error: "Cloudinary is not configured on the server" },
        { status: 500 }
      )
    }

    const timestamp = Math.round(Date.now() / 1000)
    const folder = "architect-landing"
    const allowedFormats = "jpg,jpeg,png,webp,avif,gif"

    // Params must be sorted alphabetically and signed together with the secret.
    const toSign = `allowed_formats=${allowedFormats}&folder=${folder}&timestamp=${timestamp}`
    const signature = createHash("sha1").update(toSign + apiSecret).digest("hex")

    return NextResponse.json({
      cloudName,
      apiKey,
      timestamp,
      folder,
      allowedFormats,
      signature,
    })
  } catch (error) {
    console.error("Error signing upload:", error)
    return NextResponse.json({ error: "Failed to sign upload" }, { status: 500 })
  }
}
