import nodemailer from "nodemailer";
import type { ContactFormData } from "./validation";

const BRAND_COLOR = "#22d3ee";
const BRAND_BG = "#07090d";

function getTransporter() {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    throw new Error("SMTP credentials are not configured.");
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: { user, pass },
  });
}

function emailLayout(content: string) {
  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <body style="margin:0;padding:0;background:${BRAND_BG};font-family:Arial,Helvetica,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND_BG};padding:32px 16px;">
      <tr>
        <td align="center">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#0f1419;border:1px solid rgba(255,255,255,0.08);border-radius:16px;overflow:hidden;">
            <tr>
              <td style="padding:24px 28px;border-bottom:1px solid rgba(255,255,255,0.08);">
                <p style="margin:0;color:${BRAND_COLOR};font-size:12px;font-weight:700;letter-spacing:0.08em;">OWLDEV TECH SOLUTIONS</p>
                <p style="margin:6px 0 0;color:#ffffff;font-size:18px;font-weight:700;">Contact Form</p>
              </td>
            </tr>
            <tr>
              <td style="padding:28px;color:#d4d4d8;font-size:14px;line-height:1.7;">
                ${content}
              </td>
            </tr>
            <tr>
              <td style="padding:18px 28px;border-top:1px solid rgba(255,255,255,0.08);color:#71717a;font-size:12px;">
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

export async function sendContactNotification(data: ContactFormData) {
  const transporter = getTransporter();
  const to = process.env.CONTACT_EMAIL || "owldevtechsolutions@gmail.com";

  const html = emailLayout(`
    <p style="margin:0 0 16px;color:#ffffff;font-size:16px;font-weight:600;">New Contact Form Submission</p>
    <p style="margin:0 0 8px;"><strong style="color:#ffffff;">Name:</strong> ${escapeHtml(data.name)}</p>
    <p style="margin:0 0 8px;"><strong style="color:#ffffff;">Email:</strong> ${escapeHtml(data.email)}</p>
    <p style="margin:0 0 8px;"><strong style="color:#ffffff;">Phone:</strong> ${escapeHtml(data.phone)}</p>
    <p style="margin:16px 0 8px;color:#ffffff;font-weight:600;">Message:</p>
    <p style="margin:0;white-space:pre-wrap;">${escapeHtml(data.message)}</p>
  `);

  await transporter.sendMail({
    from: `"OWLDEV Contact Form" <${process.env.SMTP_USER}>`,
    to,
    replyTo: data.email,
    subject: "New Contact Form Submission",
    text: [
      "New Contact Form Submission",
      "",
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Phone: ${data.phone}`,
      "",
      "Message:",
      data.message,
    ].join("\n"),
    html,
  });
}

export async function sendAutoReply(data: ContactFormData) {
  const transporter = getTransporter();

  const html = emailLayout(`
    <p style="margin:0 0 16px;color:#ffffff;font-size:16px;font-weight:600;">Thank you, ${escapeHtml(data.name)}!</p>
    <p style="margin:0 0 16px;">
      Thank you for contacting OWLDEV Tech Solutions. We have received your message and will respond as soon as possible.
    </p>
    <p style="margin:0;color:#a1a1aa;font-size:13px;">
      This is an automated confirmation. Please do not reply to this email unless you need to add more details.
    </p>
  `);

  await transporter.sendMail({
    from: `"OWLDEV Tech Solutions" <${process.env.SMTP_USER}>`,
    to: data.email,
    subject: "We received your message — OWLDEV Tech Solutions",
    text:
      "Thank you for contacting OWLDEV Tech Solutions. We have received your message and will respond as soon as possible.",
    html,
  });
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
