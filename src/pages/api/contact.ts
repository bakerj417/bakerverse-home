import type { APIRoute } from 'astro';
import { Resend } from 'resend';

// This route runs on Vercel serverless at request time, not at build.
export const prerender = false;

interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
  hp: string;
  turnstileToken: string;
}

type Result =
  | { ok: true }
  | { ok: false; status: number; error: string };

const MAX_NAME = 120;
const MAX_EMAIL = 254;
const MAX_SUBJECT = 200;
const MAX_MESSAGE = 5000;

function jsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function sanitizeLine(value: string): string {
  // Strip CR/LF to prevent email header injection for fields that feed
  // into subject or reply-to.
  return value.replace(/[\r\n]+/g, ' ').trim();
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

async function verifyTurnstile(
  token: string,
  secret: string,
  remoteIp: string | null,
): Promise<boolean> {
  const body = new URLSearchParams();
  body.set('secret', secret);
  body.set('response', token);
  if (remoteIp) body.set('remoteip', remoteIp);

  try {
    const res = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      { method: 'POST', body },
    );
    if (!res.ok) return false;
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}

function validate(payload: Partial<ContactPayload>): Result {
  const name = sanitizeLine(payload.name ?? '');
  const email = sanitizeLine(payload.email ?? '').toLowerCase();
  const subject = sanitizeLine(payload.subject ?? '');
  const message = (payload.message ?? '').trim();

  if (!name) return { ok: false, status: 400, error: 'Name is required.' };
  if (name.length > MAX_NAME)
    return { ok: false, status: 400, error: 'Name is too long.' };

  if (!email) return { ok: false, status: 400, error: 'Email is required.' };
  if (email.length > MAX_EMAIL || !isEmail(email))
    return { ok: false, status: 400, error: 'Please enter a valid email.' };

  if (subject.length > MAX_SUBJECT)
    return { ok: false, status: 400, error: 'Subject is too long.' };

  if (!message)
    return { ok: false, status: 400, error: 'Message is required.' };
  if (message.length > MAX_MESSAGE)
    return { ok: false, status: 400, error: 'Message is too long.' };

  return { ok: true };
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const resendKey = import.meta.env.RESEND_API_KEY;
  const toEmail = import.meta.env.CONTACT_TO_EMAIL;
  const turnstileSecret = import.meta.env.TURNSTILE_SECRET_KEY;

  if (!resendKey || !toEmail || !turnstileSecret) {
    return jsonResponse(
      { ok: false, error: 'Contact endpoint is not configured.' },
      500,
    );
  }

  let payload: Partial<ContactPayload>;
  try {
    payload = (await request.json()) as Partial<ContactPayload>;
  } catch {
    return jsonResponse({ ok: false, error: 'Invalid request body.' }, 400);
  }

  // Honeypot — silently accept so bots don't learn they were detected.
  if (payload.hp && payload.hp.trim().length > 0) {
    return jsonResponse({ ok: true }, 200);
  }

  const validation = validate(payload);
  if (!validation.ok) {
    return jsonResponse({ ok: false, error: validation.error }, validation.status);
  }

  const token = (payload.turnstileToken ?? '').trim();
  if (!token) {
    return jsonResponse(
      { ok: false, error: 'Bot-check token is missing.' },
      400,
    );
  }

  const remoteIp =
    request.headers.get('cf-connecting-ip') ??
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    clientAddress ??
    null;

  const turnstileOk = await verifyTurnstile(token, turnstileSecret, remoteIp);
  if (!turnstileOk) {
    return jsonResponse(
      { ok: false, error: 'Bot check failed. Please try again.' },
      400,
    );
  }

  const name = sanitizeLine(payload.name ?? '');
  const email = sanitizeLine(payload.email ?? '').toLowerCase();
  const subjectInput = sanitizeLine(payload.subject ?? '');
  const subject = subjectInput || `A word from ${name}`;
  const message = (payload.message ?? '').trim();

  const resend = new Resend(resendKey);

  const fromAddress = 'Joseph Baker Contact <contact@josephkbaker.com>';

  const textBody = [
    `New message via josephkbaker.com/contact`,
    ``,
    `Name:    ${name}`,
    `Email:   ${email}`,
    `Subject: ${subject}`,
    ``,
    message,
  ].join('\n');

  const htmlBody = [
    `<div style="font-family:system-ui,sans-serif;color:#222;line-height:1.5">`,
    `  <p style="margin:0 0 12px;color:#888;font-size:12px;letter-spacing:0.08em;text-transform:uppercase">New message via josephkbaker.com/contact</p>`,
    `  <p style="margin:0 0 4px"><strong>Name:</strong> ${escapeHtml(name)}</p>`,
    `  <p style="margin:0 0 4px"><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>`,
    `  <p style="margin:0 0 16px"><strong>Subject:</strong> ${escapeHtml(subject)}</p>`,
    `  <hr style="border:none;border-top:1px solid #ddd;margin:12px 0" />`,
    `  <pre style="white-space:pre-wrap;font-family:inherit;margin:0">${escapeHtml(message)}</pre>`,
    `</div>`,
  ].join('\n');

  try {
    const result = await resend.emails.send({
      from: fromAddress,
      to: toEmail,
      replyTo: `${name} <${email}>`,
      subject,
      text: textBody,
      html: htmlBody,
    });

    if (result.error) {
      return jsonResponse(
        { ok: false, error: 'Email service rejected the message.' },
        502,
      );
    }

    return jsonResponse({ ok: true }, 200);
  } catch {
    return jsonResponse(
      { ok: false, error: 'Could not send the message. Please try again.' },
      502,
    );
  }
};

export const GET: APIRoute = () =>
  jsonResponse({ ok: false, error: 'Method not allowed.' }, 405);
