export function normalizeImageUrl(url) {
  if (!url) return "";

  // Already relative → keep as-is
  if (url.startsWith("/uploads")) return url;

  // Full GCS URL → convert to relative
  const parts = url.split("/uploads");
  if (parts.length > 1) {
    return "/uploads" + parts[1];
  }

  return url;
}


function slugify(text) {
    return decodeURIComponent(text) // Decode encoded characters (e.g., %20 → space)
      .toLowerCase() // Convert to lowercase
      .replace(/\//g, "-") // Convert slashes `/` to hyphens `-` before encoding
      .replace(/&/g, "-")
      .replace(/e%/g, "") // Remove any "e%" sequences
      .replace(/%[0-9a-f]{2}/gi, "") // Remove any encoded characters like %20, %2F, etc.
      .replace(/[^a-z0-9-]+/g, "-") // Replace non-SEO-friendly characters with "-"
      .replace(/-+/g, "-") // Remove duplicate hyphens
      .replace(/^-|-$/g, ""); // Trim hyphens from start/end
  }
    

export default slugify;
