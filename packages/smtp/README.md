# @promise-watch/smtp

## Installation

```bash
pnpm add @promise-watch/smtp
```

## Usage

```typescript
import { SmtpNotifier } from "@promise-watch/smtp";
import type SMTPTransport from "nodemailer/lib/smtp-transport";
import type Mail from "nodemailer/lib/mailer";

const smtpOptions: SMTPTransport | SMTPTransport.Options | string = {
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
};

const mailOptions: Mail.Options = {
  to: process.env.SMTP_TO,
  from: process.env.SMTP_FROM,
};

const options: ExecuteOptions = {
  dir: __dirname,
  errorNotifiers: [
    new SmtpNotifier(smtpOptions, mailOptions),
  ],
};
```