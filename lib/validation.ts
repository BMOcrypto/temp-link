import { ValidationError } from "./errors"

// Custom validation functions
function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    // Block dangerous protocols
    const allowedProtocols = ["http:", "https:"]
    if (!allowedProtocols.includes(parsed.protocol)) {
      return false
    }
    // Block localhost and private IPs in production
    if (process.env.NODE_ENV === "production") {
      const hostname = parsed.hostname.toLowerCase()
      if (
        hostname === "localhost" ||
        hostname.startsWith("127.") ||
        hostname.startsWith("192.168.") ||
        hostname.startsWith("10.") ||
        hostname.match(/^172\.(1[6-9]|2[0-9]|3[0-1])\./)
      ) {
        return false
      }
    }
    return true
  } catch {
    return false
  }
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length <= 255
}

function isValidShortCode(code: string): boolean {
  return /^[a-zA-Z0-9_-]{3,50}$/.test(code)
}

function isValidPassword(password: string): boolean {
  return password.length >= 8 && password.length <= 128 && /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)
}

function isValidName(name: string): boolean {
  return name.length >= 1 && name.length <= 100 && /^[a-zA-Z\s'-]+$/.test(name)
}

function isValidExpiry(expiry: string): boolean {
  return ["1h", "6h", "24h", "7d", "30d"].includes(expiry)
}

function isValidUUID(uuid: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uuid)
}

// Validation schemas
export const schemas = {
  url: {
    validate: (value: unknown) => {
      if (typeof value !== "string") throw new ValidationError("URL must be a string")
      if (!isValidUrl(value)) throw new ValidationError("Invalid or unsafe URL")
      return value
    },
  },

  shortCode: {
    validate: (value: unknown) => {
      if (typeof value !== "string") throw new ValidationError("Short code must be a string")
      if (!isValidShortCode(value))
        throw new ValidationError(
          "Short code can only contain letters, numbers, hyphens, and underscores (3-50 characters)",
        )
      return value
    },
  },

  email: {
    validate: (value: unknown) => {
      if (typeof value !== "string") throw new ValidationError("Email must be a string")
      if (!isValidEmail(value)) throw new ValidationError("Invalid email format")
      return value
    },
  },

  password: {
    validate: (value: unknown) => {
      if (typeof value !== "string") throw new ValidationError("Password must be a string")
      if (!isValidPassword(value))
        throw new ValidationError(
          "Password must be 8-128 characters with at least one lowercase, uppercase, and number",
        )
      return value
    },
  },

  name: {
    validate: (value: unknown) => {
      if (typeof value !== "string") throw new ValidationError("Name must be a string")
      if (!isValidName(value))
        throw new ValidationError("Name can only contain letters, spaces, hyphens, and apostrophes (1-100 characters)")
      return value
    },
  },

  expiry: {
    validate: (value: unknown) => {
      if (typeof value !== "string") throw new ValidationError("Expiry must be a string")
      if (!isValidExpiry(value)) throw new ValidationError("Invalid expiry option")
      return value
    },
  },

  uuid: {
    validate: (value: unknown) => {
      if (typeof value !== "string") throw new ValidationError("UUID must be a string")
      if (!isValidUUID(value)) throw new ValidationError("Invalid UUID format")
      return value
    },
  },
}

// Link creation validation
export function validateCreateLink(data: any) {
  const result = {
    originalUrl: schemas.url.validate(data.originalUrl),
    expiry: schemas.expiry.validate(data.expiry),
    customSlug: data.customSlug ? schemas.shortCode.validate(data.customSlug) : undefined,
    title: typeof data.title === "string" && data.title.length <= 255 ? data.title : undefined,
  }

  return result
}

// User registration validation
export function validateRegister(data: any) {
  return {
    email: schemas.email.validate(data.email),
    password: schemas.password.validate(data.password),
    name: schemas.name.validate(data.name),
  }
}

// User login validation
export function validateLogin(data: any) {
  return {
    email: schemas.email.validate(data.email),
    password:
      typeof data.password === "string" && data.password.length > 0
        ? data.password
        : (() => {
            throw new ValidationError("Password is required")
          })(),
  }
}

// Validation helper
export function validateInput<T>(validator: (data: any) => T, data: unknown): T {
  try {
    return validator(data)
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error
    }
    throw new ValidationError("Invalid input data")
  }
}

// Sanitization helpers
export function sanitizeHtml(input: string): string {
  return input
    .replace(/[<>]/g, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+=/gi, "")
    .trim()
}

export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, "_")
    .replace(/_{2,}/g, "_")
    .substring(0, 255)
}
