import * as Sentry from '@sentry/astro';

const dsn = import.meta.env.PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    // Stale-deployment artifact: browser cached HTML references a content-hash chunk
    // that no longer exists after a redeploy. Not actionable — vercel.json cache
    // headers reduce the window, but it can still occur at the deployment instant.
    ignoreErrors: [
      /Failed to fetch dynamically imported module/,
      /error loading dynamically imported module/,
    ],
    integrations: [
      Sentry.replayIntegration(),
    ],
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
}
