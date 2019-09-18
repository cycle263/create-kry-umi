import * as Sentry from '@sentry/browser';

if (__IS_RELEASE__) {
  Sentry.init({
    dsn: "http://80df9a75733c46059c5d25d50d6aea8e@10.8.8.12:9000/2",
  });
}
