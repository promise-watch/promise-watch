import { Notifier, SendOptions } from "@promise-watch/core";
import { createTransport, Transporter } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import Mail from "nodemailer/lib/mailer";

export class SmtpNotifer implements Notifier {
  private readonly transporter: Transporter<SMTPTransport.SentMessageInfo>;

  constructor(transport: SMTPTransport | SMTPTransport.Options | string, private readonly sendInfo: Mail.Options) {
    this.transporter = createTransport(transport);
  }

  async send({ title, body }: SendOptions): Promise<void> {
    await this.transporter.sendMail({
      subject: title,
      text: body,
      html: `<p>${body}</p>`,
      ...this.sendInfo,
    });
  }
}
