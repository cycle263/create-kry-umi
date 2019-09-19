import * as Sentry from '@sentry/browser';

/* eslint-disable no-undef */
if (__IS_RELEASE__) {
  Sentry.init({
    dsn: "http://80df9a75733c46059c5d25d50d6aea8e@ip.ip.ip.ip:port/2",
  });
}
