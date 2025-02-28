export default interface NotificationPayload {
  userPrincipalName: string;
  title: string;
  message: string;
  actions: {
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    url: string;
    body?: Record<string, any>;
    headers?: Record<string, string>;
    title: string;
    type: "LINK" | "REQUEST";
  }[];
};