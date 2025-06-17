import { loggers } from "./logger"

// Simple math CAPTCHA for demo (in production, use reCAPTCHA or hCaptcha)
export interface CaptchaChallenge {
  question: string
  answer: number
  token: string
}

export function generateCaptcha(): CaptchaChallenge {
  const num1 = Math.floor(Math.random() * 10) + 1
  const num2 = Math.floor(Math.random() * 10) + 1
  const operations = ["+", "-", "*"]
  const operation = operations[Math.floor(Math.random() * operations.length)]

  let answer: number
  let question: string

  switch (operation) {
    case "+":
      answer = num1 + num2
      question = `${num1} + ${num2}`
      break
    case "-":
      // Ensure positive result
      const larger = Math.max(num1, num2)
      const smaller = Math.min(num1, num2)
      answer = larger - smaller
      question = `${larger} - ${smaller}`
      break
    case "*":
      answer = num1 * num2
      question = `${num1} × ${num2}`
      break
    default:
      answer = num1 + num2
      question = `${num1} + ${num2}`
  }

  // Generate token (in production, store this server-side with expiration)
  const token = Buffer.from(`${answer}:${Date.now()}`).toString("base64")

  return { question, answer, token }
}

export function verifyCaptcha(userAnswer: number, token: string): boolean {
  try {
    const decoded = Buffer.from(token, "base64").toString()
    const [correctAnswer, timestamp] = decoded.split(":")

    // Check if token is expired (5 minutes)
    const now = Date.now()
    const tokenTime = Number.parseInt(timestamp)
    if (now - tokenTime > 5 * 60 * 1000) {
      loggers.security.warn({
        event: "captcha_token_expired",
        tokenAge: now - tokenTime,
      })
      return false
    }

    const isCorrect = userAnswer === Number.parseInt(correctAnswer)

    if (!isCorrect) {
      loggers.security.warn({
        event: "captcha_verification_failed",
        userAnswer,
        correctAnswer,
      })
    }

    return isCorrect
  } catch (error) {
    loggers.security.error({
      event: "captcha_verification_error",
      error: error instanceof Error ? error.message : "Unknown error",
    })
    return false
  }
}

// Rate limiting for CAPTCHA generation
const captchaRateLimit = new Map<string, { count: number; resetTime: number }>()

export function checkCaptchaRateLimit(ip: string): boolean {
  const now = Date.now()
  const key = `captcha:${ip}`
  const record = captchaRateLimit.get(key)

  // Allow 10 CAPTCHA requests per hour
  const maxRequests = 10
  const windowMs = 60 * 60 * 1000 // 1 hour

  if (!record || now > record.resetTime) {
    captchaRateLimit.set(key, { count: 1, resetTime: now + windowMs })
    return true
  }

  if (record.count >= maxRequests) {
    loggers.security.warn({
      event: "captcha_rate_limit_exceeded",
      ip,
      count: record.count,
    })
    return false
  }

  record.count++
  return true
}
