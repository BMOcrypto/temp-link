"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { nanoid } from "nanoid"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { sendUsageLimitWarning } from "@/lib/email" // Add this import at the top

const linkSchema = z.object({
  longUrl: z.string().url({ message: "Please enter a valid URL." }),
})

export default function CreateLinkForm() {
  const [isCreating, setIsCreating] = useState(false)
  const { toast } = useToast()
  const { data: session } = useSession()
  const router = useRouter()

  const form = useForm<z.infer<typeof linkSchema>>({
    resolver: zodResolver(linkSchema),
    defaultValues: {
      longUrl: "",
    },
  })

  async function onSubmit(values: z.infer<typeof linkSchema>) {
    setIsCreating(true)
    const supabase = createClientComponentClient()
    const shortUrl = nanoid(7)

    try {
      const { error } = await supabase
        .from("links")
        .insert({
          long_url: values.longUrl,
          short_url: shortUrl,
          user_id: session?.user?.id,
        })
        .single()

      if (error) {
        throw new Error(error.message)
      }

      toast({
        title: "Success!",
        description: "Link created successfully.",
      })

      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error!",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)

      // In the handleSubmit function, after successful link creation, add usage check:
      if (session?.user) {
        const { data: userData } = await supabase
          .from("users")
          .select("links_created_this_month, tier, name, email")
          .eq("id", session.user.id)
          .single()

        if (userData) {
          const limit = userData.tier === "pro" ? Number.POSITIVE_INFINITY : 100
          const usage = userData.links_created_this_month || 0
          const percentage = Math.round((usage / limit) * 100)

          // Send warning email at 80% and 95% usage
          if (percentage >= 80 && (percentage === 80 || percentage === 95)) {
            try {
              await sendUsageLimitWarning({
                to: userData.email,
                userName: userData.name,
                currentUsage: usage,
                limit,
                percentage,
              })
            } catch (emailError) {
              console.error("Failed to send usage warning email:", emailError)
            }
          }
        }
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="longUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Long URL</FormLabel>
              <FormControl>
                <Input placeholder="https://www.example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isCreating}>
          {isCreating ? "Creating..." : "Create Link"}
        </Button>
      </form>
    </Form>
  )
}
