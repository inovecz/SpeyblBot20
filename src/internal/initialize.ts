import { BotBuilderCloudAdapter } from "@microsoft/teamsfx";
import ConversationBot = BotBuilderCloudAdapter.ConversationBot;
import config from "./config";
import { BlobStore } from "../utils/azureTableStorage";

// Create bot.
export const notificationApp = new ConversationBot({
  // The bot id and password to create CloudAdapter.
  // See https://aka.ms/about-bot-adapter to learn more about adapters.
  adapterConfig: config,
  // Enable notification
  notification: {
    enabled: true,
    store: new BlobStore(config.BlobStorageConnectionString, config.BlobStorageContainerName),
  },
});
