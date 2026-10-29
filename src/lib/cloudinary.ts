/**
 * Cloudinary delivery helper.
 *
 * Injects automatic format (WebP/AVIF), automatic quality and a max width into
 * Cloudinary URLs so browsers download a small, right-sized image instead of the
 * original upload. Non-Cloudinary URLs (legacy links) are returned untouched.
 */
const CLOUDINARY_UPLOAD_SEGMENT = "/image/upload/"

export function isCloudinaryUrl(url?: string | null): url is string {
  return !!url && url.startsWith("https://res.cloudinary.com/") && url.includes(CLOUDINARY_UPLOAD_SEGMENT)
}

export interface OptimizeOptions {
  /** Max rendered width in CSS px. Cloudinary serves up to 2x for retina screens. */
  width?: number
  /** Optional fixed height crop (uses fill + auto gravity). */
  height?: number
}

export function optimizeImage(url: string | null | undefined, options: OptimizeOptions = {}): string {
  if (!url) return ""
  if (!isCloudinaryUrl(url)) return url

  const { width = 1200, height } = options
  const parts = ["f_auto", "q_auto", "dpr_auto", `w_${width}`, "c_limit"]
  if (height) {
    parts.splice(parts.indexOf("c_limit"), 1, `h_${height}`, "c_fill", "g_auto")
  }
  const transformation = parts.join(",")

  // Avoid double-applying if the URL already has our transformation.
  if (url.includes(`${CLOUDINARY_UPLOAD_SEGMENT}f_auto,`)) return url

  return url.replace(CLOUDINARY_UPLOAD_SEGMENT, `${CLOUDINARY_UPLOAD_SEGMENT}${transformation}/`)
}
