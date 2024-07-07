import { storage } from '..';

/**
 * Save an attachment from a URL to Google Cloud Storage.
 *
 * @param bucketName - The name of the bucket to save the attachment to.
 * @param url - The URL of the attachment to save.
 * @param destinationFileName - The name of the file to save the attachment as.
 * @returns The name of the file the attachment was saved as.
 */
const saveAttachmentFromUrl = async (
    bucketName: string,
    url: string,
    destinationFileName: string,
) => {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const fileStream = storage
        .bucket(bucketName)
        .file(destinationFileName)
        .createWriteStream({
            metadata: {
                contentType: response.headers.get('Content-Type') || undefined,
            },
        });

    return new Promise((resolve, reject) => {
        fileStream.on('finish', () => {
            resolve(destinationFileName);
        });

        fileStream.on('error', (error) => {
            reject(error);
        });

        fileStream.end(buffer);
    });
};

const deleteAttachmentFromUrl = async (bucketName: string, url: string) => {
    const fileName = url.split('/').pop();

    if (!fileName) {
        return;
    }

    return storage.bucket(bucketName).file(fileName).delete();
};

export { saveAttachmentFromUrl, deleteAttachmentFromUrl };
