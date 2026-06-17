"use client";

import Script from "next/script";
import { useCallback, useState } from "react";
import type { ContactFormData, ContactFormErrors } from "@/lib/validation";
import { hasValidationErrors, validateContactForm } from "@/lib/validation";

declare global {
  interface Window {
    grecaptcha?: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

const initialForm: ContactFormData = {
  name: "",
  email: "",
  phone: "",
  message: "",
};

export default function ContactForm() {
  const [form, setForm] = useState<ContactFormData>(initialForm);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");
  const [recaptchaReady, setRecaptchaReady] = useState(false);

  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  const updateField = (field: keyof ContactFormData, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const getRecaptchaToken = useCallback(async () => {
    if (!siteKey || !window.grecaptcha) {
      return "";
    }

    return new Promise<string>((resolve, reject) => {
      window.grecaptcha!.ready(async () => {
        try {
          const token = await window.grecaptcha!.execute(siteKey, {
            action: "contact_form",
          });
          resolve(token);
        } catch (error) {
          reject(error);
        }
      });
    });
  }, [siteKey]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("idle");
    setFeedback("");

    const validationErrors = validateContactForm(form);
    if (hasValidationErrors(validationErrors)) {
      setErrors(validationErrors);
      setStatus("error");
      setFeedback("Please fix the highlighted fields.");
      return;
    }

    setStatus("loading");

    try {
      const recaptchaToken = siteKey ? await getRecaptchaToken() : "";

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
        if (result.errors) {
          setErrors(result.errors);
        }
        setStatus("error");
        setFeedback(result.message || "Failed to send message.");
        return;
      }

      setForm(initialForm);
      setErrors({});
      setStatus("success");
      setFeedback(result.message);
    } catch {
      setStatus("error");
      setFeedback("Network error. Please check your connection and try again.");
    }
  };

  return (
    <>
      {siteKey ? (
        <Script
          src={`https://www.google.com/recaptcha/api.js?render=${siteKey}`}
          strategy="afterInteractive"
          onLoad={() => setRecaptchaReady(true)}
        />
      ) : null}

      <form className="mt-6 grid gap-3" onSubmit={handleSubmit} noValidate>
        <FormField
          label="Name"
          name="name"
          value={form.name}
          placeholder="Juan Dela Cruz"
          error={errors.name}
          onChange={(value) => updateField("name", value)}
        />

        <div className="grid gap-3 md:grid-cols-2">
          <FormField
            label="Email"
            name="email"
            type="email"
            value={form.email}
            placeholder="juan@gmail.com"
            error={errors.email}
            onChange={(value) => updateField("email", value)}
          />
          <FormField
            label="Phone Number"
            name="phone"
            type="tel"
            value={form.phone}
            placeholder="09123456789"
            error={errors.phone}
            onChange={(value) => updateField("phone", value)}
          />
        </div>

        <FormField
          label="Message"
          name="message"
          value={form.message}
          placeholder="Hello OWLDEV, I would like to inquire about your web development services."
          error={errors.message}
          multiline
          onChange={(value) => updateField("message", value)}
        />

        <button
          type="submit"
          disabled={status === "loading" || (!!siteKey && !recaptchaReady)}
          className="mt-1 inline-flex h-11 items-center justify-center rounded-full bg-cyan-300 px-6 text-sm font-semibold text-[#061018] shadow-[0_12px_40px_-20px_rgba(34,211,238,0.85)] transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "loading" ? "Sending..." : "Send Message"}
        </button>

        {feedback ? (
          <p
            className={`rounded-2xl px-4 py-3 text-sm ring-1 ${
              status === "success"
                ? "bg-emerald-400/10 text-emerald-200 ring-emerald-300/20"
                : "bg-red-400/10 text-red-200 ring-red-300/20"
            }`}
            role="status"
          >
            {feedback}
          </p>
        ) : null}

        {siteKey ? (
          <p className="text-[11px] leading-5 text-zinc-500">
            Protected by Google reCAPTCHA.
          </p>
        ) : null}
      </form>
    </>
  );
}

function FormField({
  label,
  name,
  value,
  placeholder,
  error,
  multiline,
  type = "text",
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  placeholder: string;
  error?: string;
  multiline?: boolean;
  type?: string;
  onChange: (value: string) => void;
}) {
  const inputClassName =
    "w-full rounded-2xl border bg-black/25 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none ring-0 transition focus:bg-black/30";

  return (
    <label className="grid gap-1.5">
      <span className="text-xs font-semibold text-zinc-300">{label}</span>
      {multiline ? (
        <textarea
          name={name}
          rows={4}
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className={`${inputClassName} resize-none ${
            error
              ? "border-red-400/40 focus:border-red-400/50"
              : "border-white/10 focus:border-cyan-300/30"
          }`}
        />
      ) : (
        <input
          name={name}
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className={`h-11 ${inputClassName} ${
            error
              ? "border-red-400/40 focus:border-red-400/50"
              : "border-white/10 focus:border-cyan-300/30"
          }`}
        />
      )}
      {error ? <span className="text-xs text-red-300">{error}</span> : null}
    </label>
  );
}
