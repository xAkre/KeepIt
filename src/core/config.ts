class Config {
    public static readonly MAX_MESSAGES_IN_DATABASE_PER_SERVER = 100;
    public static readonly MAX_ATTACHMENTS_IN_DATABASE_PER_SERVER = 100;
    /**
     * 100 MB
     */
    public static readonly MAX_ATTACHMENT_SIZE_IN_BYTES = 1000 * 100;
    public static readonly GOOGLE_CLOUD_STORAGE_BUCKET =
        'keepit-e11018f5-d289-4691-a05e-34b073abf9c4';
}

export { Config };
