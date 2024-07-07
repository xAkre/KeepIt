class Config {
    public static readonly MAX_MESSAGES_IN_DATABASE_PER_SERVER = 100;
    public static readonly MAX_ATTACHMENTS_IN_DATABASE_PER_SERVER = 100;
    /**
     * 100 MB
     */
    public static readonly MAX_ATTACHMENT_SIZE_IN_BYTES = 1000 * 100;
}

export { Config };
