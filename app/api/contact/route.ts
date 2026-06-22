import { NextResponse } from "next/server";
import { sendAutoReply, sendContactNotification } from "@/lib/email";
import { verifyRecaptcha } from "@/lib/recaptcha";
import { saveSubmission } from "@/lib/submissions";
import {
  hasValidationErrors,
  validateContactForm,
  type ContactFormData,
} from "@/lib/validation";

type ContactRequestBody = ContactFormData & {
  recaptchaToken?: string;
};

export async function POST(request: Request) {
  let body: ContactRequestBody;
  try {
    body = (await request.json()) as ContactRequestBody;
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid request body." },
      { status: 400 },
    );
  }

  // Validate form fields
  const formData: ContactFormData = {
    name: body.name ?? "",
    email: body.email ?? "",
    phone: body.phone ?? "",
    message: body.message ?? "",
  };

  const errors = validateContactForm(formData);
  if (hasValidationErrors(errors)) {
    return NextResponse.json(
      { success: false, message: "Please fix the errors below.", errors },
      { status: 400 },
    );
  }

  // reCAPTCHA — only enforced when RECAPTCHA_SECRET_KEY is set
  if (process.env.RECAPTCHA_SECRET_KEY) {
    const token = body.recaptchaToken?.trim();

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Security check failed — please refresh the page and try again.",
        },
        { status: 400 },
      );
    }

    const isHuman = await verifyRecaptcha(token);
    if (!isHuman) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Security check failed. Please refresh the page and try again.",
        },
        { status: 400 },
      );
    }
  }

  // Persist submission (non-fatal)
  try {
    await saveSubmission(formData);
  } catch (error) {
    console.error("[contact] Failed to save submission:", error);
  }

  // Send emails
  try {
    await sendContactNotification(formData);
    await sendAutoReply(formData);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown email error";

    console.error("[contact] Email delivery failed:", message);

    const isCredentialError =
      message.toLowerCase().includes("credentials") ||
      message.toLowerCase().includes("smtp_user") ||
      message.toLowerCase().includes("app password") ||
      message.toLowerCase().includes("535") ||
      message.toLowerCase().includes("534");

    return NextResponse.json(
      {
        success: false,
        message: isCredentialError
          ? "Email delivery failed due to a server configuration issue. " +
            "Your message was saved — please contact us directly at " +
            (process.env.CONTACT_EMAIL || "owldevtechsolutions@gmail.com") +
            "."
          : "Your message was received but we had trouble sending the confirmation email. " +
            "We'll still follow up with you shortly.",
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
    success: true,
    message:
      "Your message has been sent! Check your inbox for a confirmation email. We'll be in touch soon.",
  });
}
