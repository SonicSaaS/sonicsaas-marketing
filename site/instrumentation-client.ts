import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Low sample rate — static marketing site has minimal client-side JS
  tracesSampleRate: 0.05,

  environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT || process.env.NODE_ENV,

  // Filter benign browser errors to protect free tier budget
  beforeSend(event) {
    const message = event.exception?.values?.[0]?.value ?? '';
    if (/ResizeObserver|Loading chunk|Failed to fetch|ChunkLoadError/i.test(message)) return null;
    return event;
  },
});

// Required by Next.js 15 + Sentry v10 for navigation instrumentation
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
