import { bigint } from 'drizzle-orm/pg-core';

const discordSnowflake = (columnName: string) => {
    return bigint(columnName, {
        mode: 'bigint',
    });
};

export { discordSnowflake };
