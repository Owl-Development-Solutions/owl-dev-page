import { promises as fs } from "fs";
import path from "path";
import type { ContactFormData } from "./validation";

export type ContactSubmission = ContactFormData & {
  id: string;
  createdAt: string;
};

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "contact-submissions.json");

async function ensureDataFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });

  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, "[]", "utf-8");
  }
}

async function readSubmissions(): Promise<ContactSubmission[]> {
  await ensureDataFile();
  const raw = await fs.readFile(DATA_FILE, "utf-8");
  return JSON.parse(raw) as ContactSubmission[];
}

export async function saveSubmission(data: ContactFormData): Promise<ContactSubmission> {
  const submissions = await readSubmissions();

  const submission: ContactSubmission = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };

  submissions.unshift(submission);
  await fs.writeFile(DATA_FILE, JSON.stringify(submissions, null, 2), "utf-8");

  return submission;
}

export async function getSubmissions(): Promise<ContactSubmission[]> {
  return readSubmissions();
}
