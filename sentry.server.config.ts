import * as Sentry from '@sentry/astro';

const dsn = process.env.SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
  });
}
