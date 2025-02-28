import config from "../internal/config";
import { BlobStore } from "../utils/azureTableStorage";

const connectionString = config.BlobStorageConnectionString;

const containerName = config.BlobStorageContainerName;
const blobStore = new BlobStore(connectionString, containerName);

(async () => {
  // test writing to blob storage
    const key   = 'test1';
    const value = {
        conversation: {
            id: 'test',
            tenantId: 'test',
            serviceUrl: 'test',
            activityId: 'test',
            isGroup: false,
            name: 'test',
            "conversationType": "personal",
        },
        user: {
            id: 'test',
            name: 'test',
            aadObjectId: 'test',
        },
        bot: {
            id: 'test',
            name: 'test',
        },
    };
    await blobStore.add(key, value);
    console.log('Added value to blob storage');
    // test reading from blob storage
    const result = await blobStore.get(key);
    console.log('Read value from blob storage:', result);
    // test deleting from blob storage
    // await blobStore.remove(key, result);
    // console.log('Deleted value from blob storage');
}
)();