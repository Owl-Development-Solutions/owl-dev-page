"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";
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
          placeholder="Full Name"
          error={errors.name}
          onChange={(v) => updateField("name", v)}
        />

        <FormField
          label="Email"
          name="email"
          type="email"
          value={form.email}
          placeholder="Example@gmail.com"
          error={errors.email}
          onChange={(v) => updateField("email", v)}
        />
        <PhoneFormField
          label="Phone Number"
          name="phone"
          value={form.phone}
          placeholder="(123) 456-7890"
          error={errors.phone}
          onChange={(v) => updateField("phone", v)}
        />

        <FormField
          label="Message"
          name="message"
          value={form.message}
          placeholder="Describe your message here..."
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

const COUNTRY_CODES = [
  { code: "+1", country: "US/CA", flag: "us" },
  { code: "+44", country: "UK", flag: "gb" },
  { code: "+61", country: "AU", flag: "au" },
  { code: "+63", country: "PH", flag: "ph" },
  { code: "+91", country: "IN", flag: "in" },
  { code: "+86", country: "CN", flag: "cn" },
  { code: "+81", country: "JP", flag: "jp" },
  { code: "+49", country: "DE", flag: "de" },
  { code: "+33", country: "FR", flag: "fr" },
  { code: "+39", country: "IT", flag: "it" },
  { code: "+34", country: "ES", flag: "es" },
  { code: "+55", country: "BR", flag: "br" },
  { code: "+52", country: "MX", flag: "mx" },
  { code: "+7", country: "RU", flag: "ru" },
  { code: "+82", country: "KR", flag: "kr" },
  { code: "+65", country: "SG", flag: "sg" },
  { code: "+60", country: "MY", flag: "my" },
  { code: "+62", country: "ID", flag: "id" },
  { code: "+66", country: "TH", flag: "th" },
  { code: "+84", country: "VN", flag: "vn" },
];

function PhoneFormField({
  label,
  name,
  value,
  placeholder,
  error,
  onChange,
}: Omit<FormFieldProps, "type" | "multiline">) {
  const id = `field-${name}`;
  const errorId = `${id}-error`;

  const baseClass =
    "w-full rounded-2xl border bg-black/25 text-sm text-zinc-100 " +
    "transition focus-within:bg-black/30 flex h-11 relative";

  const borderClass = error
    ? "border-red-400/40 focus-within:border-red-400/60"
    : "border-white/10 focus-within:border-cyan-300/30";

  const [countryCode, setCountryCode] = useState("+63");
  const [number, setNumber] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!value) {
      setNumber("");
    }
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCountrySelect = (code: string) => {
    setCountryCode(code);
    setIsOpen(false);
    if (number) onChange(`${code} ${number}`);
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNum = e.target.value;
    setNumber(newNum);
    onChange(`${countryCode} ${newNum}`);
  };

  const selectedCountry = COUNTRY_CODES.find(c => c.code === countryCode) || COUNTRY_CODES[3]; // Default to PH

  return (
    <div className="grid gap-1.5">
      <label htmlFor={id} className="text-xs font-semibold text-zinc-300">
        {label}
      </label>

      <div className={`${baseClass} ${borderClass}`}>
        <div className="relative flex items-center h-full" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center h-full px-3 gap-2 bg-transparent border-r border-white/10 hover:bg-white/5 transition"
            aria-label="Select Country Code"
          >
            <img 
              src={`https://flagcdn.com/w20/${selectedCountry.flag}.png`} 
              alt={selectedCountry.country}
              width="20"
              className="rounded-[2px]"
            />
            <span className="text-zinc-300 text-sm">
              {selectedCountry.code}
            </span>
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {isOpen && (
            <div className="absolute top-full left-0 mt-1 w-56 max-h-60 overflow-y-auto rounded-xl border border-white/10 bg-[#07090d]/95 backdrop-blur-md shadow-xl z-50 py-1 scrollbar-thin flex flex-col">
              {COUNTRY_CODES.map((c) => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => handleCountrySelect(c.code)}
                  className={`flex w-full items-center gap-3 px-3 py-2 text-sm text-left hover:bg-white/10 transition ${countryCode === c.code ? 'bg-white/5' : ''}`}
                >
                  <img src={`https://flagcdn.com/w20/${c.flag}.png`} alt={c.country} width="20" className="rounded-[2px]" />
                  <span className="text-zinc-100 flex-1">{c.country}</span>
                  <span className="text-zinc-500">{c.code}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <input
          id={id}
          name={name}
          value={number}
          placeholder={placeholder}
          type="tel"
          className="flex-1 bg-transparent px-4 outline-none placeholder:text-zinc-500 min-w-0"
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error ? errorId : undefined}
          onChange={handleNumberChange}
        />
      </div>

      {error ? (
        <span id={errorId} role="alert" className="text-xs text-red-300">
          {error}
        </span>
      ) : null}
    </div>
  );
}

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
