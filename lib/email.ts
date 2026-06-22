import nodemailer from "nodemailer";
import type { ContactFormData } from "./validation";

// ---------------------------------------------------------------------------
// Brand tokens
// ---------------------------------------------------------------------------
const BRAND_COLOR = "#22d3ee";
const BRAND_BG = "#07090d";

// ---------------------------------------------------------------------------
// Transporter factory
// Throws a descriptive error when env vars are missing so the API route
// can surface a useful message instead of a cryptic nodemailer crash.
// ---------------------------------------------------------------------------
function createTransporter() {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT || 587);
  const secure = process.env.SMTP_SECURE === "true";

  if (!user || !pass) {
    throw new Error(
      "SMTP credentials are not configured. " +
        "Set SMTP_USER and SMTP_PASS in your .env.local file. " +
        "For Gmail, SMTP_PASS must be a 16-character App Password " +
        "(https://myaccount.google.com/apppasswords).",
    );
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    // Increase timeouts for slow networks / cold starts
    connectionTimeout: 10_000,
    socketTimeout: 15_000,
  });
}

// ---------------------------------------------------------------------------
// Shared HTML shell
// ---------------------------------------------------------------------------
function htmlShell(content: string): string {
  return /* html */ `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
  </head>
  <body style="margin:0;padding:0;background:${BRAND_BG};font-family:Arial,Helvetica,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0"
           style="background:${BRAND_BG};padding:32px 16px;">
      <tr>
        <td align="center">
          <table width="100%" cellpadding="0" cellspacing="0"
                 style="max-width:560px;background:#0f1419;
                        border:1px solid rgba(255,255,255,0.08);
                        border-radius:16px;overflow:hidden;">
            <!-- Header -->
            <tr>
              <td style="padding:24px 28px;
                         border-bottom:1px solid rgba(255,255,255,0.08);">
                <p style="margin:0;color:${BRAND_COLOR};font-size:12px;
                          font-weight:700;letter-spacing:0.08em;">
                  OWLDEV TECH SOLUTIONS
                </p>
                <p style="margin:6px 0 0;color:#ffffff;
                          font-size:18px;font-weight:700;">
                  Contact Form
                </p>
              </td>
            </tr>
            <!-- Body -->
            <tr>
              <td style="padding:28px;color:#d4d4d8;
                         font-size:14px;line-height:1.7;">
                ${content}
              </td>
            </tr>
            <!-- Footer -->
            <tr>
              <td style="padding:18px 28px;
                         border-top:1px solid rgba(255,255,255,0.08);
                         color:#71717a;font-size:12px;">
                © ${new Date().getFullYear()} OWLDEV Tech Solutions
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function row(label: string, value: string): string {
  return `<p style="margin:0 0 8px;">
    <strong style="color:#ffffff;">${label}:</strong>
    ${escapeHtml(value)}
  </p>`;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Sends a notification email to the site owner whenever someone submits the
 * contact form.
 */
export async function sendContactNotification(
  data: ContactFormData,
): Promise<void> {
  const transporter = createTransporter();
  const to =
    process.env.CONTACT_EMAIL ||
    process.env.SMTP_USER ||
    "owldevtechsolutions@gmail.com";

  const html = htmlShell(`
    <p style="margin:0 0 16px;color:#ffffff;font-size:16px;font-weight:600;">
      New Contact Form Submission
    </p>
    ${row("Name", data.name)}
    ${row("Email", data.email)}
    ${row("Phone", data.phone)}
    <p style="margin:16px 0 8px;color:#ffffff;font-weight:600;">Message:</p>
    <p style="margin:0;white-space:pre-wrap;">${escapeHtml(data.message)}</p>
  `);

  const plainText = [
    "New Contact Form Submission",
    "",
    `Name:    ${data.name}`,
    `Email:   ${data.email}`,
    `Phone:   ${data.phone}`,
    "",
    "Message:",
    data.message,
  ].join("\n");

  await transporter.sendMail({
    from: `"OWLDEV Contact Form" <${process.env.SMTP_USER}>`,
    to,
    replyTo: data.email,
    subject: `New enquiry from ${data.name}`,
    text: plainText,
    html,
  });
}

/**
 * Sends an auto-reply to the person who submitted the form so they know their
 * message was received.
 */
export async function sendAutoReply(data: ContactFormData): Promise<void> {
  const transporter = createTransporter();

  const html = htmlShell(`
    <p style="margin:0 0 16px;color:#ffffff;font-size:16px;font-weight:600;">
      Thank you, ${escapeHtml(data.name)}!
    </p>
    <p style="margin:0 0 16px;">
      We've received your message and will get back to you as soon as possible.
      Our typical response time is within 1–2 business days.
    </p>
    <p style="margin:0;color:#a1a1aa;font-size:13px;">
      This is an automated confirmation — please do not reply to this email
      directly. If you need to add more details, simply send us a new message.
    </p>
  `);

  await transporter.sendMail({
    from: `"OWLDEV Tech Solutions" <${process.env.SMTP_USER}>`,
    to: data.email,
    subject: "We received your message — OWLDEV Tech Solutions",
    text:
      `Hi ${data.name},\n\n` +
      "We've received your message and will get back to you as soon as possible.\n" +
      "Our typical response time is within 1–2 business days.\n\n" +
      "— OWLDEV Tech Solutions",
    html,
  });
}

/**
 * Verifies SMTP credentials at startup / on demand.
 * Useful for a health-check endpoint; not called in the normal request path.
 */
export async function verifySmtpConnection(): Promise<void> {
  const transporter = createTransporter();
  await transporter.verify();
}
