import { Notifier, SendOptions } from "@promise-watch/core";
import { IncomingWebhook, IncomingWebhookSendArguments } from "@slack/webhook";

export class SlackNotifier implements Notifier {
  private readonly webhook: IncomingWebhook;

  constructor(url: string, private readonly options?: IncomingWebhookSendArguments) {
    this.webhook = new IncomingWebhook(url);
  }

  async sendError({ title, body }: SendOptions): Promise<void> {
    await this.webhook.send({
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: `:exclamation: ${title} seems down!`,
            emoji: true,
          },
        },
        {
          type: "section",
          text: {
            type: "plain_text",
            text: body,
          },
        },
      ],
      ...this.options,
    });
  }

  async sendRecovered({ title, body }: SendOptions): Promise<void> {
    await this.webhook.send({
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: `:white_check_mark: ${title} has recovered.`,
            emoji: true,
          },
        },
        {
          type: "section",
          text: {
            type: "plain_text",
            text: body,
          },
        },
      ],
      ...this.options,
    });
  }
}
