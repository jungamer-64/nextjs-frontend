import type { ZodError, ZodIssue } from 'zod';

let sentryInitialized = false;

type SentryLike = {
  init: (opts: { dsn: string; tracesSampleRate?: number }) => void;
  captureException: (e: unknown, ctx?: Record<string, unknown>) => void;
};

async function loadSentry(): Promise<SentryLike | null> {
  try {
    const mod = await import('@sentry/node');
    // CJS default or ESM named
    const SentryLib = (mod as unknown as { default?: SentryLike }).default ?? (mod as unknown as SentryLike);
    return SentryLib ?? null;
  } catch {
    return null;
  }
}

export async function maybeInitSentry() {
  if (sentryInitialized) return;
  const dsn = process.env.SENTRY_DSN;
  if (!dsn) return;
  try {
    const SentryLib = await loadSentry();
    if (!SentryLib) return;
    SentryLib.init({ dsn, tracesSampleRate: 0 });
    sentryInitialized = true;
    } catch (error) {
    // If Sentry isn't installed or init fails, keep going silently
    console.error('[validation] failed to init Sentry', error);
  }
}

export function logValidationError(topic: string, e: ZodError<unknown>) {
  try {
    const issues = e.issues.map((i: ZodIssue) => ({ path: i.path, message: i.message, expected: (i as unknown as { expected?: unknown }).expected ?? null }));
  // Structured log so it can be grepped/collected in production
  console.error('[validation]', topic, JSON.stringify({ message: e.message, issues }));

    // Fire-and-forget Sentry reporting if configured
    if (process.env.SENTRY_DSN) {
      (async () => {
        try {
          await maybeInitSentry();
          const SentryLib = await loadSentry();
          if (!SentryLib) return;
          SentryLib.captureException(e, { contexts: { validation: { topic, issues } } });
        } catch (error) {
          // best-effort only
          console.error('[validation] failed to send to Sentry', error);
        }
      })();
    }
  } catch (error) {
    // Fallback
    console.error('[validation] failed to serialize ZodError', error);
  }
}
