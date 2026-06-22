// ---------------------------------------------------------------------------
// Google reCAPTCHA v3 — server-side token verification
// ---------------------------------------------------------------------------

type RecaptchaApiResponse = {
  success: boolean;
  score?: number;
  action?: string;
  challenge_ts?: string;
  hostname?: string;
  "error-codes"?: string[];
};

/**
 * Verifies a reCAPTCHA v3 token with Google's API.
 *
 * Returns `true` when the token is valid and the score meets the minimum
 * threshold. Returns `false` otherwise.
 *
 * When RECAPTCHA_SECRET_KEY is not set:
 *   - Development  → skips verification and returns `true`.
 *   - Production   → returns `false` (fails closed for safety).
 */
export async function verifyRecaptcha(token: string): Promise<boolean> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  const minScore = Number(process.env.RECAPTCHA_MIN_SCORE ?? 0.5);

  if (!secretKey) {
    if (process.env.NODE_ENV === "production") {
      console.error(
        "[reCAPTCHA] RECAPTCHA_SECRET_KEY is not set in production. " +
          "Blocking request for safety.",
      );
      return false;
    }

    console.warn(
      "[reCAPTCHA] RECAPTCHA_SECRET_KEY is not set. " +
        "Skipping verification in non-production environment.",
    );
    return true;
  }

  if (!token || token.trim() === "") {
    console.warn("[reCAPTCHA] Empty token received.");
    return false;
  }

  let data: RecaptchaApiResponse;

  try {
    const response = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ secret: secretKey, response: token }),
      },
    );

    if (!response.ok) {
      console.error(
        `[reCAPTCHA] Verification HTTP error: ${response.status} ${response.statusText}`,
      );
      return false;
    }

    data = (await response.json()) as RecaptchaApiResponse;
  } catch (error) {
    console.error("[reCAPTCHA] Network error during verification:", error);
    return false;
  }

  if (!data.success) {
    console.warn(
      "[reCAPTCHA] Verification failed. Error codes:",
      data["error-codes"],
    );
    return false;
  }

  if (typeof data.score === "number" && data.score < minScore) {
    console.warn(
      `[reCAPTCHA] Score too low: ${data.score} (minimum: ${minScore}).`,
    );
    return false;
  }

  return true;
}
