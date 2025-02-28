import jwt from 'jsonwebtoken';
import moment from 'moment';
import NotificationPayload from '../interfaces/notificationPayload';

// A function to generate JWT signature that CB will put as request header 'X-INOVE-SIGNATURE' on an api call to CB.
export const generateSignature = ({
  url,
  body,
}: {
  url: string;
  body: string;
}): string => {
  const jwtSecret = process.env.INOVE_SIGNATURE_SECRET || '';
  const signature = jwt.sign(
    JSON.stringify({
      url,
      body,
      iss: 'INOVE',
      exp: moment().unix() + 3600, // 1 hour validity
    }),
    jwtSecret
  );
  return signature;
};

export const prettyJSON = (data: unknown): string =>
  JSON.stringify(data, null, 2);

export const generateAdaptiveCard = ({ notificationPayload }: { notificationPayload: NotificationPayload }): any => {
  // Function to convert plaintext message into clickable links if any
  const formatMessage = (message: string): string => {
    return message.replace(/(https?:\/\/\S+)/g, "[$1]($1)");
  };

  // Construct Adaptive Card JSON
  const adaptiveCard: any = {
    "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
    "type": "AdaptiveCard",
    "version": "1.4",
    "body": [
      {
        "type": "TextBlock",
        "text": formatMessage(notificationPayload.title),
        "weight": "Bolder",
        "size": "Medium"
      },
      {
        "type": "TextBlock",
        "text": formatMessage(notificationPayload.message),
        "wrap": true
      },
      {
        type: "ActionSet",
        "actions": notificationPayload.actions.map(action => {
          if (action.type === "LINK") {
            return {
              "type": "Action.OpenUrl",
              "title": action.title || "Open Link",
              "url": action.url,
              metadata: {
                notificationPayload,
              }
            };
          } else if (action.type === "REQUEST") {
            return {
              type: "Action.Execute",
              title: action.title || "Send Request",
              verb: action.method,
              data: {
                action,
                notificationPayload
              },
            }
          }
        })
      }
    ],
    
  };

  return adaptiveCard;
}
