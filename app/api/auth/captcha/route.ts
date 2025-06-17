import { type NextRequest, NextResponse } from "next/server"
import { withErrorHandling } from "@/lib/errors"
import { getClientIP } from "@/lib/security"
import { generateCaptcha, checkCaptchaRateLimit } from "@/lib/captcha"
import { loggers } from "@/lib/logger"

export const GET = withErrorHandling(async (request: NextRequest) => {
  const ip = getClientIP(request)

  // Check rate limit
  if (!checkCaptchaRateLimit(ip)) {
    return NextResponse.json({ error: "Too many CAPTCHA requests" }, { status: 429 })
  }

  const captcha = generateCaptcha()

  loggers.api.debug({
    event: "captcha_generated",
    ip,
    question: captcha.question,
  })

  return NextResponse.json({
    question: captcha.question,
    token: captcha.token,
  })
})
