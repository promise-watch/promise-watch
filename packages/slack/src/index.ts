import { Notifier, SendOptions } from "@js-watcher/core";
import { IncomingWebhook, IncomingWebhookSendArguments } from "@slack/webhook";

export class SlackNotifier implements Notifier {
  private readonly webhook: IncomingWebhook;

  constructor(url: string, private readonly options?: IncomingWebhookSendArguments) {
    this.webhook = new IncomingWebhook(url);
  }

  async send({ title, body }: SendOptions): Promise<void> {
    await this.webhook.send({
      text: `**${title}**\n${body}`,
      ...this.options,
    });
  }
}
