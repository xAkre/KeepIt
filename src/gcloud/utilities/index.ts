import { storage } from '..';

/**
 * Save an attachment stored locally to Google Cloud Storage
 *
 * @param bucketName - The name of the bucket to save the attachment to
 * @param filePath - The path to the attachment to save
 * @param destinationFileName - The name to save the attachment as
 * @returns A boolean indicating whether the attachment was saved successfully
 */
const saveLocalAttachment = async (
    bucketName: string,
    filePath: string,
    destinationFileName: string,
) => {
    const options = {
        destination: destinationFileName,
    };

    try {
        await storage.bucket(bucketName).upload(filePath, options);
        return true;
    } catch (error) {
        console.error(
            'Error saving attachment to Google Cloud Storage:',
            error,
        );
        return false;
    }
};

export { saveLocalAttachment };
