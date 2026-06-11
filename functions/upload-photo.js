/**
 * POST /upload-photo
 *
 * Accepts a multipart form with:
 *   - photo  (required, image/*)
 *   - name   (optional)
 *   - email  (optional)
 *   - message (optional)
 *
 * Sends the photo as an email attachment via a pluggable email provider.
 *
 * Environment variables (configure in Cloudflare Pages dashboard):
 *   PHOTO_EMAIL_TO   — recipient address
 *   EMAIL_PROVIDER   — "resend" | "sendgrid" | "mailgun" (default: "resend")
 *   EMAIL_API_KEY    — API key for the chosen provider
 *
 * ================================================================
 * TO ADD YOUR PROVIDER:
 *   1. Add a new case in sendEmail() below
 *   2. Set EMAIL_PROVIDER and EMAIL_API_KEY in Cloudflare Pages
 *   3. Optionally add provider-specific env vars (see comments)
 * ================================================================
 */

// ── Validation ──────────────────────────────────────────────────
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

function validate(file) {
  if (!file) return 'No photo uploaded.';
  if (!ALLOWED_TYPES.includes(file.type)) return 'Only JPEG, PNG, or WebP photos are accepted.';
  if (file.size > MAX_SIZE) return 'Photo must be under 10 MB.';
  return null;
}

// ── Email sending (pluggable) ──────────────────────────────────
async function sendEmail(file, fields, env) {
  const provider = (env.EMAIL_PROVIDER || 'resend').toLowerCase();

  switch (provider) {
    case 'resend':
      return sendViaResend(file, fields, env);
    case 'sendgrid':
      return sendViaSendGrid(file, fields, env);
    case 'mailgun':
      return sendViaMailgun(file, fields, env);
    default:
      throw new Error(`Unknown EMAIL_PROVIDER: ${provider}`);
  }
}

/* ── Resend ─────────────────────────────────────────────────────
 *   Docs: https://resend.com/docs/api-reference/emails/send-email
 *   Env:  EMAIL_API_KEY (required)
 *         Optionally set PHOTO_EMAIL_FROM (default: noreply@yourdomain.com)
 */
async function sendViaResend(file, fields, env) {
  const buf = await file.arrayBuffer();
  const b64 = arrayBufferToBase64(buf);

  const body = {
    from: env.PHOTO_EMAIL_FROM || 'Photo Submission <noreply@texasredwolves.org>',
    to: [env.PHOTO_EMAIL_TO],
    subject: `Photo submission from ${fields.name || 'anonymous'}`,
    text: buildEmailBody(fields),
    attachments: [{
      filename: file.name,
      content: b64,
    }],
  };

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.EMAIL_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Resend API error');
  return data;
}

/* ── SendGrid ──────────────────────────────────────────────────
 *   Docs: https://docs.sendgrid.com/api-reference/mail-send
 *   Env:  EMAIL_API_KEY (required)
 *         Optionally set PHOTO_EMAIL_FROM
 */
async function sendViaSendGrid(file, fields, env) {
  const buf = await file.arrayBuffer();
  const b64 = arrayBufferToBase64(buf);

  const body = {
    personalizations: [{ to: [{ email: env.PHOTO_EMAIL_TO }] }],
    from: { email: env.PHOTO_EMAIL_FROM || 'noreply@texasredwolves.org' },
    subject: `Photo submission from ${fields.name || 'anonymous'}`,
    content: [{ type: 'text/plain', value: buildEmailBody(fields) }],
    attachments: [{
      filename: file.name,
      content: b64,
      disposition: 'attachment',
    }],
  };

  const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.EMAIL_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'SendGrid API error');
  }
  return { id: 'sendgrid-ok' };
}

/* ── Mailgun ────────────────────────────────────────────────────
 *   Docs: https://documentation.mailgun.com/en/latest/api-sending.html
 *   Env:  EMAIL_API_KEY  (required — "key-..." or your API key)
 *         MAILGUN_DOMAIN (required — e.g. "mg.yourdomain.com")
 *         Optionally set PHOTO_EMAIL_FROM
 */
async function sendViaMailgun(file, fields, env) {
  const buf = await file.arrayBuffer();
  const bytes = [...new Uint8Array(buf)];
  const b64 = btoa(String.fromCharCode(...bytes));

  const domain = env.MAILGUN_DOMAIN;
  if (!domain) throw new Error('MAILGUN_DOMAIN env var is required');

  const form = new FormData();
  form.set('from', env.PHOTO_EMAIL_FROM || `Photo Submission <noreply@${domain}>`);
  form.set('to', env.PHOTO_EMAIL_TO);
  form.set('subject', `Photo submission from ${fields.name || 'anonymous'}`);
  form.set('text', buildEmailBody(fields));
  form.set('attachment', new Blob([buf], { type: file.type }), file.name);

  const res = await fetch(`https://api.mailgun.net/v3/${domain}/messages`, {
    method: 'POST',
    headers: { 'Authorization': `Basic ${btoa('api:' + env.EMAIL_API_KEY)}` },
    body: form,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Mailgun API error');
  }
  return res.json();
}

// ── Helpers ─────────────────────────────────────────────────────
function buildEmailBody(fields) {
  const parts = ['A new photo was submitted via the website.'];
  if (fields.name) parts.push(`\nName: ${fields.name}`);
  if (fields.email) parts.push(`Email: ${fields.email}`);
  if (fields.message) parts.push(`\nNotes:\n${fields.message}`);
  return parts.join('\n');
}

function arrayBufferToBase64(buf) {
  const bytes = new Uint8Array(buf);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// ── Request handler ─────────────────────────────────────────────
export async function onRequest(context) {
  const { request, env } = context;

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', 'Allow': 'POST' },
    });
  }

  if (!env.PHOTO_EMAIL_TO) {
    return new Response(JSON.stringify({ error: 'Server not configured (no recipient). Set PHOTO_EMAIL_TO in Cloudflare Pages environment variables.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const fd = await request.formData();
    const photo = fd.get('photo');

    const error = validate(photo);
    if (error) {
      return new Response(JSON.stringify({ error }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const fields = {
      name: (fd.get('name') || '').trim().slice(0, 100),
      email: (fd.get('email') || '').trim().slice(0, 254),
      message: (fd.get('message') || '').trim().slice(0, 2000),
    };

    await sendEmail(photo, fields, env);

    return new Response(JSON.stringify({ message: 'Photo submitted successfully!' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('upload-photo error:', err);
    const message = env.PHOTO_EMAIL_TO
      ? 'Failed to send photo. Check your email provider configuration.'
      : 'Server not configured. Set PHOTO_EMAIL_TO and EMAIL_API_KEY in Cloudflare Pages.';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
