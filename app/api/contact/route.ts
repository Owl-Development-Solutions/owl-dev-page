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
  try {
    const body = (await request.json()) as ContactRequestBody;

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

    if (process.env.RECAPTCHA_SECRET_KEY) {
      if (!body.recaptchaToken) {
        return NextResponse.json(
          { success: false, message: "reCAPTCHA verification failed. Please try again." },
          { status: 400 },
        );
      }

      const isHuman = await verifyRecaptcha(body.recaptchaToken);
      if (!isHuman) {
        return NextResponse.json(
          { success: false, message: "reCAPTCHA verification failed. Please try again." },
          { status: 400 },
        );
      }
    }

    await saveSubmission(formData);
    await sendContactNotification(formData);
    await sendAutoReply(formData);

    return NextResponse.json({
      success: true,
      message:
        "Thank you! Your message has been sent. A confirmation email is on its way.",
    });
  } catch (error) {
    console.error("Contact form error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Something went wrong while sending your message. Please try again later.",
      },
      { status: 500 },
    );
  }
}
