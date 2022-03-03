import "dotenv/config"

import { ConsoleNotifier } from '@promise-watch/core';
import { PushoverNotifier } from '@promise-watch/pushover';
import { SlackNotifier } from '@promise-watch/slack';
import { SmtpNotifier } from '@promise-watch/smtp';

export default {
  notifiers: [
    new ConsoleNotifier(),
    new PushoverNotifier({
      apiKey: process.env.PUSHOVER_API_KEY!,
      userKey: process.env.PUSHOVER_USER_KEY!,
    }),
    new SlackNotifier(process.env.SLACK_WEBHOOK_URL!),
    new SmtpNotifier({
      host: process.env.SMTP_HOST!,
      port: +process.env.SMTP_PORT! || 587,
    }, {
      to: process.env.SMTP_TO!,
      from: process.env.SMTP_FROM!,
    }),
  ],
};
