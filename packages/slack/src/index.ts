import { Notifier, SendOptions } from "@promise-watch/core";
import { IncomingWebhook, IncomingWebhookSendArguments } from "@slack/webhook";

export class SlackNotifier implements Notifier {
  private readonly webhook: IncomingWebhook;

  constructor(url: string, private readonly options?: IncomingWebhookSendArguments) {
    this.webhook = new IncomingWebhook(url);
  }

  async send({ title, body, isSuccess }: SendOptions): Promise<void> {
    await this.webhook.send({
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: isSuccess ? `:white_check_mark: ${title} has recovered.` : `:exclamation: ${title} seems down!`,
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
