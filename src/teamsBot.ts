import axios from "axios";
import { ActivityTypes, InvokeResponse, TeamsActivityHandler, TurnContext } from "botbuilder";
import { generateAdaptiveCard, prettyJSON } from "./utils/utils";

// Teams activity handler.
// You can add your customization code here to extend your bot logic if needed.
export class TeamsBot extends TeamsActivityHandler {

  constructor() {
    super();

    this.onMessage(async (context, next) => {
      console.log("Received message activity:", prettyJSON(context.activity));
      await next();
    });

    this.onMembersAdded(async (context, next) => {
      for (const member of context.activity.membersAdded) {
        if (member.id) {
          await context.sendActivity(`👋 Welcome to Speybl Notification Bot for Microsoft Teams!\n\nSpeybl is here to keep you informed and updated with important notifications, right within your Microsoft Teams workspace. Please note that this bot is designed to provide one-way notifications, ensuring you never miss out on critical information.\n\nTo get started, register on our application at [app.speybl.com](https://app.speybl.com)\n\nFeel free to reach out to us if you have any questions, concerns, or need assistance. Our dedicated support team is here to help you. You can contact us at [hello@speybl.com](mailto:hello@speybl.com).`);
          break;
        }
      }
      await next();
    });

    this.onInvokeActivity = async (context: TurnContext): Promise<InvokeResponse> => {
      console.log("Received invoke action:", JSON.stringify(context.activity, null, 2));

      // Extract the action data
      const actionData = context.activity.value?.action || {};
      const notificationPayload = actionData.data.notificationPayload || {};

      // Make an API call based on the action data
      try {
        const axiosConfig = {
          method: actionData.data.action.method,
          url: actionData.data.action.url,
          headers: actionData.data.action.headers || {},
          data: actionData.data.action.body || {},
        };
        const response = await axios(axiosConfig);
        await context.updateActivity({
          id: context.activity.replyToId,
          type: ActivityTypes.Message,
          // Update the card with the API response so that the response overwrites the card as TextBlock and then a divider.
          attachments: [
            {
              contentType: "application/vnd.microsoft.card.adaptive",
              content: {
                $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
                type: "AdaptiveCard",
                version: "1.4",
                body: [
                  ... generateAdaptiveCard({notificationPayload}).body,
                  {
                    type: "TextBlock",
                    text: `${response.data.message}`,
                    wrap: true
                  }
                ]
              }
            }
          ]
        });
      } catch (error) {
        console.error("Error making Axios request:", error);
        return {
          status: 500,
          body: { message: "Error making Axios request" }
        };
      }
      // Respond to the invoke action
      return {
          status: 200,
          body: { message: "Invoke action received" }
      };
    };

  }
}
