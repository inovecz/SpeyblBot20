const config = {
  MicrosoftAppId: process.env.BOT_ID,
  MicrosoftAppType: process.env.BOT_TYPE,
  MicrosoftAppTenantId: process.env.BOT_TENANT_ID,
  MicrosoftAppPassword: process.env.BOT_PASSWORD,
  BlobStorageConnectionString: process.env.BLOB_STORAGE_CONNECTION_STRING,
  BlobStorageContainerName: process.env.BLOB_STORAGE_CONTAINER_NAME,
};

export default config;
