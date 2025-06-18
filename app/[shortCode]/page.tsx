import { redirect, notFound } from "next/navigation"
import { createServerClient } from "@/lib/supabase"

interface Props {
  params: {
    shortCode: string
  }
}

export default async function RedirectPage({ params }: Props) {
  const { shortCode } = params
  const supabase = createServerClient()

  // Find the link
  const { data: link, error } = await supabase.from("links").select("*").eq("short_code", shortCode).single()

  if (error || !link) {
    notFound()
  }

  // Check if link is expired
  const now = new Date()
  const expiresAt = new Date(link.expires_at)

  if (now > expiresAt || !link.is_active) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Link Expired</h1>
          <p className="text-gray-600 mb-8">This temporary link has expired and is no longer available.</p>
          <a
            href="/"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Create New Link
          </a>
        </div>
      </div>
    )
  }

  // Record the click
  await supabase.from("clicks").insert({
    link_id: link.id,
    clicked_at: new Date().toISOString(),
  })

  // Update click count
  await supabase
    .from("links")
    .update({
      click_count: (link.click_count || 0) + 1,
      updated_at: new Date().toISOString(),
    })
    .eq("id", link.id)

  // Redirect to original URL
  redirect(link.original_url)
}
