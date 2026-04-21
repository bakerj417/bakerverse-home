/**
 * POST /api/themes/submit
 *
 * Theme submission endpoint — currently a 501 stub.
 * Submissions are not yet open; this endpoint is wired up so the
 * SubmissionForm UI can demonstrate the full flow gracefully.
 *
 * When submissions open, replace the body of the POST handler with
 * actual validation + storage logic. The response envelope shape
 * ({ status, message }) is the public contract — keep it stable.
 *
 * Expected request body (JSON):
 *   { hash: string; authorNote?: string }
 *
 * Response (always 501 until implemented):
 *   { status: "disabled", message: string }
 */

import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = () => {
  return new Response(
    JSON.stringify({
      status: 'disabled',
      message:
        'Theme submissions are not open yet. Follow josephkbaker.com for updates!',
    }),
    {
      status: 501,
      headers: {
        'Content-Type': 'application/json',
        // Prevent caching of this stub so it's easy to observe when the
        // endpoint goes live.
        'Cache-Control': 'no-store',
      },
    },
  );
};

// Reject non-POST verbs with 405
export const GET: APIRoute = () =>
  new Response(JSON.stringify({ status: 'error', message: 'Method not allowed' }), {
    status: 405,
    headers: { 'Content-Type': 'application/json', Allow: 'POST' },
  });
