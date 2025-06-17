import { NextResponse } from "next/server"
import { getHealthStatus } from "@/lib/monitoring"
import { withErrorHandling } from "@/lib/errors"

export const GET = withErrorHandling(async () => {
  const health = await getHealthStatus()

  const statusCode = health.status === "healthy" ? 200 : health.status === "degraded" ? 200 : 503

  return NextResponse.json(health, { status: statusCode })
})
