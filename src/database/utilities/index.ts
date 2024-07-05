import { insertMessage } from './messages';

/**
 * Select a scalar value from the database.
 *
 * @param query - The query to execute.
 * @returns A scalar value.
 */
const selectScalar = async <T>(query: Promise<T[]>): Promise<T | null> => {
    const result = await query;

    if (result.length === 0) {
        return null;
    } else {
        return result[0];
    }
};

export { selectScalar, insertMessage };
