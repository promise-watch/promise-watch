import { Notifier, SendOptions } from "@promise-watch/core";
import { createTransport, Transporter } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import Mail from "nodemailer/lib/mailer";

export class SmtpNotifier implements Notifier {
  private readonly transporter: Transporter<SMTPTransport.SentMessageInfo>;

  constructor(transport: SMTPTransport | SMTPTransport.Options | string, private readonly sendInfo: Mail.Options) {
    this.transporter = createTransport(transport);
  }

  async sendError({ title, body }: SendOptions): Promise<void> {
    const subject = `${title} seems down!`;
    await this.transporter.sendMail({
      subject,
      text: body,
      html: `<h2>${title}</h2><p>${body}</p>`,
      ...this.sendInfo,
    });
  }

  async sendRecovered({ title, body }: SendOptions): Promise<void> {
    const subject = `${title} has recovered.`;
    await this.transporter.sendMail({
      subject,
      text: body,
      html: `<h2>${subject}</h2><p>${body}</p>`,
      ...this.sendInfo,
    });
  }
}
