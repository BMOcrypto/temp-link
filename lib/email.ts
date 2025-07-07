import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export interface EmailTemplate {
  to: string
  subject: string
  html: string
  text: string
}

export async function sendEmail({ to, subject, html, text }: EmailTemplate) {
  try {
    const { data, error } = await resend.emails.send({
      from: "TempLink <noreply@templink.com>",
      to,
      subject,
      html,
      text,
    })

    if (error) {
      console.error("Email sending error:", error)
      throw error
    }

    return data
  } catch (error) {
    console.error("Failed to send email:", error)
    throw error
  }
}

export async function sendTeamInvitation({
  to,
  inviterName,
  teamName,
  inviteUrl,
}: {
  to: string
  inviterName: string
  teamName: string
  inviteUrl: string
}) {
  const subject = `You've been invited to join ${teamName} on TempLink`

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Team Invitation</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: white; padding: 30px; border: 1px solid #e1e5e9; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; color: #6c757d; border-radius: 0 0 8px 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔗 TempLink</h1>
            <h2>Team Invitation</h2>
          </div>
          <div class="content">
            <p>Hi there!</p>
            <p><strong>${inviterName}</strong> has invited you to join the <strong>${teamName}</strong> team on TempLink.</p>
            <p>TempLink is a powerful URL shortening platform that helps teams create, manage, and track temporary links with advanced analytics and collaboration features.</p>
            <p>As a team member, you'll be able to:</p>
            <ul>
              <li>Create and manage shared temporary links</li>
              <li>Access team analytics and insights</li>
              <li>Collaborate with team members</li>
              <li>Use advanced features like password protection and custom expiration</li>
            </ul>
            <p>Click the button below to accept the invitation and join the team:</p>
            <a href="${inviteUrl}" class="button">Accept Invitation</a>
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #667eea;">${inviteUrl}</p>
            <p>This invitation will expire in 7 days.</p>
          </div>
          <div class="footer">
            <p>© 2024 TempLink. All rights reserved.</p>
            <p>If you didn't expect this invitation, you can safely ignore this email.</p>
          </div>
        </div>
      </body>
    </html>
  `

  const text = `
    TempLink - Team Invitation

    Hi there!

    ${inviterName} has invited you to join the ${teamName} team on TempLink.

    TempLink is a powerful URL shortening platform that helps teams create, manage, and track temporary links with advanced analytics and collaboration features.

    As a team member, you'll be able to:
    • Create and manage shared temporary links
    • Access team analytics and insights
    • Collaborate with team members
    • Use advanced features like password protection and custom expiration

    Accept the invitation by visiting: ${inviteUrl}

    This invitation will expire in 7 days.

    © 2024 TempLink. All rights reserved.
    If you didn't expect this invitation, you can safely ignore this email.
  `

  return sendEmail({ to, subject, html, text })
}

export async function sendPasswordReset({
  to,
  resetUrl,
  userName,
}: {
  to: string
  resetUrl: string
  userName?: string
}) {
  const subject = "Reset your TempLink password"

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: white; padding: 30px; border: 1px solid #e1e5e9; }
          .button { display: inline-block; background: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; color: #6c757d; border-radius: 0 0 8px 8px; }
          .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 6px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔗 TempLink</h1>
            <h2>Password Reset Request</h2>
          </div>
          <div class="content">
            <p>Hi${userName ? ` ${userName}` : ""}!</p>
            <p>We received a request to reset your TempLink account password.</p>
            <div class="warning">
              <strong>⚠️ Security Notice:</strong> If you didn't request this password reset, please ignore this email. Your account is still secure.
            </div>
            <p>To reset your password, click the button below:</p>
            <a href="${resetUrl}" class="button">Reset Password</a>
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #dc3545;">${resetUrl}</p>
            <p><strong>This link will expire in 1 hour</strong> for security reasons.</p>
            <p>After clicking the link, you'll be able to create a new password for your account.</p>
          </div>
          <div class="footer">
            <p>© 2024 TempLink. All rights reserved.</p>
            <p>For security questions, contact us at security@templink.com</p>
          </div>
        </div>
      </body>
    </html>
  `

  const text = `
    TempLink - Password Reset Request

    Hi${userName ? ` ${userName}` : ""}!

    We received a request to reset your TempLink account password.

    ⚠️ Security Notice: If you didn't request this password reset, please ignore this email. Your account is still secure.

    To reset your password, visit: ${resetUrl}

    This link will expire in 1 hour for security reasons.

    After clicking the link, you'll be able to create a new password for your account.

    © 2024 TempLink. All rights reserved.
    For security questions, contact us at security@templink.com
  `

  return sendEmail({ to, subject, html, text })
}

export async function sendEmailVerification({
  to,
  verificationUrl,
  userName,
}: {
  to: string
  verificationUrl: string
  userName?: string
}) {
  const subject = "Verify your TempLink email address"

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: white; padding: 30px; border: 1px solid #e1e5e9; }
          .button { display: inline-block; background: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; color: #6c757d; border-radius: 0 0 8px 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔗 TempLink</h1>
            <h2>Welcome to TempLink!</h2>
          </div>
          <div class="content">
            <p>Hi${userName ? ` ${userName}` : ""}!</p>
            <p>Thank you for signing up for TempLink! We're excited to have you on board.</p>
            <p>To complete your registration and start creating temporary links, please verify your email address by clicking the button below:</p>
            <a href="${verificationUrl}" class="button">Verify Email Address</a>
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #28a745;">${verificationUrl}</p>
            <p>Once verified, you'll be able to:</p>
            <ul>
              <li>Create temporary links with custom expiration dates</li>
              <li>Track clicks and analytics</li>
              <li>Manage your links from the dashboard</li>
              <li>Upgrade to Pro for advanced features</li>
            </ul>
            <p>This verification link will expire in 24 hours.</p>
          </div>
          <div class="footer">
            <p>© 2024 TempLink. All rights reserved.</p>
            <p>Need help? Contact us at support@templink.com</p>
          </div>
        </div>
      </body>
    </html>
  `

  const text = `
    TempLink - Welcome to TempLink!

    Hi${userName ? ` ${userName}` : ""}!

    Thank you for signing up for TempLink! We're excited to have you on board.

    To complete your registration and start creating temporary links, please verify your email address by visiting: ${verificationUrl}

    Once verified, you'll be able to:
    • Create temporary links with custom expiration dates
    • Track clicks and analytics
    • Manage your links from the dashboard
    • Upgrade to Pro for advanced features

    This verification link will expire in 24 hours.

    © 2024 TempLink. All rights reserved.
    Need help? Contact us at support@templink.com
  `

  return sendEmail({ to, subject, html, text })
}

export async function sendWebhookNotification({
  to,
  eventType,
  linkTitle,
  linkUrl,
  timestamp,
  additionalData,
}: {
  to: string
  eventType: string
  linkTitle: string
  linkUrl: string
  timestamp: string
  additionalData?: Record<string, any>
}) {
  const subject = `TempLink Alert: ${eventType} - ${linkTitle}`

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Webhook Notification</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: white; padding: 30px; border: 1px solid #e1e5e9; }
          .event-badge { display: inline-block; background: #17a2b8; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; margin-bottom: 15px; }
          .data-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .data-table th, .data-table td { padding: 10px; text-align: left; border-bottom: 1px solid #e1e5e9; }
          .data-table th { background: #f8f9fa; font-weight: 600; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; color: #6c757d; border-radius: 0 0 8px 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔗 TempLink</h1>
            <h2>Webhook Notification</h2>
          </div>
          <div class="content">
            <div class="event-badge">${eventType.toUpperCase()}</div>
            <h3>${linkTitle}</h3>
            <p><strong>Link:</strong> ${linkUrl}</p>
            <p><strong>Event Time:</strong> ${new Date(timestamp).toLocaleString()}</p>
            
            ${
              additionalData
                ? `
              <h4>Additional Information:</h4>
              <table class="data-table">
                ${Object.entries(additionalData)
                  .map(
                    ([key, value]) => `
                  <tr>
                    <th>${key.charAt(0).toUpperCase() + key.slice(1)}</th>
                    <td>${value}</td>
                  </tr>
                `,
                  )
                  .join("")}
              </table>
            `
                : ""
            }
            
            <p>This notification was triggered by your webhook configuration. You can manage your webhook settings in your TempLink dashboard.</p>
          </div>
          <div class="footer">
            <p>© 2024 TempLink. All rights reserved.</p>
            <p>Manage webhook settings in your dashboard</p>
          </div>
        </div>
      </body>
    </html>
  `

  const text = `
    TempLink - Webhook Notification

    Event: ${eventType.toUpperCase()}
    Link: ${linkTitle}
    URL: ${linkUrl}
    Time: ${new Date(timestamp).toLocaleString()}

    ${
      additionalData
        ? `
    Additional Information:
    ${Object.entries(additionalData)
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n")}
    `
        : ""
    }

    This notification was triggered by your webhook configuration. You can manage your webhook settings in your TempLink dashboard.

    © 2024 TempLink. All rights reserved.
  `

  return sendEmail({ to, subject, html, text })
}

export async function sendUsageLimitWarning({
  to,
  userName,
  currentUsage,
  limit,
  percentage,
}: {
  to: string
  userName?: string
  currentUsage: number
  limit: number
  percentage: number
}) {
  const subject = `TempLink Usage Alert: ${percentage}% of your limit reached`

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Usage Limit Warning</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #fd7e14 0%, #e83e8c 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: white; padding: 30px; border: 1px solid #e1e5e9; }
          .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 6px; margin: 20px 0; }
          .usage-bar { background: #e9ecef; height: 20px; border-radius: 10px; overflow: hidden; margin: 15px 0; }
          .usage-fill { background: linear-gradient(90deg, #28a745 0%, #ffc107 70%, #dc3545 100%); height: 100%; transition: width 0.3s ease; }
          .button { display: inline-block; background: #fd7e14; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; color: #6c757d; border-radius: 0 0 8px 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔗 TempLink</h1>
            <h2>⚠️ Usage Limit Warning</h2>
          </div>
          <div class="content">
            <p>Hi${userName ? ` ${userName}` : ""}!</p>
            <div class="warning">
              <strong>You've used ${percentage}% of your monthly link creation limit.</strong>
            </div>
            <p><strong>Current Usage:</strong> ${currentUsage} / ${limit} links</p>
            <div class="usage-bar">
              <div class="usage-fill" style="width: ${percentage}%"></div>
            </div>
            <p>You have <strong>${limit - currentUsage} links remaining</strong> this month.</p>
            
            ${
              percentage >= 90
                ? `
              <p><strong>Action Required:</strong> You're approaching your limit. Consider upgrading to Pro for unlimited links and advanced features.</p>
            `
                : `
              <p>This is a friendly reminder to help you track your usage. Your account will continue to work normally.</p>
            `
            }
            
            <h4>Upgrade to Pro for:</h4>
            <ul>
              <li>Unlimited link creation</li>
              <li>Advanced analytics and insights</li>
              <li>Team collaboration features</li>
              <li>Custom domains and branding</li>
              <li>Priority support</li>
            </ul>
            
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="button">View Dashboard</a>
          </div>
          <div class="footer">
            <p>© 2024 TempLink. All rights reserved.</p>
            <p>Usage resets on the 1st of each month</p>
          </div>
        </div>
      </body>
    </html>
  `

  const text = `
    TempLink - Usage Limit Warning

    Hi${userName ? ` ${userName}` : ""}!

    ⚠️ You've used ${percentage}% of your monthly link creation limit.

    Current Usage: ${currentUsage} / ${limit} links
    Remaining: ${limit - currentUsage} links

    ${
      percentage >= 90
        ? "Action Required: You're approaching your limit. Consider upgrading to Pro for unlimited links and advanced features."
        : "This is a friendly reminder to help you track your usage. Your account will continue to work normally."
    }

    Upgrade to Pro for:
    • Unlimited link creation
    • Advanced analytics and insights
    • Team collaboration features
    • Custom domains and branding
    • Priority support

    View your dashboard: ${process.env.NEXT_PUBLIC_APP_URL}/dashboard

    © 2024 TempLink. All rights reserved.
    Usage resets on the 1st of each month
  `

  return sendEmail({ to, subject, html, text })
}
