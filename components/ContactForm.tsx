"use client";

import Script from "next/script";
import { useCallback, useRef, useState } from "react";
import type { ContactFormData, ContactFormErrors } from "@/lib/validation";
import { hasValidationErrors, validateContactForm } from "@/lib/validation";

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (
        siteKey: string,
        options: { action: string },
      ) => Promise<string>;
    };
  }
}

type SubmitStatus = "idle" | "loading" | "success" | "error";

const EMPTY_FORM: ContactFormData = {
  name: "",
  email: "",
  phone: "",
  message: "",
};

export default function ContactForm() {
  const [form, setForm] = useState<ContactFormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [feedback, setFeedback] = useState("");

  const recaptchaReady = useRef(false);
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  function updateField(field: keyof ContactFormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  const getRecaptchaToken = useCallback(async (): Promise<string> => {
    if (!siteKey) return "";

    // If grecaptcha hasn't loaded yet, wait up to 5s for it
    if (!window.grecaptcha) {
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(
          () => reject(new Error("reCAPTCHA script timed out")),
          5000,
        );
        const interval = setInterval(() => {
          if (window.grecaptcha) {
            clearTimeout(timeout);
            clearInterval(interval);
            resolve();
          }
        }, 100);
      });
    }

    return new Promise<string>((resolve, reject) => {
      window.grecaptcha!.ready(async () => {
        try {
          const token = await window.grecaptcha!.execute(siteKey, {
            action: "contact_form",
          });
          resolve(token);
        } catch (err) {
          reject(err);
        }
      });
    });
  }, [siteKey]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validateContactForm(form);
    if (hasValidationErrors(validationErrors)) {
      setErrors(validationErrors);
      setStatus("error");
      setFeedback("Please fix the highlighted fields before sending.");
      return;
    }

    setStatus("loading");
    setFeedback("");
    setErrors({});

    try {
      let recaptchaToken = "";

      if (siteKey) {
        try {
          recaptchaToken = await getRecaptchaToken();
        } catch (err) {
          console.warn("[reCAPTCHA] Failed to get token:", err);
          setStatus("error");
          setFeedback(
            "Security check failed to load. Please refresh the page and try again.",
          );
          return;
        }
      }

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, recaptchaToken }),
      });

      const result = (await response.json()) as {
        success: boolean;
        message: string;
        errors?: ContactFormErrors;
      };

      if (!response.ok || !result.success) {
        if (result.errors) setErrors(result.errors);
        setStatus("error");
        setFeedback(result.message || "Failed to send your message.");
        return;
      }

      setForm(EMPTY_FORM);
      setErrors({});
      setStatus("success");
      setFeedback(result.message);
    } catch {
      setStatus("error");
      setFeedback(
        "Network error — please check your connection and try again.",
      );
    }
  }

  const isSubmitting = status === "loading";

  return (
    <>
      {siteKey ? (
        <Script
          src={`https://www.google.com/recaptcha/api.js?render=${siteKey}`}
          strategy="afterInteractive"
          onLoad={() => {
            recaptchaReady.current = true;
          }}
        />
      ) : null}

      <form
        className="mt-6 grid gap-3"
        onSubmit={handleSubmit}
        noValidate
        aria-label="Contact form"
      >
        <FormField
          label="Name"
          name="name"
          value={form.name}
          placeholder="Juan Dela Cruz"
          error={errors.name}
          onChange={(v) => updateField("name", v)}
        />

        <div className="grid gap-3 md:grid-cols-2">
          <FormField
            label="Email"
            name="email"
            type="email"
            value={form.email}
            placeholder="juan@gmail.com"
            error={errors.email}
            onChange={(v) => updateField("email", v)}
          />
          <FormField
            label="Phone Number"
            name="phone"
            type="tel"
            value={form.phone}
            placeholder="09123456789"
            error={errors.phone}
            onChange={(v) => updateField("phone", v)}
          />
        </div>

        <FormField
          label="Message"
          name="message"
          value={form.message}
          placeholder="Hello OWLDEV, I would like to inquire about your web development services."
          error={errors.message}
          multiline
          onChange={(v) => updateField("message", v)}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
          className="mt-1 inline-flex h-11 items-center justify-center rounded-full bg-cyan-300 px-6 text-sm font-semibold text-[#061018] shadow-[0_12px_40px_-20px_rgba(34,211,238,0.85)] transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Sending…" : "Send Message"}
        </button>

        {feedback ? (
          <p
            role="status"
            aria-live="polite"
            className={`rounded-2xl px-4 py-3 text-sm ring-1 ${
              status === "success"
                ? "bg-emerald-400/10 text-emerald-200 ring-emerald-300/20"
                : "bg-red-400/10 text-red-200 ring-red-300/20"
            }`}
          >
            {feedback}
          </p>
        ) : null}

        {siteKey ? (
          <p className="text-[11px] leading-5 text-zinc-500">
            This site is protected by reCAPTCHA and the Google{" "}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-zinc-400"
            >
              Privacy Policy
            </a>{" "}
            and{" "}
            <a
              href="https://policies.google.com/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-zinc-400"
            >
              Terms of Service
            </a>{" "}
            apply.
          </p>
        ) : null}
      </form>
    </>
  );
}

type FormFieldProps = {
  label: string;
  name: string;
  value: string;
  placeholder: string;
  error?: string;
  multiline?: boolean;
  type?: string;
  onChange: (value: string) => void;
};

function FormField({
  label,
  name,
  value,
  placeholder,
  error,
  multiline = false,
  type = "text",
  onChange,
}: FormFieldProps) {
  const id = `field-${name}`;
  const errorId = `${id}-error`;

  const baseClass =
    "w-full rounded-2xl border bg-black/25 px-4 py-3 text-sm text-zinc-100 " +
    "placeholder:text-zinc-500 outline-none transition focus:bg-black/30";

  const borderClass = error
    ? "border-red-400/40 focus:border-red-400/60"
    : "border-white/10 focus:border-cyan-300/30";

  const sharedProps = {
    id,
    name,
    value,
    placeholder,
    "aria-invalid": error ? ("true" as const) : undefined,
    "aria-describedby": error ? errorId : undefined,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onChange(e.target.value),
  };

  return (
    <div className="grid gap-1.5">
      <label htmlFor={id} className="text-xs font-semibold text-zinc-300">
        {label}
      </label>

      {multiline ? (
        <textarea
          {...sharedProps}
          rows={4}
          className={`${baseClass} ${borderClass} resize-none`}
        />
      ) : (
        <input
          {...sharedProps}
          type={type}
          className={`h-11 ${baseClass} ${borderClass}`}
        />
      )}

      {error ? (
        <span id={errorId} role="alert" className="text-xs text-red-300">
          {error}
        </span>
      ) : null}
    </div>
  );
}
