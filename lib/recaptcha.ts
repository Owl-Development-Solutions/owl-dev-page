type RecaptchaResponse = {
  success: boolean;
  score?: number;
  "error-codes"?: string[];
};

export async function verifyRecaptcha(token: string): Promise<boolean> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  if (!secretKey) {
    console.warn("RECAPTCHA_SECRET_KEY is not set. Skipping reCAPTCHA verification.");
    return process.env.NODE_ENV !== "production";
  }

  const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      secret: secretKey,
      response: token,
    }),
  });

  const data = (await response.json()) as RecaptchaResponse;

  if (!data.success) {
    return false;
  }

  if (typeof data.score === "number" && data.score < 0.5) {
    return false;
  }

  return true;
}
