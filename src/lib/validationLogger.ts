import type { ZodError } from 'zod';

let sentryInitialized = false;

export async function maybeInitSentry() {
  if (sentryInitialized) return;
  const dsn = process.env.SENTRY_DSN;
  if (!dsn) return;
  try {
    // dynamic import so Sentry is optional
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Sentry = require('@sentry/node');
    Sentry.init({ dsn, tracesSampleRate: 0 });
    sentryInitialized = true;
  } catch (err) {
    // If Sentry isn't installed or init fails, keep going silently
    // but log the failure for operators
    // eslint-disable-next-line no-console
    console.error('[validation] failed to init Sentry', err);
  }
}

export function logValidationError(topic: string, e: ZodError<any>) {
  try {
    const issues = e.issues.map((i) => ({ path: i.path, message: i.message, expected: (i as any).expected ?? null }));
    // Structured log so it can be grepped/collected in production
    console.error('[validation]', topic, JSON.stringify({ message: e.message, issues }));

    // Fire-and-forget Sentry reporting if configured
    if (process.env.SENTRY_DSN) {
      (async () => {
        try {
          await maybeInitSentry();
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          const Sentry = require('@sentry/node');
          Sentry.captureException(e, { contexts: { validation: { topic, issues } } });
        } catch (err) {
          // best-effort only
          // eslint-disable-next-line no-console
          console.error('[validation] failed to send to Sentry', err);
        }
      })();
    }
  } catch (err) {
    // Fallback
    console.error('[validation] failed to serialize ZodError', e);
  }
}
