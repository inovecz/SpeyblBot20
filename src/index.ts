import express from "express";
import { notificationApp } from "./internal/initialize";
import internalAuthMiddleware from "./middleware/internalAuth.middleware";
import { generateAdaptiveCard } from "./utils/utils";
import { validatePayload } from "./middleware/validateNotificationPayload";
import NotificationPayload from "./interfaces/notificationPayload";
import { TeamsBot } from "./teamsBot";

const teamsBot = new TeamsBot();

// Create express application.
const expressApp = express();
expressApp.use(express.json());

const server = expressApp.listen(process.env.port || process.env.PORT || 3978, () => {
  console.log(`\nBot Started, ${expressApp.name} listening to`, server.address());
});

// API endpoint to send a notification to a user.
expressApp.post("/api/notification", validatePayload,  internalAuthMiddleware, async (req, res) => {
  const notificationPayload = req.body as NotificationPayload;
  if (!notificationPayload.userPrincipalName) {
    res.status(400).json({ error: "userPrincipalName is required" });
    return;
  }
  const member = await notificationApp.notification.findMember(
    async (m) => m.account.userPrincipalName === notificationPayload.userPrincipalName
  );
  if (!member) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  await member?.sendAdaptiveCard(generateAdaptiveCard({notificationPayload}));

  res.json({
    success: true,
    message: "Message sent successfully"
  });
});

// Register an API endpoint with `express`. Teams sends messages to your application
// through this endpoint.
//
// The Teams Toolkit bot registration configures the bot with `/api/messages` as the
// Bot Framework endpoint. If you customize this route, update the Bot registration
// in `/templates/provision/bot.bicep`.
expressApp.post("/api/messages", async (req, res) => {
  await notificationApp.requestHandler(req, res, async (context) => {
    await teamsBot.run(context);
  });
});